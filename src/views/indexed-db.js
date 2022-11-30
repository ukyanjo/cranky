let database;

const openDatabase = () => {
  const db = new Promise((resolve, reject) => {
    const onRequest = indexedDB.open("shopping", 1);

    onRequest.onupgradeneeded = () => {
      console.log("indexeddb의 업그레이드가 진행됩니다.");
      const database = onRequest.result;
      database.createObjectStore("cart", {
        autoIncrement: true,
      });
      database.createObjectStore("order", {
        autoIncrement: true,
      });
    };

    onRequest.onsuccess = async () => {
      console.log("indexeddb가 정상적으로 연결됐습니다.");
      resolve(onRequest.result);
    };

    onRequest.onerror = () => {
      const err = onRequest.error;
      console.log(`오류가 발생했습니다: ${err}`);
      reject(err);
    };
  });

  return db;
};

const getFromDb = async (storeName, key = "") => {
  if (!database) {
    database = await openDatabase();
  }
  const transaction = database.transaction([storeName]);
  const store = transaction.objectStore(storeName);
  const data = new Promise((resolve, reject) => {
    const getRequest = key ? store.get(key) : store.getAll();

    getRequest.onsuccess = () => {
      resolve(getRequest.result);
    };

    getRequest.onerror = () => {
      const err = getRequest.error;
      console.log(`오류가 발생했습니다: ${err}`);
      reject(err);
    };
  });
  return data;
};

const addToDb = async (storeName, entry, key = "") => {
  if (!database) {
    database = await openDatabase();
  }
  const transaction = database.transaction([storeName], "readwrite");
  const store = transaction.objectStore(storeName);

  const result = new Promise((resolve, reject) => {
    const addRequest = key ? store.add(entry, key) : store.add(entry);

    addRequest.onsuccess = () => {
      console.log(`정상적으로 추가됐습니다.`);
      resolve();
    };

    addRequest.onerror = () => {
      const err = addRequest.error;
      console.log(`오류가 발생했습니다: ${err}`);
      reject(err);
    };
  });
  return result;
};

const putToDb = async (storeName, key, dataModifyFunc) => {
  if (!database) {
    database = await openDatabase();
  }
  const transaction = database.transaction([storeName], "readwrite");
  const store = transaction.objectStore(storeName);

  const result = new Promise((resolve, reject) => {
    const getRequest = store.get(key);

    getRequest.onsuccess = () => {
      const data = getRequest.result || {};
      dataModifyFunc(data);
      const putRequest = store.put(data, key);
      putRequest.onsuccess = () => {
        console.log(`정상적으로 수정됐습니다.`);
        resolve();
      };

      putRequest.onerror = () => {
        const err = putRequest.error;
        console.log(`에러가 발생했습니다: ${err} `);
        reject(err);
      };
    };
  });
  return result;
};

const deleteFromDb = async (storeName, key = "") => {
  if (!database) {
    database = await openDatabase();
  }
  const transaction = database.transaction([storeName], "readwrite");
  const store = transaction.objectStore(storeName);

  const result = new Promise((resolve, reject) => {
    const deleteRequest = key ? store.delete(key) : store.clear();

    deleteRequest.onsuccess = () => {
      console.log(`정상적으로 삭제됐습니다.`);
      resolve();
    };

    deleteRequest.onerror = () => {
      const err = deleteRequest.error;
      console.log(`에러가 발생했습니다: ${err} `);
      reject(err);
    };
  });

  return result;
};

export { getFromDb, addToDb, putToDb, deleteFromDb };
