import * as admin from 'firebase-admin';

/**
 * Set a user&#x27;s claims on Firebase Auth
 */
export default async function setUserClaims(input: {
  userId: string;
  claims: {
    admin?: boolean;
    tester?: boolean;
    role?: string;
    locationId?: string;
  };
}) {
  if (!input?.userId) throw new Error('A userId is required.');
  const currentUser = await admin.auth().getUser(input.userId);
  await admin.auth().setCustomUserClaims(input.userId, {
    ...(currentUser?.customClaims || {}),
    ...(input?.claims || {}),
  });

  return currentUser;
}
