'use client';

import { useCallback, useEffect, useState } from 'react';
import { SOURCE_DISABLE_THRESHOLD, useAppStore, type SourceDisableEvent } from './store';

const NOTICE_KEY = 'libretv:search-source-notice-mode:v1';
const NOTICE_EVENT = 'libretv:search-source-notice-change';

export type SearchSourceNoticeMode = 'silent' | 'compact' | 'detailed';

export interface FailedSourceLike {
  sourceKey: string;
  error?: string;
  timedOut?: boolean;
}

export function getSearchSourceNoticeMode(): SearchSourceNoticeMode {
  if (typeof window === 'undefined') return 'silent';
  const value = window.localStorage.getItem(NOTICE_KEY);
  return value === 'compact' || value === 'detailed' ? value : 'silent';
}

export function setSearchSourceNoticeMode(mode: SearchSourceNoticeMode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(NOTICE_KEY, mode);
  window.dispatchEvent(new CustomEvent(NOTICE_EVENT));
}

export function useSearchSourceNoticeMode() {
  const [mode, setModeState] = useState<SearchSourceNoticeMode>('silent');

  useEffect(() => {
    const refresh = () => setModeState(getSearchSourceNoticeMode());
    refresh();
    window.addEventListener(NOTICE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(NOTICE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const setMode = useCallback((next: SearchSourceNoticeMode) => {
    setSearchSourceNoticeMode(next);
    setModeState(next);
  }, []);

  return [mode, setMode] as const;
}

/**
 * 把本次搜索明确失败的源标记为长期停用。
 * “接口正常但结果为空”不会出现在 failures 中，因此不会误伤没有该影片的正常源。
 */
export function rememberFailedSources(failures: FailedSourceLike[]): number {
  if (failures.length === 0) return 0;
  const unique = new Map(failures.map((item) => [item.sourceKey, item]));
  const now = Date.now();

  useAppStore.setState((state) => {
    const sourceHealth = { ...state.sourceHealth };
    for (const [sourceKey, failure] of unique) {
      const previous = sourceHealth[sourceKey];
      sourceHealth[sourceKey] = {
        ok: false,
        ms: previous?.ms,
        error: failure.error || previous?.error || '搜索失败',
        timedOut: failure.timedOut,
        failStreak: Math.max(previous?.failStreak || 0, SOURCE_DISABLE_THRESHOLD),
        disableCount: Math.max(previous?.disableCount || 0, 3),
        permanent: true,
        disabledUntil: undefined,
        timestamp: now,
      };
    }
    return { sourceHealth };
  });

  return unique.size;
}

/** 仅详细模式保留原来的逐源自动停用 Toast。 */
export function shouldToastSourceDisableEvents(events: SourceDisableEvent[]): boolean {
  return events.length > 0 && getSearchSourceNoticeMode() === 'detailed';
}
