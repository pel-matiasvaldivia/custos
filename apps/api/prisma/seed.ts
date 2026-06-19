import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Create a Tenant
  const tenant = await prisma.tenant.create({
    data: {
      nombre: 'Empresa de Seguridad Local',
      factor_cobertura: 4.25,
      margen_objetivo: 0.2000,
    },
  });

  console.log('Created tenant:', tenant.nombre);

  // 2. Create an Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      tenant_id: tenant.id,
      email: 'admin@custos.com.ar',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
