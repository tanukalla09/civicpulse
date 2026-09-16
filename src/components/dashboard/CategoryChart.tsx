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

interface CategoryData {
  category: string;
  count: number;
  color: string;
}

interface CategoryChartProps {
  data: CategoryData[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  // Map categories to ensure we have emoji or proper label
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
          Issues by Category
        </h4>
        <p className="text-xs text-slate-400 font-sans">
          Distribution of reported concerns across the city
        </p>
      </div>

      <div className="flex-1 w-full h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
            <XAxis
              dataKey="displayName"
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
                  const dataPoint = payload[0].payload as CategoryData & { displayName: string };
                  return (
                    <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
                      <p className="text-xs font-semibold text-slate-200">
                        {dataPoint.displayName}
                      </p>
                      <p className="text-sm font-bold mt-1" style={{ color: dataPoint.color }}>
                        {dataPoint.count} {dataPoint.count === 1 ? 'Issue' : 'Issues'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 8 }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={45}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
