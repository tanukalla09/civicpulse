'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CATEGORIES } from '@/lib/constants';

interface ResolutionData {
  category: string;
  avgDays: number;
  resolvedCount: number;
}

interface ResolutionTrackerProps {
  data: ResolutionData[];
}

export default function ResolutionTracker({ data }: ResolutionTrackerProps) {
  // Map categories to ensure we have emoji and color
  const chartData = data.map((item) => {
    const catInfo = CATEGORIES.find((c) => c.name === item.category);
    return {
      ...item,
      displayName: catInfo ? `${catInfo.emoji} ${item.category}` : item.category,
      color: catInfo ? catInfo.color : '#6b7280',
    };
  });

  return (
    <div className="w-full h-[300px] bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-slate-100 font-heading">
          Resolution Speed by Category
        </h4>
        <p className="text-xs text-slate-400 font-sans">
          Average number of days taken to resolve reported issues
        </p>
      </div>

      <div className="flex-1 w-full h-full min-h-[200px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500 font-medium">
            No resolved issues data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} horizontal={false} />
              <XAxis
                type="number"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={5}
                label={{ value: 'Days to Resolve', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as ResolutionData & { displayName: string; color: string };
                    return (
                      <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
                        <p className="text-xs font-semibold text-slate-200">
                          {dataPoint.displayName}
                        </p>
                        <p className="text-sm font-bold mt-1" style={{ color: dataPoint.color }}>
                          {dataPoint.avgDays.toFixed(1)} {dataPoint.avgDays === 1 ? 'day' : 'days'} average
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Based on {dataPoint.resolvedCount} resolved {dataPoint.resolvedCount === 1 ? 'issue' : 'issues'}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }}
              />
              <Bar dataKey="avgDays" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
