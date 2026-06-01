"use client";

import { useEffect, useState } from "react";

export function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const duration = 1100;
    const startedAt = performance.now();
    let frameId = 0;
    function tick(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      setDisplayValue(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value]);
  return <>{displayValue.toLocaleString("en-IN")}</>;
}
