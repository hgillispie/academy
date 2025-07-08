'use client';
import { useEffect, useState, useMemo } from 'react';
import * as amplitudeSDK from '@amplitude/analytics-browser';
import mockSDK from './mockAmplitudeSDK';
import { useAuthContext } from '@/providers/AuthProvider';
import { AnalyticsContext, AnalyticsContextState } from './AnalyticsContext';
import { useIsPreviewing } from '@builder.io/react';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    // CONFIRM: Throw error instead?
    console.error('Missing Amplitude API key in production environment');
  }
}

// Track to console logs for local testing
const amplitude =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
    ? amplitudeSDK
    : mockSDK;

const AMPLITUDE_SETTINGS = {
  autocapture: {
    attribution: false,
    pageViews: true,
    sessions: true,
    formInteractions: false,
    fileDownloads: false,
    elementInteractions: false,
  },
};

export const AnalyticsProvider = ({ children }: React.PropsWithChildren) => {
  const { user, isLoading } = useAuthContext();
  const [isInitialized, setInitialized] = useState(false);
  const isPreviewing = useIsPreviewing();

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!;

  // Don't log events if we're in preview mode
  const analytics = useMemo<AnalyticsContextState>(
    () => ({
      trackEvent: (name, data) => {
        if (isPreviewing) return;
        amplitude.track(name, data);
      },
    }),
    [isPreviewing],
  );

  useEffect(() => {
    if (isLoading || isInitialized || isPreviewing) return;

    if (user?.id) {
      amplitude.init(apiKey, user.email ?? user.id, AMPLITUDE_SETTINGS);
    } else {
      amplitude.init(apiKey, AMPLITUDE_SETTINGS);
    }
    setInitialized(true);
  }, [apiKey, isInitialized, user, isLoading, isPreviewing]);

  useEffect(() => {
    if (user?.id) {
      if (user?.type) {
        const identifyEvent = new amplitude.Identify();
        identifyEvent.set('type', user.type);
        amplitude.identify(identifyEvent);
      }

      amplitude.setUserId(user.email ?? user.id);
    }
  }, [user, analytics]);

  return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>;
};

export default AnalyticsProvider;
