import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const standalone =
        window.matchMedia?.("(display-mode: standalone)")?.matches ||
        // @ts-expect-error iOS Safari
        window.navigator?.standalone === true;
      setIsInstalled(!!standalone);
    };

    checkInstalled();

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // impede o mini-infobar automático
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return { outcome: "dismissed" as const };

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    // limpar depois de usar (o browser geralmente só permite uma vez)
    setDeferredPrompt(null);
    setIsInstallable(false);

    return choice;
  }

  return { isInstallable, isInstalled, promptInstall };
}
