import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import mmkvStorage from './mmkvStorage';
import expenseReducer from './slices/expenseSlice';
import incomeReducer from './slices/incomeSlice';
import allTransactionReducer from './slices/allTransactionSlice';
import balanceReducer from './slices/balanceSlice';
import { thunk } from 'redux-thunk';

const rootReducer = combineReducers({
  income: incomeReducer,
  expense: expenseReducer,
  allTransaction: allTransactionReducer,
  balance: balanceReducer,
});

const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
  whitelist: ['income', 'expense', 'allTransaction', 'balance'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
