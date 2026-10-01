import React, { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Contributor, MetricType } from '../types';

const HighchartsReactComponent = ((HighchartsReact as any).default || HighchartsReact) as typeof HighchartsReact;
import { formatCommaNumber, formatShortWeek } from '../utils/formatters';
import { Users, CheckSquare, Square } from 'lucide-react';

interface ContributorChangesChartProps {
  contributors: Contributor[];
  metric: MetricType;
}

export const ContributorChangesChart: React.FC<ContributorChangesChartProps> = ({
  contributors: initialContributors,
  metric,
}) => {
  // Local state to manage toggle visibility of each contributor
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initialContributors.forEach((c) => {
      map[c.author.login] = true;
    });
    return map;
  });

  const toggleContributor = (login: string) => {
    setVisibleMap((prev) => ({
      ...prev,
      [login]: !prev[login],
    }));
  };

  const toggleAll = (visible: boolean) => {
    const map: Record<string, boolean> = {};
    initialContributors.forEach((c) => {
      map[c.author.login] = visible;
    });
    setVisibleMap(map);
  };

  const metricLabel = useMemo(() => {
    switch (metric) {
      case 'additions':
        return 'Additions';
      case 'deletions':
        return 'Deletions';
      case 'commits':
      default:
        return 'Commits';
    }
  }, [metric]);

  // All contributors share the same weekly timestamps
  const sampleWeeks = initialContributors[0]?.weeks || [];
  const categories = sampleWeeks.map((w) => formatShortWeek(w.week));
  const fullDateLabels = sampleWeeks.map((w) => w.weekLabel);

  const chartOptions: Highcharts.Options = useMemo(() => {
    const seriesList: Highcharts.SeriesOptionsType[] = initialContributors.map((c) => {
      const isVisible = visibleMap[c.author.login] ?? true;
      const data = c.weeks.map((w) => w[metric]);

      return {
        name: c.author.login,
        type: 'spline',
        data,
        color: c.color,
        visible: isVisible,
        lineWidth: 2,
        marker: {
          radius: 2.5,
          symbol: 'circle',
          states: {
            hover: {
              radius: 5,
            },
          },
        },
      };
    });

    return {
      chart: {
        type: 'spline',
        backgroundColor: 'transparent',
        height: 360,
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        },
        spacing: [16, 12, 16, 8],
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false, // We provide an accessible, richer custom legend above the chart
      },
      xAxis: {
        categories,
        tickInterval: 4,
        lineColor: '#e2e8f0',
        lineWidth: 1,
        tickColor: '#e2e8f0',
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
          },
        },
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#f1f5f9',
      },
      yAxis: {
        title: {
          text: `Weekly ${metricLabel}`,
          style: {
            color: '#64748b',
            fontSize: '11px',
            fontWeight: '500',
          },
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
          },
          formatter: function () {
            const val = Number(this.value);
            if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
            return `${val}`;
          },
        },
        gridLineColor: '#f1f5f9',
        min: 0,
      },
      tooltip: {
        useHTML: true,
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderRadius: 8,
        shadow: false,
        padding: 0,
        formatter: function (this: any) {
          const index = typeof this.point?.index === 'number' ? this.point.index : (typeof this.x === 'number' ? this.x : 0);
          const weekStr = fullDateLabels[index] || this.x || `Week ${index + 1}`;
          const contributorName = this.series?.name || 'Contributor';
          const val = Number(this.y);

          return `
            <div style="padding: 10px 14px; min-width: 150px; color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 500; margin-bottom: 4px;">
                Week of ${weekStr}
              </div>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${this.series?.color || '#3b82f6'};"></span>
                <span style="font-size: 12px; font-weight: 600; color: #f8fafc;">${contributorName}</span>
              </div>
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 2px;">
                Changes (${metric})
              </div>
              <div style="font-size: 17px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #ffffff;">
                ${formatCommaNumber(val)}
              </div>
            </div>
          `;
        },
      },
      series: seriesList,
    };
  }, [initialContributors, visibleMap, metric, metricLabel, categories, fullDateLabels]);

  const activeCount = Object.values(visibleMap).filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Contributor Changes
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly development activity broken down per contributor
          </p>
        </div>

        {/* Legend Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => toggleAll(true)}
            className="px-2 py-1 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Show all contributors"
          >
            Show All
          </button>
          <span aria-hidden="true" className="text-slate-300">|</span>
          <button
            onClick={() => toggleAll(false)}
            className="px-2 py-1 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Hide all contributors"
          >
            Hide All
          </button>
          <span className="text-slate-400 ml-1">
            ({activeCount}/{initialContributors.length} active)
          </span>
        </div>
      </div>

      {/* Contributor Legend Toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {initialContributors.map((c) => {
          const isVisible = visibleMap[c.author.login] ?? true;
          const contributorTotal = c.weeks.reduce((sum, w) => sum + w[metric], 0);

          return (
            <button
              key={c.author.login}
              type="button"
              onClick={() => toggleContributor(c.author.login)}
              aria-pressed={isVisible}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                isVisible
                  ? 'bg-slate-50 border-slate-300 text-slate-800 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
              }`}
            >
              {/* Contributor Color Dot */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform"
                style={{
                  backgroundColor: isVisible ? c.color : '#cbd5e1',
                  boxShadow: isVisible ? `0 0 0 2px ${c.color}25` : 'none',
                }}
              />

              {/* Avatar */}
              <img
                src={c.author.avatar_url}
                alt={c.author.login}
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Username */}
              <span className="font-mono text-xs">{c.author.login}</span>

              {/* Total tabular metric */}
              <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                ({formatCommaNumber(contributorTotal)})
              </span>
            </button>
          );
        })}
      </div>

      {/* Highcharts Multi-line Render */}
      <div className="w-full overflow-hidden">
        <HighchartsReactComponent highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};
