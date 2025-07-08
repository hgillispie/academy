/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock implementation of Amplitude SDK with TypeScript
import { Identify, Types } from '@amplitude/analytics-browser';

interface AmplitudeMock {
  Identify: typeof Identify;
  identify: (identifyEvent: Identify) => void;
  track: (eventName: string, eventProperties?: Record<string, any>) => void;
  setUserId: (userId: string) => void;

  init: {
    (apiKey: string, options?: Types.BrowserOptions | undefined): void;
    (apiKey: string, userId?: string, options?: Types.BrowserOptions | undefined): void;
  };
}

const mockAmplitude: AmplitudeMock = {
  // Real Amplitude Identify class
  Identify: Identify,

  // Mock identify method that logs the event
  identify: function (identifyEvent: Identify) {
    console.log(
      'Amplitude identify called with properties:',
      JSON.parse(JSON.stringify(identifyEvent.getUserProperties())),
    );
  },

  setUserId: function (userId: string): void {
    console.log('Amplitude setUserId called with userId:', userId);
  },

  track: function (eventName: string, eventProperties?: Record<string, any>) {
    console.log(
      'Amplitude track called with eventName:',
      eventName,
      'and properties:',
      eventProperties,
    );
  },
  init: function (apiKey: string, ...args: any[]): void {
    console.log('Amplitude init called with apiKey:', apiKey, 'and args:', args);
  },
};

export default mockAmplitude;
export { mockAmplitude as amplitude };
