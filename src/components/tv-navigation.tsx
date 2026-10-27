'use client';

import { useEffect } from 'react';

type Direction = 'left' | 'right' | 'up' | 'down';

const FOCUSABLE = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isVisible(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
}

function focusableElements(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible);
}

function center(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function nextInDirection(current: HTMLElement, direction: Direction) {
  const origin = center(current);
  let best: { el: HTMLElement; score: number } | undefined;

  for (const el of focusableElements()) {
    if (el === current) continue;
    const p = center(el);
    const dx = p.x - origin.x;
    const dy = p.y - origin.y;
    const inDirection =
      (direction === 'left' && dx < -2) ||
      (direction === 'right' && dx > 2) ||
      (direction === 'up' && dy < -2) ||
      (direction === 'down' && dy > 2);
    if (!inDirection) continue;

    const primary = direction === 'left' || direction === 'right' ? Math.abs(dx) : Math.abs(dy);
    const secondary = direction === 'left' || direction === 'right' ? Math.abs(dy) : Math.abs(dx);
    const score = primary * 4 + secondary;
    if (!best || score < best.score) best = { el, score };
  }

  return best?.el;
}

export function TvNavigation() {
  useEffect(() => {
    document.body.classList.add('tv-navigation-enabled');

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const key = event.key;
      const backKey = key === 'Escape' || key === 'BrowserBack' || key === 'GoBack' || event.keyCode === 461;

      if (backKey) {
        const dialog = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
        const close = dialog?.querySelector<HTMLElement>('[aria-label="关闭"]');
        if (close) {
          event.preventDefault();
          close.click();
          return;
        }
        if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
          event.preventDefault();
          target.blur();
          return;
        }
        if (window.history.length > 1) {
          event.preventDefault();
          window.history.back();
        }
        return;
      }

      const direction: Direction | undefined =
        key === 'ArrowLeft' ? 'left' :
        key === 'ArrowRight' ? 'right' :
        key === 'ArrowUp' ? 'up' :
        key === 'ArrowDown' ? 'down' : undefined;
      if (!direction) return;

      // 文本输入时保留原生光标/候选框方向键行为；按返回键即可退出输入框。
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const current = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
      if (!current || current === document.body) {
        const first = focusableElements()[0];
        if (first) {
          event.preventDefault();
          first.focus({ preventScroll: true });
          first.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
        }
        return;
      }

      const next = nextInDirection(current, direction);
      if (!next) return;
      event.preventDefault();
      next.focus({ preventScroll: true });
      next.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('tv-navigation-enabled');
    };
  }, []);

  return (
    <style jsx global>{`
      .tv-navigation-enabled :focus-visible {
        outline: 3px solid rgb(35 173 229) !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 5px rgb(35 173 229 / 0.18) !important;
      }
      @media (min-width: 1200px) {
        .tv-navigation-enabled button,
        .tv-navigation-enabled a {
          scroll-margin: 96px;
        }
        .tv-navigation-enabled .btn-sm {
          min-height: 38px;
        }
      }
    `}</style>
  );
}
