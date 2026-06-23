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

  // 3. Create Sample Vigiladores
  const v1 = await prisma.vigilador.create({
    data: {
      tenant_id: tenant.id,
      legajo_nro: 'V001',
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '28.123.456',
      estado: 'ACTIVO',
    },
  });

  const v2 = await prisma.vigilador.create({
    data: {
      tenant_id: tenant.id,
      legajo_nro: 'V002',
      nombre: 'María',
      apellido: 'González',
      documento: '31.987.654',
      estado: 'ACTIVO',
    },
  });

  const v3 = await prisma.vigilador.create({
    data: {
      tenant_id: tenant.id,
      legajo_nro: 'V003',
      nombre: 'Ricardo',
      apellido: 'Tapia',
      documento: '25.444.555',
      estado: 'SUSPENDIDO',
    },
  });

  console.log('Created sample vigiladores');

  // 4. Create Sample Puestos
  const p1 = await prisma.puesto.create({
    data: {
      tenant_id: tenant.id,
      nombre: 'Objetivo Centro - Acceso A',
      ubicacion: 'Av. Corrientes 1234, CABA',
    },
  });

  const p2 = await prisma.puesto.create({
    data: {
      tenant_id: tenant.id,
      nombre: 'Fábrica Sur - Portón 2',
      ubicacion: 'Ruta 3 km 45, Cañuelas',
    },
  });

  console.log('Created sample puestos');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
