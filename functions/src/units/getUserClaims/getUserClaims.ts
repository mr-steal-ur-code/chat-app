import admin from 'firebase-admin';

/**
 * Get a user&#x27;s claims on Firebase Auth
 */
export default async function getUserClaims({ userId }: { userId: string }) {
  if (!userId) throw new Error('A userId is required.');
  return admin.auth().getUser(userId);
}
