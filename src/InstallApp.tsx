// "Install app" button + a dialog that explains, for every kind of device, how
// to put this web app on the home screen / desktop.
import { useState } from 'react';
import { Check, Download, Monitor, Share, Smartphone, SquarePlus, TabletSmartphone, TriangleAlert } from 'lucide-react';
import { Modal } from './ui';
import { detectBrowser, detectDevice, isInAppBrowser, usePWAInstall, type Device } from './usePWAInstall';

const TABS: { id: Device; label: string; icon: typeof Smartphone }[] = [
  { id: 'ios', label: 'iPhone / iPad', icon: TabletSmartphone },
  { id: 'android', label: 'Android', icon: Smartphone },
  { id: 'desktop', label: 'Computer', icon: Monitor },
];

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm text-[var(--text-2)]">
          <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-sky-400/15 text-sky-300 text-[11px] font-semibold grid place-items-center">{i + 1}</span>
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ol>
  );
}

const B = ({ children }: { children: React.ReactNode }) => <b className="text-[var(--text)] font-semibold">{children}</b>;

function Instructions({ device }: { device: Device }) {
  if (device === 'ios')
    return (
      <div className="space-y-4">
        <Steps
          items={[
            <>Open this website in <B>Safari</B>. (Chrome and Edge on iPhone also work, but Safari is the most reliable.)</>,
            <>Tap the <B>Share</B> button <Share className="inline w-3.5 h-3.5 -mt-0.5" /> (a square with an arrow). It is at the bottom of the screen on iPhone and at the top on iPad.</>,
            <>Scroll down and tap <B>Add to Home Screen</B> <SquarePlus className="inline w-3.5 h-3.5 -mt-0.5" />. If you don't see it, tap <B>View More</B> first.</>,
            <>Tap <B>Add</B>. The app icon now appears on your Home Screen.</>,
          ]}
        />
        <p className="text-xs text-[var(--faint)]">iPhones don't show an install pop-up, so this manual route is the only way.</p>
      </div>
    );
  if (device === 'android')
    return (
      <div className="space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--faint)] mb-2">Chrome (recommended)</div>
          <Steps
            items={[
              <>If you see an <B>Install now</B> button above, tap it. Otherwise tap the <B>⋮</B> menu at the top right.</>,
              <>Tap <B>Install app</B> (some phones say <B>Add to Home screen</B>).</>,
              <>Tap <B>Install</B>. The app appears on your home screen and in your app drawer.</>,
            ]}
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--faint)] mb-2">Samsung Internet</div>
          <Steps items={[<>Tap the <B>☰</B> menu, then <B>Add page to</B>, then <B>Home screen</B>.</>]} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--faint)] mb-2">Firefox</div>
          <Steps items={[<>Tap the <B>⋮</B> menu, then <B>Install</B>.</>]} />
        </div>
      </div>
    );
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--faint)] mb-2">Chrome (Windows, Mac, Linux, Chromebook)</div>
        <Steps
          items={[
            <>If you see an <B>Install now</B> button above, click it. Otherwise click the small install icon <Download className="inline w-3.5 h-3.5 -mt-0.5" /> at the right end of the address bar.</>,
            <>No icon? Click the <B>⋮</B> menu, then <B>Cast, save and share</B>, then <B>Install page as app</B>.</>,
            <>Click <B>Install</B>. It opens in its own window and gets a desktop / Start-menu icon.</>,
          ]}
        />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--faint)] mb-2">Microsoft Edge</div>
        <Steps items={[<>Click the install icon in the address bar, or <B>⋯</B> menu, then <B>Apps</B>, then <B>Install this site as an app</B>, then <B>Install</B>.</>]} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--faint)] mb-2">Safari on Mac (macOS Sonoma or newer)</div>
        <Steps items={[<>Click <B>File</B> in the menu bar (or the Share button), then <B>Add to Dock</B>, then <B>Add</B>.</>]} />
      </div>
      <p className="text-xs text-[var(--faint)]">Firefox on a computer can't install web apps. Open this page in Chrome or Edge instead.</p>
    </div>
  );
}

export function InstallModal({ onClose }: { onClose: () => void }) {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const detected = detectDevice();
  const [tab, setTab] = useState<Device>(detected);
  const [msg, setMsg] = useState('');
  const browser = detectBrowser();
  // wrong browser for the detected device (e.g. Firefox on desktop, Chrome in an in-app webview)
  const warn = isInAppBrowser()
    ? 'You are inside another app’s built-in browser. Open this page in Safari (iPhone) or Chrome (Android) first, using the “Open in browser” option.'
    : detected === 'desktop' && browser === 'firefox'
      ? 'Firefox on a computer cannot install web apps. Open this page in Chrome or Edge.'
      : '';

  return (
    <Modal title="Install Finance Manager" onClose={onClose} width="max-w-lg">
      <p className="text-sm text-[var(--muted)] -mt-1">
        Add the app to your phone, tablet or computer. It opens like a normal app, has its own icon and keeps working offline once opened.
      </p>

      {isInstalled ? (
        <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/[0.07] p-3.5 text-sm text-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4" /> The app is already installed on this device.
        </div>
      ) : (
        <>
          {warn && (
            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/[0.07] p-3 text-xs text-amber-200 flex gap-2">
              <TriangleAlert className="w-4 h-4 shrink-0" /> {warn}
            </div>
          )}
          {isInstallable && (
            <button
              className="btn-primary w-full !py-2.5 mt-4"
              onClick={async () => {
                const ok = await install();
                setMsg(ok ? 'Installed! Look for the app icon.' : 'Install was cancelled. You can try again any time.');
              }}
            >
              <Download className="w-4 h-4" /> Install now
            </button>
          )}
          {msg && <p className="text-xs text-[var(--muted)] mt-2 text-center">{msg}</p>}
        </>
      )}

      <div className="mt-5 flex gap-1 rounded-xl bg-white/[0.03] border border-[var(--border)] p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition ${tab === t.id ? 'bg-sky-400/15 text-sky-200' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
            {t.id === detected && <span className="hidden sm:inline text-[9px] text-[var(--faint)]">(this device)</span>}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Instructions device={tab} />
      </div>
      <p className="text-xs text-[var(--faint)] mt-5 pt-4 border-t border-[var(--border)]">
        Open the app once with internet so it can save itself for offline use. Sign-in needs internet the first time; your data is stored on the device and syncs when you're back online.
      </p>
    </Modal>
  );
}

/** Button that opens the install dialog. Hidden once the app is already installed. */
export function InstallButton({ variant = 'header' }: { variant?: 'header' | 'full' }) {
  const [open, setOpen] = useState(false);
  const { isInstalled } = usePWAInstall();
  if (isInstalled && variant === 'header') return null;
  return (
    <>
      {variant === 'header' ? (
        <button
          onClick={() => setOpen(true)}
          className="h-9 px-2.5 sm:px-3 inline-flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-200 text-xs font-medium hover:bg-sky-400/20 transition"
          aria-label="Install the app"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Install app</span>
        </button>
      ) : (
        <button className="btn-secondary text-xs" onClick={() => setOpen(true)}>
          <Smartphone className="w-3.5 h-3.5" /> {isInstalled ? 'App installed' : 'Install app'}
        </button>
      )}
      {open && <InstallModal onClose={() => setOpen(false)} />}
    </>
  );
}
