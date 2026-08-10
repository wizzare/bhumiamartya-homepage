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

function logSanitizedAuthError(err) {
  const status = err?.response?.status ?? 'N/A';
  const googleError = err?.response?.data?.error ?? err?.code ?? err?.name ?? 'UNKNOWN';
  const description = err?.response?.data?.error_description ?? err?.message ?? '';
  console.error(`[gcp-oidc] stage=sts status=${status} error=${googleError} description="${description}"`);
}

function wrapAuthClientDiagnostics(authClient) {
  const wrapped = authClient;
  const originalGetAccessToken = authClient.getAccessToken.bind(authClient);
  const originalAuthorize = authClient.authorize ? authClient.authorize.bind(authClient) : null;
  const originalGetRequestHeaders = authClient.getRequestHeaders ? authClient.getRequestHeaders.bind(authClient) : null;

  wrapped.getAccessToken = async function getAccessTokenDiagnostic(...args) {
    try {
      return await originalGetAccessToken(...args);
    } catch (err) {
      logSanitizedAuthError(err);
      throw err;
    }
  };
  if (originalAuthorize) {
    wrapped.authorize = async function authorizeDiagnostic(...args) {
      try {
        return await originalAuthorize(...args);
      } catch (err) {
        logSanitizedAuthError(err);
        throw err;
      }
    };
  }
  if (originalGetRequestHeaders) {
    wrapped.getRequestHeaders = async function getRequestHeadersDiagnostic(...args) {
      try {
        return await originalGetRequestHeaders(...args);
      } catch (err) {
        logSanitizedAuthError(err);
        throw err;
      }
    };
  }
  return wrapped;
}

export function createContentAuthClient(env) {
  if (!env) throw new Error('GCP content auth env missing');
  const client = new IdentityPoolClient({
    audience: `//iam.googleapis.com/projects/${env.GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${env.GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${env.GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      // TEMP DIAGNOSTIC — remove after STS 400 root-cause identified
      async getSubjectToken() {
        try {
          const token = await getVercelOidcToken();
          if (!token) {
            throw new Error('Vercel OIDC token unavailable');
          }
          return token;
        } catch (err) {
          logSanitizedAuthError(err);
          throw err;
        }
      }
    }
  });
  return wrapAuthClientDiagnostics(client);
}

export async function getFirestoreClient(tokenSupplier = getVercelOidcToken) {
  const { Firestore } = await import('@google-cloud/firestore');
  const env = getGcpEnv();
  if (!env) throw new Error('GCP content env not configured');
  const authClient = wrapAuthClientDiagnostics(new IdentityPoolClient({
    audience: `//iam.googleapis.com/projects/${env.GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${env.GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${env.GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      // TEMP DIAGNOSTIC — remove after STS 400 root-cause identified
      async getSubjectToken() {
        try {
          const token = await tokenSupplier();
          if (!token) {
            throw new Error('Vercel OIDC token unavailable');
          }
          return token;
        } catch (err) {
          logSanitizedAuthError(err);
          throw err;
        }
      }
    }
  }));
  return { firestore: new Firestore({ projectId: env.GCP_PROJECT_ID, authClient }), env };
}