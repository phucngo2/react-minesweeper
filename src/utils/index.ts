import { APP_STORAGE_KEY } from "@app/config";
import { AppStorage } from "@app/types";

export function saveAppStorage(appStorage: AppStorage) {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appStorage));
}

export function retrieveAppStorage(): AppStorage | null {
  const json = localStorage.getItem(APP_STORAGE_KEY);
  return json ? JSON.parse(json) : null;
}
