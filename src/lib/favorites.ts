'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SearchResultItem } from './types';

const FAVORITES_KEY = 'libretv:favorites:v1';
const FAVORITES_EVENT = 'libretv:favorites-change';

export interface FavoriteEntry extends SearchResultItem {
  favoritedAt: number;
}

export function favoriteKey(item: Pick<SearchResultItem, 'sourceKey' | 'vodId'>): string {
  return `${item.sourceKey}::${item.vodId}`;
}

export function readFavorites(): FavoriteEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.sourceKey === 'string' && typeof item.vodId === 'string')
      .sort((a, b) => (b.favoritedAt || 0) - (a.favoritedAt || 0));
  } catch {
    return [];
  }
}

function writeFavorites(items: FavoriteEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items.slice(0, 500)));
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
}

export function toggleFavorite(item: SearchResultItem): boolean {
  const items = readFavorites();
  const key = favoriteKey(item);
  const index = items.findIndex((entry) => favoriteKey(entry) === key);
  if (index >= 0) {
    items.splice(index, 1);
    writeFavorites(items);
    return false;
  }
  writeFavorites([{ ...item, favoritedAt: Date.now() }, ...items]);
  return true;
}

export function removeFavorite(item: Pick<SearchResultItem, 'sourceKey' | 'vodId'>) {
  const key = favoriteKey(item);
  writeFavorites(readFavorites().filter((entry) => favoriteKey(entry) !== key));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  const refresh = useCallback(() => setFavorites(readFavorites()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(FAVORITES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const toggle = useCallback((item: SearchResultItem) => {
    const added = toggleFavorite(item);
    refresh();
    return added;
  }, [refresh]);

  const remove = useCallback((item: Pick<SearchResultItem, 'sourceKey' | 'vodId'>) => {
    removeFavorite(item);
    refresh();
  }, [refresh]);

  return { favorites, toggle, remove, refresh };
}
