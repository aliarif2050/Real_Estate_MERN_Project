import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js'
import { persistReducer, persistStore } from 'redux-persist'
const rootReducer = combineReducers({ user: userReducer })
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
const persistConfig = { 
  key: 'root',
  version: 1,
  storage: storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer:persistedReducer, 
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
  devTools: true

})
export const persistor = persistStore(store)