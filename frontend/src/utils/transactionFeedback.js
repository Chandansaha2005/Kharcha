const INCOME_SOUND = "/income.mp3";
const CASH_REFRESH_SOUND = "/cash%20refresh.mp3";
const HAPTIC_DURATION_MS = 60;

let activeAudio = null;
let playbackRun = 0;

function triggerTransactionHaptic() {
  if ("vibrate" in window.navigator) {
    window.navigator.vibrate(HAPTIC_DURATION_MS);
  }
}

function playClip(src, runId) {
  return new Promise((resolve) => {
    if (!window.Audio || playbackRun !== runId) {
      resolve();
      return;
    }

    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }

    const audio = new window.Audio(src);
    activeAudio = audio;
    audio.preload = "auto";

    const finish = () => {
      audio.removeEventListener("ended", finish);
      audio.removeEventListener("error", finish);
      if (activeAudio === audio) {
        activeAudio = null;
      }
      resolve();
    };

    audio.addEventListener("ended", finish);
    audio.addEventListener("error", finish);

    try {
      const playPromise = audio.play();
      if (playPromise?.catch) {
        playPromise.catch(finish);
      }
    } catch {
      finish();
    }
  });
}

export function playTransactionFeedback() {
  if (typeof window === "undefined") {
    return;
  }

  const runId = playbackRun + 1;
  playbackRun = runId;
  triggerTransactionHaptic();

  playClip(INCOME_SOUND, runId).then(() => {
    if (playbackRun === runId) {
      playClip(CASH_REFRESH_SOUND, runId);
    }
  });
}
