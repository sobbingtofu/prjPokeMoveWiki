export function openDB(
  DB_NAME: string,
  DB_VERSION: number,
  STORE_NAME: string,
  META_STORE: string
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = function () {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {keyPath: "id"});
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, {keyPath: "key"});
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDBMeta(db: IDBDatabase, META_STORE: string) {
  return new Promise<{addedAt: number} | null>((resolve) => {
    const tx = db.transaction(META_STORE, "readonly");
    const store = tx.objectStore(META_STORE);
    const req = store.get("addedAt");
    req.onsuccess = () => resolve(req.result ? {addedAt: req.result.value} : null);
    req.onerror = () => resolve(null);
  });
}

export async function getFromDB(db: IDBDatabase, STORE_NAME: string) {
  return new Promise<any[]>((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve([]);
  });
}

export async function saveToDB(db: IDBDatabase, items: any[], STORE_NAME: string, META_STORE: string) {
  return new Promise<void>((resolve) => {
    const tx = db.transaction([STORE_NAME, META_STORE], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    items.forEach((item) => store.put(item));
    const metaStore = tx.objectStore(META_STORE);
    metaStore.put({key: "addedAt", value: Date.now()});
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}
