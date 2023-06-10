import * as admin from 'firebase-admin';
import { UserRole } from '../../objects/UserRoles';

/**
 * Set a user&#x27;s claims on Firebase Auth
 */
export default async function setUserClaims(input: {
  userId: string;
  claims: {
    admin?: boolean;
    tester?: boolean;
    role?: UserRole;
  };
}) {
  if (!input?.userId) throw new Error('A userId is required.');
  const currentUser = await admin.auth().getUser(input.userId);
  const claims = {
    ...(currentUser?.customClaims || {}),
    ...(input?.claims || {}),
  };
  await admin.auth().setCustomUserClaims(input.userId, claims);

  return claims;
}
