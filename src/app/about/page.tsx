'use client';

import { Header } from '@/components/header';
import { SiteFooter } from '@/components/site-footer';

const linkClass = 'text-accent hover:underline underline-offset-2';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10 space-y-8">
        <section>
          <h1 className="text-xl font-bold text-content mb-3">关于 LibreTV</h1>
          <p className="text-sm text-muted leading-relaxed">
            LibreTV 是一个开源的在线视频搜索与播放前端。本增强版不存储、不制作视频文件，也不在公开仓库中内置版权状态不明确的点播源、直播源或 TVBox 聚合源；具体数据源由部署者自行配置并负责确认其授权与使用条件。
          </p>
        </section>

        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-base font-semibold text-content mb-2.5">开源归属与本增强版</h2>
          <div className="text-sm text-muted leading-relaxed space-y-2">
            <p>
              本版本基于{' '}
              <a
                href="https://github.com/LibreSpark/LibreTV"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LibreSpark/LibreTV
              </a>{' '}
              开发，原项目及其贡献者保留其原有著作权与署名。
            </p>
            <p>
              当前增强版源码：{' '}
              <a
                href="https://github.com/xixiliFruit/LibreTV"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                xixiliFruit/LibreTV
              </a>
              。本分支目前主要增加影片收藏、搜索源记忆、失败提示静默与电视遥控器导航等功能。
            </p>
            <p>
              本项目继续遵循{' '}
              <a
                href="https://github.com/xixiliFruit/LibreTV/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                GNU AGPL-3.0
              </a>{' '}
              许可证。通过网络使用本修改版的用户可以访问上述公开源码。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-content mb-2.5">数据源原则</h2>
          <ul className="text-sm text-muted space-y-1.5 list-disc list-inside leading-relaxed">
            <li>公开仓库不内置、维护或分发版权状态不明确的影视数据源。</li>
            <li>示例配置只使用占位地址或可明确验证用途的公开服务，不把未知资源站写入源码。</li>
            <li>部署者自行添加的数据源不代表上游项目或本增强版对其内容、版权或稳定性的认可。</li>
            <li>如无法确认某个数据源的授权状态，默认不纳入公开配置。</li>
          </ul>
          <p className="text-xs text-faint mt-2.5">
            详细原则见仓库中的 NOTICE.md。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-content mb-2.5">快捷键</h2>
          <ul className="text-sm text-muted space-y-1.5 list-disc list-inside">
            <li><code className="text-accent">空格</code> 播放 / 暂停</li>
            <li><code className="text-accent">←</code> / <code className="text-accent">→</code> 快退 / 快进 5 秒</li>
            <li><code className="text-accent">↑</code> / <code className="text-accent">↓</code> 音量调节</li>
            <li><code className="text-accent">F</code> 切换全屏</li>
            <li><code className="text-accent">Alt + ←/→</code> 上一集 / 下一集</li>
            <li>电视端可使用方向键移动焦点、确认键选择、返回键关闭弹窗或返回上一页</li>
            <li>移动端长按视频可 3 倍速播放</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-content mb-2.5">隐私与数据</h2>
          <p className="text-sm text-muted leading-relaxed">
            搜索历史、观看进度、收藏与本地偏好等数据主要保存在本设备浏览器中。聚合搜索请求可能由部署的 LibreTV 服务端代理转发到用户自行配置的数据源。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-content mb-2.5">免责声明</h2>
          <p className="text-sm text-faint leading-relaxed">
            本项目提供通用的搜索、聚合与播放技术能力，不授予任何第三方影视内容的版权或传播许可。请仅配置和使用你有权访问、播放或分发的数据源，并遵守所在地法律、数据源条款及版权要求。
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
