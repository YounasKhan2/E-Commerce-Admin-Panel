/**
 * DateRangeSelector Component
 * Allows users to select date ranges with presets or custom dates
 */

'use client';

import { useState } from 'react';

const PRESETS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days', value: 'last30days' },
  { label: 'Custom', value: 'custom' },
];

export default function DateRangeSelector({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetChange = (preset) => {
    if (preset === 'custom') {
      setShowCustom(true);
      return;
    }

    setShowCustom(false);
    const range = getDateRangeFromPreset(preset);
    onChange(range);
  };

  const getDateRangeFromPreset = (preset) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (preset) {
      case 'today':
        return {
          startDate: today.toISOString(),
          endDate: now.toISOString(),
          preset: 'today'
        };
      case 'last7days':
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        return {
          startDate: last7.toISOString(),
          endDate: now.toISOString(),
          preset: 'last7days'
        };
      case 'last30days':
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        return {
          startDate: last30.toISOString(),
          endDate: now.toISOString(),
          preset: 'last30days'
        };
      default:
        return value;
    }
  };

  const handleCustomDateChange = (field, dateValue) => {
    onChange({
      ...value,
      [field]: new Date(dateValue).toISOString(),
      preset: 'custom'
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetChange(preset.value)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              value?.preset === preset.value
                ? 'bg-primary text-white'
                : 'bg-sidebar border border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value?.startDate ? new Date(value.startDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
            className="px-3 py-2 bg-background-dark border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
          />
          <span className="text-slate-400 text-sm">to</span>
          <input
            type="date"
            value={value?.endDate ? new Date(value.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
            className="px-3 py-2 bg-background-dark border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
          />
        </div>
      )}
    </div>
  );
}
