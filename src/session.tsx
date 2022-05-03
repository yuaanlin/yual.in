import User from '../models/user';
import { createContext, useContext } from 'react';

export const sessionContext = createContext<{ session: User | null }>(
  { session: null });

export const useSession = () => {
  const context = useContext(sessionContext);
  if (context === undefined) {
    throw new Error(
      'useSession must be used within a SessionProvider'
    );
  }
  return context;
};

export const SessionProvider = sessionContext.Provider;
