"use client";

import { useState } from "react";
import useSWR from "swr";
import { getPrediction } from "@/lib/api";
import type { PredictionResponse, ModelType } from "@/types/crypto";

export function usePredictions() {
  const [asset, setAsset] = useState<string | null>(null);
  const [model, setModel] = useState<ModelType>("prophet");
  const [horizon, setHorizon] = useState(30);
  const [trigger, setTrigger] = useState(0);

  const { data, error, isLoading } = useSWR<PredictionResponse>(
    asset && trigger > 0 ? `predict-${asset}-${model}-${horizon}-${trigger}` : null,
    () => getPrediction(asset!, model, horizon),
    { revalidateOnFocus: false }
  );

  const runForecast = (newAsset: string, newModel: ModelType, newHorizon: number) => {
    setAsset(newAsset);
    setModel(newModel);
    setHorizon(newHorizon);
    setTrigger((t) => t + 1);
  };

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    runForecast,
  };
}
