import localforage from 'localforage';
import cleanObjectOfReferences from './cleanObjectOfReferences';

export default async function setCache(key: string, value: any): Promise<any> {
  if (!value && value !== false) return value;
  try {
    await localforage?.setItem?.(key, await cleanObjectOfReferences(value));
  } catch (error) {
    console.log(key, value, 'Error setting data from cache with localforage', error);
  }

  return value;
}
