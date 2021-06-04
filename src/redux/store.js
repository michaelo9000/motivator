import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import inputsReducer from './slices/inputsSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    inputs: inputsReducer
  },
});