'use client';

import React, { useState } from 'react';
import { CATEGORIES, CITIES } from '@/lib/constants';
import { Category, Status } from '@/types';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  RotateCcw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MapFilterState {
  searchQuery: string;
  city: string;
  categories: Category[];
  statuses: Status[];
  dateRange: 'all' | '24h' | 'week' | 'month';
}

interface MapFilterPanelProps {
  filters: MapFilterState;
  onChangeFilters: (filters: MapFilterState) => void;
}

export default function MapFilterPanel({ filters, onChangeFilters }: MapFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, city: e.target.value });
  };

  const toggleCategory = (category: Category) => {
    const isSelected = filters.categories.includes(category);
    const newCategories = isSelected
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onChangeFilters({ ...filters, categories: newCategories });
  };

  const toggleStatus = (status: Status) => {
    const isSelected = filters.statuses.includes(status);
    const newStatuses = isSelected
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChangeFilters({ ...filters, statuses: newStatuses });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, dateRange: e.target.value as MapFilterState['dateRange'] });
  };

  const resetFilters = () => {
    onChangeFilters({
      searchQuery: '',
      city: 'All',
      categories: [],
      statuses: [],
      dateRange: 'all',
    });
  };

  const activeFiltersCount = 
    (filters.searchQuery ? 1 : 0) + 
    (filters.city !== 'All' ? 1 : 0) + 
    filters.categories.length + 
    filters.statuses.length + 
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className="relative z-10 h-full flex">
      {/* Sidebar Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full bg-slate-900/95 backdrop-blur-md border-r border-white/5 flex flex-col overflow-hidden shadow-2xl w-80"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                <h2 className="font-heading font-bold text-lg text-white">Filter Reports</h2>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Search Location / Keywords
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by area or description..."
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* City Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Select City
                </label>
                <select
                  value={filters.city}
                  onChange={handleCityChange}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                >
                  <option value="All">All Cities</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filters */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Categories
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = filters.categories.includes(cat.name);
                    return (
                      <button
                        key={cat.name}
                        onClick={() => toggleCategory(cat.name)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-white/20 text-white'
                            : 'bg-transparent border-white/5 text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cat.emoji}</span>
                          <span>{cat.name}</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500 text-slate-950'
                              : 'border-white/20'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Filters */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Open', 'Verified', 'In Progress', 'Resolved'] as Status[]).map((status) => {
                    const isSelected = filters.statuses.includes(status);
                    
                    const dotColors = {
                      'Open': 'bg-red-500',
                      'Verified': 'bg-yellow-500',
                      'In Progress': 'bg-blue-500',
                      'Resolved': 'bg-green-500',
                    };

                    return (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-white/20 text-white'
                            : 'bg-transparent border-white/5 text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
                        <span>{status}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Timeframe
                </label>
                <select
                  value={filters.dateRange}
                  onChange={handleDateRangeChange}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                >
                  <option value="all">All Time</option>
                  <option value="24h">Past 24 Hours</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                </select>
              </div>
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-slate-950/40 border-t border-white/5 text-[11px] text-slate-400">
              Showing filtered results based on your selection. Changes apply in real-time.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle Button */}
      <div className="h-full flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 text-white border-y border-r border-white/10 p-1.5 rounded-r-xl shadow-lg hover:text-amber-500 hover:bg-slate-800 transition-all focus:outline-none flex items-center justify-center z-20"
          style={{ height: '50px', width: '28px' }}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
