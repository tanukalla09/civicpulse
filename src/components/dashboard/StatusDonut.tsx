'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { STATUS_CONFIG } from '@/lib/constants';
import { Status } from '@/types';

interface StatusData {
  name: Status;
  value: number;
}

interface StatusDonutProps {
  data: StatusData[];
}

export default function StatusDonut({ data }: StatusDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Filter out items with 0 values so they don't render empty labels
  const chartData = data.filter((item) => item.value > 0);

  return (
    <div className="w-full h-[300px] bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
      <div className="mb-2">
        <h4 className="text-lg font-bold text-slate-100 font-heading">
          Status Distribution
        </h4>
        <p className="text-xs text-slate-400 font-sans">
          Real-time resolution stage tracking
        </p>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-[160px]">
        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-100 font-heading">
            {total}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            Total Issues
          </span>
        </div>

        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => {
                  const statusColor = STATUS_CONFIG[entry.name]?.color || '#6b7280';
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColor}
                      stroke="rgba(15, 23, 42, 0.5)"
                      strokeWidth={2}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as StatusData;
                    const statusColor = STATUS_CONFIG[dataPoint.name]?.color || '#6b7280';
                    const percentage = total > 0 ? ((dataPoint.value / total) * 100).toFixed(1) : '0';
                    return (
                      <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: statusColor }}
                          />
                          <span className="text-xs font-semibold text-slate-200">
                            {dataPoint.name}
                          </span>
                        </div>
                        <p className="text-sm font-bold mt-1 text-slate-100">
                          {dataPoint.value} ({percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item) => {
          const config = STATUS_CONFIG[item.name] || { color: '#6b7280' };
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
          return (
            <div key={item.name} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-950/20 border border-white/5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-300 truncate">
                  {item.name}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {item.value} ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
