import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@custos.com.ar';
  const password = 'CustosSuperAdmin2026!'; // Temporary secure password
  const tenantName = 'Custos Global Administration';

  console.log('--- CustOS Superadmin Generation ---');

  // 1. Ensure Tenant exists
  let tenant = await prisma.tenant.findFirst({
    where: { nombre: tenantName }
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        nombre: tenantName,
        razon_social: 'CustOS Software Solutions',
        factor_cobertura: 4.20,
      }
    });
    console.log(`Created Master Tenant: ${tenant.nombre} (${tenant.id})`);
  } else {
    console.log(`Using existing Master Tenant: ${tenant.nombre}`);
  }

  // 2. Ensure Superadmin User exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    console.log(`User ${email} already exists. Updating password...`);
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { 
        password: passwordHash,
        role: 'SUPERADMIN',
        tenant_id: tenant.id
      }
    });
  } else {
    console.log(`Creating Superadmin: ${email}...`);
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        tenant_id: tenant.id,
        email,
        password: passwordHash,
        role: 'SUPERADMIN',
      }
    });
  }

  console.log('------------------------------------');
  console.log('CREDENTIALS GENERATED SUCCESSFULLY:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error generating superadmin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
