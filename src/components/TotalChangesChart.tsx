import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { WeeklyStat, MetricType } from '../types';

const HighchartsReactComponent = ((HighchartsReact as any).default || HighchartsReact) as typeof HighchartsReact;
import { formatCommaNumber, formatShortWeek } from '../utils/formatters';
import { GitCommit, PlusCircle, MinusCircle } from 'lucide-react';

interface TotalChangesChartProps {
  weeklyData: WeeklyStat[];
  metric: MetricType;
}

export const TotalChangesChart: React.FC<TotalChangesChartProps> = ({ weeklyData, metric }) => {
  const metricConfig = useMemo(() => {
    switch (metric) {
      case 'additions':
        return {
          title: 'Additions',
          color: '#059669', // Emerald
          fillColor: 'rgba(5, 150, 105, 0.08)',
          icon: PlusCircle,
        };
      case 'deletions':
        return {
          title: 'Deletions',
          color: '#dc2626', // Crimson
          fillColor: 'rgba(220, 38, 38, 0.08)',
          icon: MinusCircle,
        };
      case 'commits':
      default:
        return {
          title: 'Commits',
          color: '#2563eb', // Blue
          fillColor: 'rgba(37, 99, 235, 0.08)',
          icon: GitCommit,
        };
    }
  }, [metric]);

  const chartOptions: Highcharts.Options = useMemo(() => {
    const categories = weeklyData.map((w) => formatShortWeek(w.week));
    const fullDateLabels = weeklyData.map((w) => w.weekLabel);
    const seriesData = weeklyData.map((w) => w[metric]);

    return {
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        height: 300,
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
        enabled: false,
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
          text: `Weekly ${metricConfig.title}`,
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
      plotOptions: {
        area: {
          lineColor: metricConfig.color,
          lineWidth: 2.2,
          color: metricConfig.color,
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, metricConfig.fillColor],
              [1, 'rgba(255, 255, 255, 0.0)'],
            ],
          },
          marker: {
            radius: 3,
            fillColor: '#ffffff',
            lineColor: metricConfig.color,
            lineWidth: 2,
            states: {
              hover: {
                radius: 5,
                lineWidth: 2,
              },
            },
          },
        },
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
          const val = Number(this.y);

          return `
            <div style="padding: 10px 14px; min-width: 140px; color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 500; margin-bottom: 6px;">
                Week of ${weekStr}
              </div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #cbd5e1; margin-bottom: 2px;">
                Changes (${metric})
              </div>
              <div style="font-size: 18px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #ffffff;">
                ${formatCommaNumber(val)}
              </div>
            </div>
          `;
        },
      },
      series: [
        {
          name: `Total ${metricConfig.title}`,
          type: 'area',
          data: seriesData,
        },
      ],
    };
  }, [weeklyData, metric, metricConfig]);

  const totalMetricCount = useMemo(() => {
    return weeklyData.reduce((sum, w) => sum + w[metric], 0);
  }, [weeklyData, metric]);

  const peakWeekly = useMemo(() => {
    return Math.max(...weeklyData.map((w) => w[metric]), 0);
  }, [weeklyData, metric]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: metricConfig.color }}
            />
            Total Changes
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Repository-wide weekly activity over the last year
          </p>
        </div>

        {/* Quick stat indicators */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <div>
            <span>1-Year Total:</span>{' '}
            <strong className="text-slate-900 font-mono font-semibold">
              {formatCommaNumber(totalMetricCount)}
            </strong>
          </div>
          <span aria-hidden="true" className="text-slate-200">·</span>
          <div>
            <span>Peak Week:</span>{' '}
            <strong className="text-slate-900 font-mono font-semibold">
              {formatCommaNumber(peakWeekly)}
            </strong>
          </div>
        </div>
      </div>

      {/* Highcharts Render */}
      <div className="w-full overflow-hidden">
        <HighchartsReactComponent highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};
