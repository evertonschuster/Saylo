import { useEffect, useRef, useState } from "react";

type UseAudioAmplitudeOptions = {
  smoothingTimeConstant?: number; // 0..1
  fftSize?: number; // potências de 2
};

// Cache GLOBAL por <audio> para garantir que createMediaElementSource rode só 1x por elemento
const mediaElementSourceCache = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();

export function useAudioAmplitude(options: UseAudioAmplitudeOptions = {}) {
  const { smoothingTimeConstant = 0.85, fftSize = 1024 } = options;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const connectedElRef = useRef<HTMLAudioElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const [amplitude, setAmplitude] = useState(0);

  function ensureContext() {
    if (audioCtxRef.current) return audioCtxRef.current;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtxRef.current = new AudioContextClass();
    return audioCtxRef.current;
  }

  function connect(audioEl: HTMLAudioElement) {
    if (!audioEl) return;

    // Se já conectou esse mesmo elemento, não faz nada
    if (connectedElRef.current === audioEl && analyserRef.current && sourceRef.current) return;

    const ctx = ensureContext();

    // Cria analyser novo (ok recriar)
    const analyser = ctx.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothingTimeConstant;

    // Reusa (ou cria uma vez) o MediaElementSourceNode para esse <audio>
    let source = mediaElementSourceCache.get(audioEl);
    if (!source) {
      source = ctx.createMediaElementSource(audioEl);
      mediaElementSourceCache.set(audioEl, source);
    }

    // Conecta source -> analyser -> destination
    source.connect(analyser);
    analyser.connect(ctx.destination);

    analyserRef.current = analyser;
    sourceRef.current = source;
    connectedElRef.current = audioEl;

    dataRef.current = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      const an = analyserRef.current;
      const data = dataRef.current;
      if (!an || !data) return;

      an.getByteTimeDomainData(data);

      let sumSquares = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128; // -1..1
        sumSquares += v * v;
      }
      const rms = Math.sqrt(sumSquares / data.length);
      const boosted = Math.min(1, rms * 2.2);

      setAmplitude(boosted);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  async function resumeContext() {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state !== "running") await ctx.resume();
  }

  function disconnect() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    // Importante: NÃO feche o AudioContext aqui (evita treta em dev/StrictMode)
    // Apenas desconecte o analyser atual.
    try {
      analyserRef.current?.disconnect();
    } catch(error) {
        console.warn("Erro ao desconectar AnalyserNode", error);
    }

    analyserRef.current = null;
    dataRef.current = null;
    // sourceRef a gente mantém como referência, mas não precisa desconectar (ele pode ser reusado)
  }

  useEffect(() => {
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { amplitude, connect, resumeContext, disconnect };
}
