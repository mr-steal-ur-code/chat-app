import localforage from "localforage";

export default async function getCache(key: string, defaultValue?: any) {
  let data = null;
  try {
    data = await localforage?.getItem?.(key);
  } catch (error) {
    console.warn("Error fetching data from cache with localforage", error);
    try {
      data = localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : null;
    } catch (err) {
      console.warn("Error fetching data from cache with LocalStorage", err);
    }
  }

  return data === null && typeof defaultValue !== "undefined"
    ? defaultValue
    : data;
}
