import { AwsCredential } from './credentials';

/**
 * Get AWS config object for SDK v3 clients
 */
export function getAwsConfig(credential: AwsCredential) {
  return {
    region: credential.region,
    credentials: {
      accessKeyId: credential.accessKeyId,
      secretAccessKey: credential.secretKey
    }
  };
} 