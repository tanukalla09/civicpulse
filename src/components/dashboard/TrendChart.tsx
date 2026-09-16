'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendData {
  date: string;
  reported: number;
  resolved: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="w-full h-[300px] bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-slate-100 font-heading">
            Reporting & Resolution Trend
          </h4>
          <p className="text-xs text-slate-400 font-sans">
            30-day activity comparison
          </p>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-950/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl space-y-1">
                      <p className="text-xs font-semibold text-slate-400">
                        {payload[0].payload.date}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-amber-400 font-medium">Reported:</span>
                        <span className="text-sm font-bold text-slate-100">{payload[0].value}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-emerald-400 font-medium">Resolved:</span>
                        <span className="text-sm font-bold text-slate-100">{payload[1]?.value}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              content={({ payload }) => {
                return (
                  <div className="flex justify-end gap-4 text-xs font-medium text-slate-400 mb-2">
                    {payload?.map((entry: any, index: number) => (
                      <div key={`item-${index}`} className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.value === 'reported' ? 'Issues Reported' : 'Issues Resolved'}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="reported"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#f59e0b', strokeWidth: 1, fill: '#0f172a' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#22c55e', strokeWidth: 1, fill: '#0f172a' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#22c55e' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
