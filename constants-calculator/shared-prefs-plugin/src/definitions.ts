// Define the interfaces for TypeScript
declare module '@capacitor/core' {
  interface PluginRegistry {
    SharedPrefsPlugin: SharedPrefsPlugin;
  }
}

export interface SharedPrefsPlugin {
  getPreference(options: { key: string }): Promise<{ value: string }>;
  setPreference(options: { key: string, value: string }): Promise<void>;
}
