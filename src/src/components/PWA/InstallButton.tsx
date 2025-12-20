import { useInstallPrompt } from "../../services/pwa/useInstallPrompt";

export default function InstallButton() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

  if (isInstalled) return null;

  return (
    <button
      onClick={async () => {
        const res = await promptInstall();
        console.log("Install outcome:", res.outcome);
      }}
      disabled={!isInstallable}
      style={{ padding: 12, borderRadius: 10 }}
      title={!isInstallable ? "Instalação ainda não disponível neste navegador/momento" : "Instalar o app"}
    >
      📲 Instalar app
    </button>
  );
}
