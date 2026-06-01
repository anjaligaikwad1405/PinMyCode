export type ConfidenceResult = {
  confidence: number;
  label: string;
  warning: string | null;
};

export function getConfidenceScore(distanceKm: number): ConfidenceResult {
  if (distanceKm < 1) {
    return {
      confidence: Math.max(95, Math.round(100 - distanceKm * 4)),
      label: "Very high",
      warning: null,
    };
  }

  if (distanceKm < 5) {
    return {
      confidence: Math.max(80, Math.round(95 - (distanceKm - 1) * 3.5)),
      label: "High",
      warning: null,
    };
  }

  if (distanceKm < 15) {
    return {
      confidence: Math.max(60, Math.round(80 - (distanceKm - 5) * 2)),
      label: "Moderate",
      warning: null,
    };
  }

  return {
    confidence: Math.max(25, Math.round(60 - Math.min(distanceKm - 15, 35))),
    label: "Approximate",
    warning: "Result may be approximate",
  };
}
