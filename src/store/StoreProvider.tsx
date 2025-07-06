'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { setInitialState } from './authSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef(store);
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    storeRef.current.dispatch(setInitialState());
    isInitialized.current = true;
  }
  
  return <Provider store={storeRef.current}>{children}</Provider>;
}
