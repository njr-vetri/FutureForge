import crypto from 'node:crypto';
import { FirebaseUser } from '../types';

type FirebaseCertCache = {
  expiresAt: number;
  certs: Record<string, string>;
};

let certCache: FirebaseCertCache | null = null;

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64').toString('utf8');
}

function decodeJwtPart<T>(tokenPart: string): T {
  return JSON.parse(base64UrlDecode(tokenPart)) as T;
}

async function getFirebaseCerts() {
  const now = Date.now();
  if (certCache && certCache.expiresAt > now) return certCache.certs;

  const response = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );

  if (!response.ok) {
    throw new Error('Unable to fetch Firebase public certificates');
  }

  const cacheControl = response.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 60 * 60 * 1000;
  const certs = (await response.json()) as Record<string, string>;

  certCache = {
    certs,
    expiresAt: now + maxAgeMs,
  };

  return certs;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseUser> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured');
  }

  const [encodedHeader, encodedPayload, signature] = idToken.split('.');
  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('Invalid Firebase ID token format');
  }

  const header = decodeJwtPart<{ kid?: string; alg?: string }>(encodedHeader);
  const payload = decodeJwtPart<{
    aud: string;
    iss: string;
    exp: number;
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  }>(encodedPayload);

  if (header.alg !== 'RS256' || !header.kid) {
    throw new Error('Unsupported Firebase token algorithm');
  }

  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error('Firebase token project mismatch');
  }

  if (payload.exp * 1000 <= Date.now()) {
    throw new Error('Firebase token expired');
  }

  const certs = await getFirebaseCerts();
  const cert = certs[header.kid];
  if (!cert) {
    throw new Error('Firebase certificate not found for token key');
  }

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();

  const signatureBuffer = Buffer.from(signature.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const isValid = verifier.verify(cert, signatureBuffer);
  if (!isValid) {
    throw new Error('Firebase token signature verification failed');
  }

  return {
    uid: payload.sub,
    email: payload.email || `${payload.sub}@firebase.local`,
    name: payload.name || 'CareerOS Student',
    picture: payload.picture,
  };
}

export async function getFirebaseUserFromHeader(authHeader?: string) {
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  if (!token) return null;
  return verifyFirebaseIdToken(token);
}

