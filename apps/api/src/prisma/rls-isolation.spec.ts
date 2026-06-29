import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { TenantContextService } from '../common/context/tenant-context.service';

/**
 * Test de aislamiento multi-tenant (RLS) de extremo a extremo, a través del
 * PrismaService real. Prueba que un tenant nunca lee ni escribe datos de otro.
 *
 * Requiere una base con el esquema + la migración de RLS y DOS roles:
 *   - RLS_TEST_ADMIN_URL: rol owner/superuser (para sembrar datos).
 *   - RLS_TEST_APP_URL:   rol de app SIN privilegios (como conecta producción).
 * Sin esas variables el bloque se saltea (CI sin DB queda verde).
 *
 *   RLS_TEST_ADMIN_URL=postgresql://owner:pass@host:5432/custos_rls_test \
 *   RLS_TEST_APP_URL=postgresql://custos_app:pass@host:5432/custos_rls_test \
 *   npm test -- rls-isolation
 */
const ADMIN_URL = process.env.RLS_TEST_ADMIN_URL;
const APP_URL = process.env.RLS_TEST_APP_URL;
const suite = ADMIN_URL && APP_URL ? describe : describe.skip;

const TA = 'aaaaaaaa-0000-0000-0000-000000000001';
const TB = 'bbbbbbbb-0000-0000-0000-000000000002';

suite('RLS · aislamiento multi-tenant', () => {
  let admin: PrismaClient;
  let ctx: TenantContextService;
  let prisma: PrismaService;

  beforeAll(async () => {
    admin = new PrismaClient({ datasources: { db: { url: ADMIN_URL } } });
    await admin.$executeRawUnsafe(`DELETE FROM vigiladores WHERE tenant_id IN ('${TA}','${TB}')`);
    await admin.$executeRawUnsafe(
      `INSERT INTO tenants (id,nombre) VALUES ('${TA}','Empresa A'),('${TB}','Empresa B') ON CONFLICT (id) DO NOTHING`,
    );
    await admin.$executeRawUnsafe(
      `INSERT INTO vigiladores (id,tenant_id,legajo_nro,nombre,apellido,documento) VALUES
       (gen_random_uuid(),'${TA}','A-1','Ana','Alvarez','1'),
       (gen_random_uuid(),'${TB}','B-1','Bruno','Benitez','2')`,
    );

    process.env.DATABASE_URL = APP_URL;
    ctx = new TenantContextService();
    prisma = new PrismaService(ctx);
  });

  afterAll(async () => {
    if (admin) {
      await admin.$executeRawUnsafe(`DELETE FROM vigiladores WHERE tenant_id IN ('${TA}','${TB}')`);
      await admin.$disconnect();
    }
    if (prisma) await (prisma as unknown as PrismaClient).$disconnect();
  });

  it('el tenant A solo ve sus propios vigiladores', async () => {
    const rows = await ctx.run(TA, async () => prisma.vigilador.findMany());
    expect(rows.map((r: { nombre: string }) => r.nombre)).toEqual(['Ana']);
  });

  it('el tenant B solo ve los suyos', async () => {
    const rows = await ctx.run(TB, async () => prisma.vigilador.findMany());
    expect(rows.map((r: { nombre: string }) => r.nombre)).toEqual(['Bruno']);
  });

  it('sin contexto de tenant no ve nada (fail-closed)', async () => {
    const rows = await prisma.vigilador.findMany();
    expect(rows).toHaveLength(0);
  });

  it('no puede crear un registro en otro tenant (WITH CHECK lo bloquea)', async () => {
    await expect(
      ctx.run(TA, async () =>
        prisma.vigilador.create({
          data: { tenant_id: TB, legajo_nro: 'X-9', nombre: 'Intruso', apellido: 'X', documento: '9' },
        }),
      ),
    ).rejects.toThrow();
  });
});
