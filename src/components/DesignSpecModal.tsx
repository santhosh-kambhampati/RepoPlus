import React, { useState } from 'react';
import {
  X,
  Layers,
  Code2,
  Palette,
  Layout,
  CheckCircle2,
  Smartphone,
  Cpu,
  Copy,
  Check,
} from 'lucide-react';

interface DesignSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSpecModal: React.FC<DesignSpecModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'mui' | 'architecture' | 'spec'>('spec');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="design-spec-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 id="design-spec-title" className="text-base font-bold text-slate-900">
                RepoPulse Design System & Engineering Architecture
              </h2>
              <p className="text-xs text-slate-500">
                Production-grade design specification, tokens, MUI mappings & Redux Toolkit/Saga architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Tabs */}
        <div className="px-6 border-b border-slate-200 flex gap-2 bg-white overflow-x-auto">
          {[
            { id: 'spec', label: '13 Deliverables Spec', icon: Layout },
            { id: 'mui', label: 'MUI Component Mapping', icon: Code2 },
            { id: 'tokens', label: 'Design Tokens', icon: Palette },
            { id: 'architecture', label: 'Redux Saga & Highcharts', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-800 text-sm leading-relaxed">
          {/* TAB 1: 13 DELIVERABLES SPEC */}
          {activeTab === 'spec' && (
            <div className="space-y-8">
              {/* 1. Overall visual design direction */}
              <section className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
                  <h3>Overall Visual Design Direction</h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  RepoPulse follows an authentic developer-focused aesthetic inspired by GitHub, Linear, and Stripe dashboards. It embraces clean off-white canvas (#F8FAFC), crisp dark slate typography (#0F172A), single-elevation card surfaces, hairline borders (#E2E8F0), zero-pill static metadata discipline, and tabular figures for all counters.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs font-semibold text-slate-900 block">60% Canvas</span>
                    <span className="text-[11px] text-slate-500 font-mono">#F8FAFC · Light slate neutral</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs font-semibold text-slate-900 block">30% Structure</span>
                    <span className="text-[11px] text-slate-500 font-mono">#FFFFFF · 1px hairline cards</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs font-semibold text-slate-900 block">10% Accent</span>
                    <span className="text-[11px] text-slate-500 font-mono">#2563EB Blue · #059669 Emerald</span>
                  </div>
                </div>
              </section>

              {/* 2 & 3. Main repository listing & Card Design */}
              <section className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2 & 3</span>
                  <h3>Main Repository Listing & Card Hierarchy</h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Cards feature a 3-part layout (Left: Avatar with rank badge, Center: Strong repo name, description, and unboxed metadata separated by &apos;·&apos;, Right: Interactive chevron affordance).
                </p>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
                  <div className="text-slate-400">// Visual Hierarchy Blueprint</div>
                  <div className="mt-1 font-bold text-slate-900">[Avatar 48px]  facebook/react (Bold 16px)</div>
                  <div className="text-slate-600">             The library for web and native user interfaces.</div>
                  <div className="text-slate-500">             ★ 245k · Issues 1.2k · Updated 2h ago · facebook       [ → View ]</div>
                </div>
              </section>

              {/* 4, 5, 6. Loading, Error, Empty States */}
              <section className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">4, 5 & 6</span>
                  <h3>State Completeness (Loading, Error, Empty)</h3>
                </div>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc list-inside">
                  <li><strong>Skeleton Loading</strong>: Geometric 1:1 match to real card structure. Uses subtle pulse animation preserving vertical height so content doesn&apos;t shift.</li>
                  <li><strong>Infinite Scroll Indicator</strong>: Lightweight bottom skeleton loader that appends seamlessly without removing existing repositories.</li>
                  <li><strong>Error State</strong>: Clear diagnostic banner with [Try again] action and an immediate fallback to verified repository data if GitHub rate limits occur.</li>
                  <li><strong>Empty State</strong>: Meaningful guidance with one-click period adjustment to &apos;Past 1 Month&apos;.</li>
                </ul>
              </section>

              {/* 7, 8, 9. Analytics Screen & Charts */}
              <section className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">7, 8 & 9</span>
                  <h3>Analytics Screen & Highcharts Dual Visualizations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Total Changes Chart</h4>
                    <p className="text-xs text-slate-600">
                      Single area spline curve with 52-week temporal resolution. Soft gradient fill, count-based tabular Y-axis, custom tooltip rendering exact week name and metric figures.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Contributor Changes Chart</h4>
                    <p className="text-xs text-slate-600">
                      Multi-line spline chart with 1 line per contributor. Color-coordinated legend buttons allow toggling individual contributors on/off with &apos;Show All&apos; and &apos;Hide All&apos; shortcuts.
                    </p>
                  </div>
                </div>
              </section>

              {/* 10. Mobile Responsive Layouts */}
              <section className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">10</span>
                  <h3>Mobile Responsive Adaptations</h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  On mobile (&lt;640px), horizontal cards smoothly transition to a vertical layout:
                  the repository identity stacks naturally, time-period controls occupy a 3-column touch grid, and Highcharts dynamically adjusts tick intervals to prevent label crowding.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: MUI COMPONENT MAPPING */}
          {activeTab === 'mui' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Recommended MUI Component Mapping</h3>
                  <p className="text-xs text-slate-500">
                    Exact Material UI (v5/v6) component architecture corresponding to every UI element in RepoPulse.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `// MUI Component Mapping Table\nHeader -> AppBar, Toolbar, Container\nTimePeriodSelector -> ToggleButtonGroup, ToggleButton\nRepoCard -> Card, CardActionArea, Avatar, Typography, Stack, Box\nRepoCardSkeleton -> Skeleton (variant="rectangular" & "text")\nEmptyState / ErrorState -> Alert, Button, Box, Typography\nMetricSelector -> Select, MenuItem, FormControl\nCharts -> Box wrapping HighchartsReact with custom MUI Theme`,
                      'mui-table'
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedSection === 'mui-table' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'mui-table' ? 'Copied' : 'Copy Table'}</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">UI Feature</th>
                      <th className="p-3">MUI Component</th>
                      <th className="p-3">Props & Styling Customization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">App Header</td>
                      <td className="p-3 text-blue-600">&lt;AppBar position=&quot;sticky&quot;&gt;</td>
                      <td className="p-3 text-slate-600">color=&quot;inherit&quot;, elevation=0, borderBottom=&quot;1px solid #e2e8f0&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Time Filter</td>
                      <td className="p-3 text-blue-600">&lt;ToggleButtonGroup&gt;</td>
                      <td className="p-3 text-slate-600">exclusive, size=&quot;small&quot;, &lt;ToggleButton value=&quot;1week&quot;&gt;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Repo Card</td>
                      <td className="p-3 text-blue-600">&lt;Card variant=&quot;outlined&quot;&gt;</td>
                      <td className="p-3 text-slate-600">&lt;CardActionArea&gt; with custom hover border transition</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Owner Avatar</td>
                      <td className="p-3 text-blue-600">&lt;Avatar variant=&quot;rounded&quot;&gt;</td>
                      <td className="p-3 text-slate-600">sx=&quot;width: 48, height: 48, borderRadius: 2&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Metadata Line</td>
                      <td className="p-3 text-blue-600">&lt;Stack direction=&quot;row&quot;&gt;</td>
                      <td className="p-3 text-slate-600">divider=&lt;Box component=&quot;span&quot;&gt;·&lt;/Box&gt; (No pill enclosures!)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Card Skeleton</td>
                      <td className="p-3 text-blue-600">&lt;Skeleton&gt;</td>
                      <td className="p-3 text-slate-600">animation=&quot;wave&quot;, variant=&quot;rounded&quot; / &quot;text&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Metric Selector</td>
                      <td className="p-3 text-blue-600">&lt;Select size=&quot;small&quot;&gt;</td>
                      <td className="p-3 text-slate-600">&lt;MenuItem value=&quot;commits&quot;&gt;, &lt;MenuItem value=&quot;additions&quot;&gt;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Charts Container</td>
                      <td className="p-3 text-blue-600">&lt;Paper variant=&quot;outlined&quot;&gt;</td>
                      <td className="p-3 text-slate-600">p: 3, borderRadius: 3, HighchartsReact wrapper</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN TOKENS */}
          {activeTab === 'tokens' && (
            <div className="space-y-6">
              <h3 className="font-bold text-base text-slate-900">Design System Tokens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900 font-sans">Colors (Hex / Slate)</div>
                  <div>--bg-canvas: #f8fafc;</div>
                  <div>--surface-card: #ffffff;</div>
                  <div>--border-subtle: #e2e8f0;</div>
                  <div>--border-hover: #cbd5e1;</div>
                  <div>--text-primary: #0f172a;</div>
                  <div>--text-secondary: #475569;</div>
                  <div>--text-muted: #94a3b8;</div>
                  <div>--accent-primary: #2563eb; /* Blue 600 */</div>
                  <div>--accent-success: #059669; /* Emerald 600 */</div>
                  <div>--accent-danger: #dc2626; /* Crimson 600 */</div>
                  <div>--accent-warning: #d97706; /* Amber 600 */</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900 font-sans">Typography & Spacing Scale</div>
                  <div>font-family-display: &apos;Plus Jakarta Sans&apos;, sans-serif;</div>
                  <div>font-family-mono: &apos;JetBrains Mono&apos;, monospace;</div>
                  <div>font-size-title: 20px / 24px (Bold);</div>
                  <div>font-size-body: 14px / 20px (Regular);</div>
                  <div>font-size-meta: 12px / 16px (Medium);</div>
                  <div>radius-card: 16px (rounded-2xl);</div>
                  <div>radius-btn: 8px (rounded-lg);</div>
                  <div>radius-avatar: 12px (rounded-xl);</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REDUX SAGA & HIGHCHARTS */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <h3 className="font-bold text-base text-slate-900">Redux Toolkit + Redux Saga Architecture</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                In the target architecture, state is maintained via Redux Toolkit slices (`reposSlice` and `analyticsSlice`), orchestrated by Redux Saga generator workers to handle concurrent pagination debouncing, rate-limit retries, and metric switching.
              </p>

              <div className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto space-y-3">
                <div className="text-emerald-400">// Redux Saga Worker: fetchRepositoriesSaga</div>
                <div>{`function* watchRepositoryRequests() {`}</div>
                <div className="pl-4">{`yield takeLatest('repos/fetchRequest', fetchReposWorker);`}</div>
                <div className="pl-4">{`yield takeEvery('repos/loadMoreRequest', loadMoreReposWorker);`}</div>
                <div className="pl-4">{`yield takeLatest('analytics/fetchRepoStats', fetchRepoStatsWorker);`}</div>
                <div>{`}`}</div>
                <div className="text-slate-400 mt-2">{`// Handles: cancellation of stale queries when switching time period (1w -> 2w)`}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Compliant with WCAG AA Contrast & Zero-Pill Design Constitution</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
