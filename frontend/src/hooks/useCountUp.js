import { useEffect, useState } from "react";

export const useCountUp = (targetValue, duration = 1200) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const startValue = 0;
    const startTime = performance.now();

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const nextValue = startValue + (targetValue - startValue) * progress;
      setValue(nextValue);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetValue, duration]);

  return value;
};
