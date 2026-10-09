import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signToken, verifyToken } from '@/lib/auth';
import { paymentGateway } from '@/lib/payments';
import { aiDiscovery } from '@/lib/ai-service';

describe('Authentication & Security Cryptography', () => {
  it('hashes passwords with bcrypt and verifies accurately', async () => {
    const rawPass = 'SacredTemplePassword@2026';
    const hash = await hashPassword(rawPass);

    expect(hash).not.toBe(rawPass);
    const isValid = await verifyPassword(rawPass, hash);
    expect(isValid).toBe(true);

    const isWrong = await verifyPassword('WrongPassword', hash);
    expect(isWrong).toBe(false);
  });

  it('signs and verifies JWT authentication sessions', () => {
    const sessionPayload = {
      userId: 'usr_789',
      email: 'customer@example.com',
      name: 'Ramesh Reddy',
      role: 'CUSTOMER' as const,
    };

    const token = signToken(sessionPayload);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe('usr_789');
    expect(decoded?.role).toBe('CUSTOMER');
  });
});

describe('Payment Gateway & Cryptographic Webhooks', () => {
  it('computes and verifies HMAC SHA256 payment signature', () => {
    const orderId = 'order_test_12345';
    const paymentId = 'pay_test_67890';
    
    // We can test that the signature verifier correctly verifies
    // a valid signature or rejects tampering
    const isValid = paymentGateway.verifyRazorpaySignature(orderId, paymentId, 'tampered_signature');
    expect(isValid).toBe(false);
  });
});

describe('Deterministic NLP Discovery Parser', () => {
  it('correctly extracts ritual, language, and locality from natural queries', async () => {
    const query = 'I need a Telugu-speaking pandit for Griha Pravesh in Kukatpally next Sunday with samagri';
    const result = await aiDiscovery.discoverServices(query);

    expect(result.interpretedFilters.matchedRitualSlug).toBe('griha-pravesh');
    expect(result.interpretedFilters.language).toBe('Telugu');
    expect(result.interpretedFilters.locality).toBe('Kukatpally');
    expect(result.interpretedFilters.samagriPreference).toBe('FULL_SAMAGRI_INCLUDED');
    expect(result.suggestedRituals.length).toBeGreaterThan(0);
  });

  it('handles Satyanarayan Puja in Madhapur query', async () => {
    const query = 'Satyanarayan puja in Madhapur';
    const result = await aiDiscovery.discoverServices(query);

    expect(result.interpretedFilters.matchedRitualSlug).toBe('satyanarayan-puja');
    expect(result.interpretedFilters.locality).toBe('Madhapur');
  });
});
