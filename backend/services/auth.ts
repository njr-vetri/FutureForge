import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { UserRecord } from '../types';

const jwtSecret = process.env.JWT_SECRET || 'careeros-dev-secret-change-me';

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function sign(value: string) {
  return createHmac('sha256', jwtSecret).update(value).digest('base64url');
}

export function hashPassword(password: string, salt = randomBytes(16).toString('base64url')) {
  const hash = createHmac('sha256', salt).update(password).digest('base64url');
  return `${salt}.${hash}`;
}

export function verifyPassword(password: string, storedHash?: string) {
  if (!storedHash) return false;
  const [salt, expected] = storedHash.split('.');
  if (!salt || !expected) return false;
  const actual = hashPassword(password, salt).split('.')[1];
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function createJwt(user: Pick<UserRecord, 'id' | 'email' | 'name'>) {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    })
  );
  const unsigned = `${header}.${payload}`;
  return `${unsigned}.${sign(unsigned)}`;
}

export function verifyJwt(token?: string) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const unsigned = `${parts[0]}.${parts[1]}`;
  const expected = sign(unsigned);
  if (!timingSafeEqual(Buffer.from(parts[2]), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload as { sub: string; email: string; name: string };
}

export function bearerToken(header?: string) {
  return header?.replace(/^Bearer\s+/i, '').trim();
}
