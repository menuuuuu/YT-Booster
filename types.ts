
export type Screen = 'home' | 'setup' | 'viewer';

export interface AppState {
  currentScreen: Screen;
  videoUrl: string;
  windowCount: number;
}
