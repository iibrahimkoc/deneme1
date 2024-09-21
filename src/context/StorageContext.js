import React, { createContext, useContext } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const StorageContext = createContext(storage);

export const StorageProvider = ({ children }) => {
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
