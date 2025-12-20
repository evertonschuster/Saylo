import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioAmplitude } from "../../services/audio/useAudioAmplitude";
import CharacterRive from "../Character/CharacterRive";

type Props = {
  audioSrc: string; // ex: "/audio/sample.mp3"
  riveSrc: string;  // ex: "/rive/character.riv"
  stateMachine: string;
  mouthInputName?: string;
  talkInputName?: string;
};

type DownloadState =
  | { status: "idle" }
  | { status: "downloading"; progress: number | null } // null quando não dá pra calcular
  | { status: "ready"; blobUrl: string }
  | { status: "error"; message: string };

async function downloadToBlobUrl(
  url: string,
  onProgress: (progress: number | null) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Falha no download (${res.status})`);

  if (!res.body) {
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  const contentLengthHeader = res.headers.get("Content-Length");
  const total = contentLengthHeader ? Number(contentLengthHeader) : 0;

  const reader = res.body.getReader();
  const parts: ArrayBuffer[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    if (value) {
      const ab = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
      parts.push(ab);

      received += value.byteLength;
      if (total > 0) onProgress(Math.min(1, received / total));
      else onProgress(null);
    }
  }

  const blob = new Blob(parts, {
    type: res.headers.get("Content-Type") ?? "audio/mpeg",
  });

  return URL.createObjectURL(blob);
}


export default function AudioLipSyncPlayer({
  audioSrc,
  riveSrc,
  stateMachine,
  mouthInputName = "mouthOpen",
  talkInputName = "Talk",
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { amplitude, connect, resumeContext } = useAudioAmplitude({
    smoothingTimeConstant: 0.85,
    fftSize: 1024,
  });

  const [isTalking, setIsTalking] = useState(false);
  const [dl, setDl] = useState<DownloadState>({ status: "idle" });

  // Baixa assim que o componente monta
  useEffect(() => {
    const abort = new AbortController();

    let oldBlobUrl: string | null = null;

    (async () => {
      try {
        setDl({ status: "downloading", progress: 0 });
        const blobUrl = await downloadToBlobUrl(
          audioSrc,
          (p) => setDl({ status: "downloading", progress: p }),
          abort.signal,
        );
        oldBlobUrl = blobUrl;
        setDl({ status: "ready", blobUrl });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (abort.signal.aborted) return;
        setDl({ status: "error", message: e?.message ?? "Erro ao baixar áudio" });
      }
    })();

    return () => {
      abort.abort();
      if (oldBlobUrl) URL.revokeObjectURL(oldBlobUrl);
    };
  }, [audioSrc]);

  // Conecta o analyser ao <audio> uma vez (com StrictMode, seu hook já está robusto)
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    connect(el);

    const onPlay = () => setIsTalking(true);
    const onPause = () => setIsTalking(false);
    const onEnded = () => setIsTalking(false);

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [connect]);

  const canPlay = dl.status === "ready";

  async function handlePlay() {
    if (!audioRef.current) return;
    if (dl.status !== "ready") return;

    // iOS/Safari: precisa de gesto do usuário para liberar AudioContext
    await resumeContext();

    // garante que o <audio> aponta para o blob já baixado
    if (audioRef.current.src !== dl.blobUrl) {
      audioRef.current.src = dl.blobUrl;
      // espera carregar metadata para evitar play falhar em alguns browsers
      await new Promise<void>((resolve) => {
        const el = audioRef.current!;
        const done = () => {
          el.removeEventListener("loadedmetadata", done);
          resolve();
        };
        el.addEventListener("loadedmetadata", done);
        // fallback rápido caso já esteja carregado
        if (el.readyState >= 1) {
          el.removeEventListener("loadedmetadata", done);
          resolve();
        }
      });
    }

    await audioRef.current.play();
  }

  function handlePause() {
    audioRef.current?.pause();
  }

  const progressText = useMemo(() => {
    if (dl.status !== "downloading") return null;
    if (dl.progress === null) return "Baixando áudio…";
    return `Baixando áudio… ${Math.round(dl.progress * 100)}%`;
  }, [dl]);

  return (
    <div style={{ display: "grid", gap: 16, alignItems: "center" }}>
      <CharacterRive
        src={riveSrc}
        stateMachine={stateMachine}
        amplitude={amplitude}
        isTalking={isTalking}
        mouthInputName={mouthInputName}
        talkInputName={talkInputName}
      />

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handlePlay} disabled={!canPlay}>
          ▶️ Play
        </button>
        <button onClick={handlePause}>
          ⏸️ Pause
        </button>

        <div style={{ fontFamily: "monospace", opacity: 0.85 }}>
          amp: {amplitude.toFixed(3)}
        </div>

        {dl.status === "downloading" && (
          <div style={{ opacity: 0.9 }}>{progressText}</div>
        )}

        {dl.status === "error" && (
          <div style={{ color: "crimson" }}>
            Erro ao baixar: {dl.message}
          </div>
        )}
      </div>

      {/* Mantém controls para debug. Em produção, você pode remover. */}
      <audio ref={audioRef} controls preload="none" style={{ width: "100%" }} />
    </div>
  );
}
