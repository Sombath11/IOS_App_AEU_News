import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'kh.edu.aeu.news',
  appName: 'AEU News',
  webDir: 'www',
  server: {
    // Uncomment for live reload during development
    // url: 'http://192.168.1.100:8100',
    // cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false
  }
};

export default config;
