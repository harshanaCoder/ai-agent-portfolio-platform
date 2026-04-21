export type SpeakOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  onSpeakingChange?: (speaking: boolean) => void;
  onPlaybackStart?: () => void;
};

let activeAudio: HTMLAudioElement | null = null;
let activeAudioUrl: string | null = null;
let activeRequestController: AbortController | null = null;

function cleanupActiveAudio() {
  if (activeAudio) {
    activeAudio.onended = null;
    activeAudio.onerror = null;
    activeAudio.onpause = null;
    activeAudio = null;
  }

  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = null;
  }
}

async function speakWithBrowserFallback(text: string, options: SpeakOptions) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  await new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang ?? "en-US";
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;

    utterance.onstart = () => {
      options.onPlaybackStart?.();
      options.onSpeakingChange?.(true);
    };

    utterance.onend = () => {
      options.onSpeakingChange?.(false);
      resolve();
    };

    utterance.onerror = () => {
      options.onSpeakingChange?.(false);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });

  return true;
}

export async function speakText(text: string, options: SpeakOptions = {}) {
  if (typeof window === "undefined") {
    options.onSpeakingChange?.(false);
    return;
  }

  const content = text.trim();

  if (!content) {
    options.onSpeakingChange?.(false);
    return;
  }

  stopSpeaking();

  try {
    const controller = new AbortController();
    activeRequestController = controller;

    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: content }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error("TTS request failed.");
    }

    const audioBlob = await response.blob();

    if (!audioBlob.type.startsWith("audio/")) {
      throw new Error("TTS response was not audio.");
    }

    const objectUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(objectUrl);
    let didNotifyPlaybackStart = false;

    activeAudio = audio;
    activeAudioUrl = objectUrl;

    await new Promise<void>((resolve, reject) => {
      audio.onplay = () => {
        if (!didNotifyPlaybackStart) {
          didNotifyPlaybackStart = true;
          options.onPlaybackStart?.();
          options.onSpeakingChange?.(true);
        }
      };
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("Audio playback failed."));
      audio.onpause = () => {
        if (!audio.ended) {
          resolve();
        }
      };

      audio.play().catch(reject);
    });

    options.onSpeakingChange?.(false);
  } catch (error) {
    const isAbortError = error instanceof DOMException && error.name === "AbortError";

    if (!isAbortError) {
      const didUseFallback = await speakWithBrowserFallback(content, options);

      if (!didUseFallback) {
        options.onSpeakingChange?.(false);
      }
    } else {
      options.onSpeakingChange?.(false);
    }
  } finally {
    activeRequestController = null;
    cleanupActiveAudio();
  }
}

export function stopSpeaking() {
  if (activeRequestController) {
    activeRequestController.abort();
    activeRequestController = null;
  }

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  }

  cleanupActiveAudio();

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
