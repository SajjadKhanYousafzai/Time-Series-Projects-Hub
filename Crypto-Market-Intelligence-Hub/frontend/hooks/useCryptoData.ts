"use client";

import useSWR from "swr";
import { getHistory, getAssets } from "@/lib/api";
import type { HistoricalResponse } from "@/types/crypto";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCryptoHistory(
  asset: string | null,
  params?: { start?: string; end?: string; limit?: number }
) {
  const { data, error, isLoading } = useSWR<HistoricalResponse>(
    asset ? `history-${asset}-${JSON.stringify(params)}` : null,
    () => getHistory(asset!, params),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  };
}

export function useAssets() {
  const { data, error, isLoading } = useSWR<{ assets: string[]; count: number }>(
    "assets",
    getAssets,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  return {
    assets: data?.assets ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError: !!error,
  };
}
