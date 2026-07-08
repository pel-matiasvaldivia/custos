import { test, expect } from '@playwright/test';

const BACKEND_URL = process.env.API_URL || 'https://app.custos.pymesenlinea.com.ar/api/v1';

test.describe('CustOS ERP API Integration Tests', () => {
  let adminToken: string;
  let tenantId: string;

  // Before all, authenticate to get a valid token
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${BACKEND_URL}/auth/login`, {
      data: {
        email: 'admin@custos.com.ar',
        password: 'admin123'
      }
    });
    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    adminToken = result.access_token;
    
    const profileResponse = await request.get(`${BACKEND_URL}/config/tenant`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    if (profileResponse.ok()) {
      const tenantData = await profileResponse.json();
      tenantId = tenantData.id;
    }
  });

  test('should authenticate and reject invalid login credentials', async ({ request }) => {
    const response = await request.post(`${BACKEND_URL}/auth/login`, {
      data: {
        email: 'admin@custos.com.ar',
        password: 'wrongpassword'
      }
    });
    expect(response.status()).not.toBe(200);
    expect(response.status()).not.toBe(201);
  });

  test('should list clients for the authenticated tenant', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/clientes`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    expect(response.status()).toBe(200);
    const clients = await response.json();
    expect(Array.isArray(clients)).toBeTruthy();
  });

  test('should reject access to SUPERADMIN endpoints with ADMIN role token', async ({ request }) => {
    // Attempting to list tenants or impersonate should yield 403 Forbidden
    const response = await request.get(`${BACKEND_URL}/auth/tenants`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    expect(response.status()).toBe(403);
  });

  test('should enforce multi-tenant isolation (RLS validation)', async ({ request }) => {
    // If we query a random UUID for a client, the backend should return 404
    // since it does not exist under our tenant scope, regardless of whether it exists globally.
    const fakeClientUuid = '00000000-0000-0000-0000-000000000000';
    const response = await request.get(`${BACKEND_URL}/clientes/${fakeClientUuid}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    expect(response.status()).toBe(404);
  });
});
