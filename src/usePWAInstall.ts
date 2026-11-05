import { useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type Device = 'ios' | 'android' | 'desktop';
export type BrowserName = 'safari' | 'chrome' | 'edge' | 'firefox' | 'samsung' | 'other';

// Browsers (Chrome, Edge, Android) fire `beforeinstallprompt` once, early. It is
// captured here at start-up so it is not lost if the install button appears later.
let deferred: BeforeInstallPromptEvent | null = null;
const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: window-controls-overlay)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true);
let installed = isStandalone();
let snapshot = { canPrompt: false, installed };
const listeners = new Set<() => void>();
const emit = () => {
  snapshot = { canPrompt: !!deferred, installed };
  listeners.forEach((l) => l());
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferred = null;
    emit();
  });
}

export function detectDevice(): Device {
  const ua = navigator.userAgent;
  // iPadOS 13+ reports itself as a Mac, but it has a touch screen
  if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

export function detectBrowser(): BrowserName {
  const ua = navigator.userAgent;
  if (/SamsungBrowser/i.test(ua)) return 'samsung';
  if (/Edg(e|A|iOS)?\//i.test(ua)) return 'edge';
  if (/Firefox|FxiOS/i.test(ua)) return 'firefox';
  if (/Chrome|CriOS/i.test(ua)) return 'chrome';
  if (/Safari/i.test(ua)) return 'safari';
  return 'other';
}

/** Facebook/Instagram/TikTok etc. open links in a mini browser that cannot install apps. */
export const isInAppBrowser = () => /FBAN|FBAV|Instagram|TikTok|Line\/|Snapchat|Twitter|MicroMessenger/i.test(navigator.userAgent);

export function usePWAInstall() {
  const s = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
  );

  /** Shows the browser's own install dialog. Returns false when it isn't available (see InstallApp for manual steps). */
  const install = async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    deferred = null;
    if (outcome === 'accepted') installed = true;
    emit();
    return outcome === 'accepted';
  };

  return {
    isInstallable: s.canPrompt,
    isInstalled: s.installed,
    isIOS: detectDevice() === 'ios',
    install,
  };
}
