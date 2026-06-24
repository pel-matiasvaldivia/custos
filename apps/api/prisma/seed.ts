import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 0. Create Master Superadmin Tenant & User
  const superHash = await bcrypt.hash('CustosSuperAdmin2026!', 10);
  const masterTenant = await prisma.tenant.upsert({
    where: { cuit: '00-00000000-0' }, // Dummy unique CUIT for master
    update: {},
    create: {
      nombre: 'CustOS Global Administration',
      cuit: '00-00000000-0',
      factor_cobertura: 4.20,
    }
  });

  await prisma.user.upsert({
    where: { email: 'superadmin@custos.com.ar' },
    update: { role: 'SUPERADMIN' },
    create: {
      tenant_id: masterTenant.id,
      email: 'superadmin@custos.com.ar',
      password: superHash,
      role: 'SUPERADMIN',
    }
  });

  console.log('Master Superadmin initialized.');

  // 1. Create a Sample Tenant for demo
  const tenant = await prisma.tenant.upsert({
    where: { cuit: '30-12345678-9' },
    update: {},
    create: {
      nombre: 'Empresa de Seguridad Local',
      cuit: '30-12345678-9',
      factor_cobertura: 4.25,
      margen_objetivo: 0.2000,
    },
  });

  console.log('Sample tenant initialized:', tenant.nombre);

  // 2. Create an Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@custos.com.ar' },
    update: {},
    create: {
      tenant_id: tenant.id,
      email: 'admin@custos.com.ar',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Sample admin user initialized.');

  // 3. Create Sample Vigiladores
  const vigiladores = [
    { legajo: 'V001', nombre: 'Juan', apellido: 'Pérez', dni: '28.123.456' },
    { legajo: 'V002', nombre: 'María', apellido: 'González', dni: '31.987.654' },
    { legajo: 'V003', nombre: 'Ricardo', apellido: 'Tapia', dni: '25.444.555', estado: 'SUSPENDIDO' },
  ];

  for (const v of vigiladores) {
    await prisma.vigilador.upsert({
      where: { tenant_id_legajo_nro: { tenant_id: tenant.id, legajo_nro: v.legajo } },
      update: {},
      create: {
        tenant_id: tenant.id,
        legajo_nro: v.legajo,
        nombre: v.nombre,
        apellido: v.apellido,
        documento: v.dni,
        estado: v.estado ?? 'ACTIVO',
      },
    });
  }

  console.log('Sample vigiladores initialized.');

  // 4. Create Sample Objetivo (referencia para los puestos)
  const objetivo = await prisma.objetivo.upsert({
    where: { tenant_id_codigo: { tenant_id: tenant.id, codigo: 'OBJ-001' } },
    update: {},
    create: {
      tenant_id: tenant.id,
      cliente_id: tenant.id, // using tenant as client reference
      codigo: 'OBJ-001',
      nombre: 'Objetivo Centro',
      direccion: 'Av. Corrientes 1234, CABA',
    },
  });

  // 5. Create Sample Puestos
  const puestos = [
    { nombre: 'Objetivo Centro - Acceso A', ubicacion: 'Av. Corrientes 1234, CABA' },
    { nombre: 'Fábrica Sur - Portón 2', ubicacion: 'Ruta 3 km 45, Cañuelas' },
  ];

  for (const p of puestos) {
    const existe = await prisma.puesto.findFirst({
      where: { tenant_id: tenant.id, nombre: p.nombre },
    });
    if (existe) continue;
    await prisma.puesto.create({
      data: {
        tenant_id: tenant.id,
        objetivo_id: objetivo.id,
        nombre: p.nombre,
        ubicacion: p.ubicacion,
        requiere_arma: false,
        requiere_movil: false,
        esquema_horario: { horas_dia: 24, dias: [1, 2, 3, 4, 5, 6, 7] },
      },
    });
  }

  console.log('Sample puestos initialized.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
