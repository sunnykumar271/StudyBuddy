import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import themeReducer from '../features/themeSlice';
import groupReducer from '../features/groupSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    group: groupReducer,
  },
});

export default store;
