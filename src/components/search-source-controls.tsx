'use client';

import { useState } from 'react';
import { useToast } from './toast';
import {
  rememberFailedSources,
  useSearchSourceNoticeMode,
  type FailedSourceLike,
  type SearchSourceNoticeMode,
} from '@/lib/search-source-memory';

export function SearchSourceControls({
  failures,
  sourceName,
  isSearching,
}: {
  failures: FailedSourceLike[];
  sourceName: (key: string) => string;
  isSearching: boolean;
}) {
  const { toast } = useToast();
  const [mode, setMode] = useSearchSourceNoticeMode();
  const [rememberedCount, setRememberedCount] = useState(0);

  const remember = () => {
    const count = rememberFailedSources(failures);
    setRememberedCount(count);
    if (count > 0) toast(`已记忆本次有效源，${count} 个失败源以后默认跳过`, 'success');
  };

  return (
    <div className="mb-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-faint">源失败提示</span>
        <NoticeButton active={mode === 'silent'} onClick={() => setMode('silent')}>静默</NoticeButton>
        <NoticeButton active={mode === 'compact'} onClick={() => setMode('compact')}>简洁</NoticeButton>
        <NoticeButton active={mode === 'detailed'} onClick={() => setMode('detailed')}>详细</NoticeButton>

        {!isSearching && failures.length > 0 && (
          <button
            type="button"
            className="btn-ghost btn-sm ml-auto"
            onClick={remember}
            disabled={rememberedCount > 0}
          >
            {rememberedCount > 0
              ? `已排除 ${rememberedCount} 个失败源`
              : `记忆本次有效源（排除 ${failures.length} 个失败源）`}
          </button>
        )}
      </div>

      {mode === 'compact' && failures.length > 0 && (
        <div className="text-xs text-faint bg-chip rounded-lg px-3 py-2">
          {failures.length} 个源本次不可用，搜索已自动忽略。
        </div>
      )}

      {mode === 'detailed' && failures.length > 0 && (
        <div className="text-xs bg-chip rounded-lg px-3 py-2 flex flex-wrap gap-x-3 gap-y-1">
          <span className="text-faint">{isSearching ? '以下源暂时无响应：' : '部分点播源请求失败：'}</span>
          {failures.map((failure) => (
            <span key={failure.sourceKey} className={failure.timedOut ? 'text-warning' : 'text-faint'}>
              {failure.timedOut ? '⏱' : '✗'} {sourceName(failure.sourceKey)}
              {failure.timedOut ? ' 超时' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function NoticeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}
    >
      {children}
    </button>
  );
}
