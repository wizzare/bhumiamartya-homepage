import { getVercelOidcToken } from '@vercel/oidc';
import { IdentityPoolClient } from 'google-auth-library';

const ENV_NAMES = [
  'GCP_PROJECT_ID',
  'GCP_PROJECT_NUMBER',
  'GCP_SERVICE_ACCOUNT_EMAIL',
  'GCP_WORKLOAD_IDENTITY_POOL_ID',
  'GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID'
];

export function getGcpEnv() {
  const values = {};
  for (const name of ENV_NAMES) {
    const value = process.env[name];
    if (!value || !value.trim()) {
      return null;
    }
    values[name] = value.trim();
  }
  return values;
}

export function createContentAuthClient(env) {
  if (!env) throw new Error('GCP content auth env missing');
  return new IdentityPoolClient({
    audience: `//iam.googleapis.com/projects/${env.GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${env.GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${env.GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      async getSubjectToken() {
        const token = await getVercelOidcToken();
        if (!token) {
          throw new Error('Vercel OIDC token unavailable');
        }
        return token;
      }
    }
  });
}

export async function getFirestoreClient(tokenSupplier = getVercelOidcToken) {
  const { Firestore } = await import('@google-cloud/firestore');
  const env = getGcpEnv();
  if (!env) throw new Error('GCP content env not configured');
  const authClient = new IdentityPoolClient({
    audience: `//iam.googleapis.com/projects/${env.GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${env.GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${env.GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      async getSubjectToken() {
        const token = await tokenSupplier();
        if (!token) {
          throw new Error('Vercel OIDC token unavailable');
        }
        return token;
      }
    }
  });
  return { firestore: new Firestore({ projectId: env.GCP_PROJECT_ID, authClient }), env };
}