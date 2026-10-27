'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { DetailModal } from '@/components/detail-modal';
import { SmartImage } from '@/components/smart-image';
import { EmptyState } from '@/components/states';
import { SiteFooter } from '@/components/site-footer';
import { useFavorites } from '@/lib/favorites';
import { useAppStore } from '@/lib/store';
import type { SearchResultItem } from '@/lib/types';

export default function FavoritesPage() {
  const { favorites, remove } = useFavorites();
  const [detailItem, setDetailItem] = useState<SearchResultItem | null>(null);
  const imageProxyMode = useAppStore((s) => s.imageProxyMode);
  const customImageProxy = useAppStore((s) => s.customImageProxy);

  return (
    <div className="min-h-screen flex flex-col">
      <Header showSearch />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-content">我的收藏</h1>
            <p className="text-sm text-faint mt-1">收藏会绑定具体点播源，打开时仍使用当时收藏的来源。</p>
          </div>
          <span className="text-sm text-muted">{favorites.length} 个</span>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            icon="star"
            title="还没有收藏影片"
            description="搜索影片后打开详情，点击“收藏”即可在这里快速找到。"
            className="!py-20"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map((item) => (
              <article key={`${item.sourceKey}:${item.vodId}`} className="card overflow-hidden group">
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => setDetailItem(item)}
                  aria-label={`打开 ${item.name}`}
                >
                  <div className="aspect-[2/3] bg-chip overflow-hidden">
                    {item.pic ? (
                      <SmartImage
                        url={item.pic}
                        mode={imageProxyMode}
                        customProxy={customImageProxy}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-faint text-sm">无封面</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h2 className="font-medium text-content truncate" title={item.name}>{item.name}</h2>
                    <p className="text-xs text-faint truncate mt-1" title={item.sourceName}>{item.sourceName}</p>
                    {(item.year || item.typeName) && (
                      <p className="text-xs text-muted truncate mt-1">{[item.year, item.typeName].filter(Boolean).join(' · ')}</p>
                    )}
                  </div>
                </button>
                <div className="px-3 pb-3">
                  <button
                    type="button"
                    className="btn-ghost btn-sm w-full"
                    onClick={() => remove(item)}
                  >
                    取消收藏
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
      <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
    </div>
  );
}
