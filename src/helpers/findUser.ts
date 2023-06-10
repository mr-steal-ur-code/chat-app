import { DatabaseService } from '@fireenjin/sdk';
import { User } from '../interfaces';
import state from '../store';
import isAdmin from './isAdmin';
import setCache from './setCache';

export default async function findUser(db: DatabaseService, id: string, useCache = false): Promise<User> {
  if (useCache && state?.users?.[id]) return state.users[id];
  const data = await db.find?.('users', id);
  if (isAdmin()) data.account = await db.find?.('accounts', id);
  state.users = { ...(state?.users || {}), [id]: data };
  await setCache('chatApp:users', state.users);
  if (!data) return null;
  return { ...data, id };
}
