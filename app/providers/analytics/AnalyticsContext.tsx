'use client';
import { createContext, useContext } from 'react';

export type AnalyticsContextState = {
  // TODO: type the data object for strict analytics tracking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackEvent: (name: string, data?: Record<string, any>) => void;
};

export const AnalyticsContext = createContext<AnalyticsContextState | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within a AnalyticsContextProvider');
  }
  return context;
};
