import localforage from "localforage";
import getCache from "./getCache";

export default async function clearCache(key?: string): Promise<any> {
  let data = key ? await getCache(key, null) : null;
  try {
    if (key) {
      await localforage.removeItem(key);
    } else {
      await localforage.clear();
    }
  } catch (error) {
    console.warn("Error clearing data from cache with localforage", error);
  }

  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  } catch (err) {
    console.warn("Error clearing data from cache with LocalStorage", err);
  }

  return data;
}
