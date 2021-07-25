import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from 'redux/slices/userSlice';
import inputsReducer from 'redux/slices/inputsSlice';
import tasksReducer from 'redux/slices/taskSlice';
import prizesReducer from 'redux/slices/prizeSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  user: userReducer,
  inputs: inputsReducer,
  tasks: tasksReducer,
  prizes: prizesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});
