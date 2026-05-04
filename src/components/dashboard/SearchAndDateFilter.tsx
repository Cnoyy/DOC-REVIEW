"use client";

import { useState, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangeCalendar } from "@/components/ui/date-range-calendar";

interface DateRange {
  from: string | null;
  to: string | null;
}

interface SearchAndDateFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  placeholder?: string;
}

export default function SearchAndDateFilter({
  search,
  onSearchChange,
  sortOrder,
  onSortOrderChange,
  dateRange,
  onDateRangeChange,
  placeholder = "Search documents by name...",
}: SearchAndDateFilterProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState<'from' | 'to' | null>(null);
  const [tempFromDate, setTempFromDate] = useState<Date | null>(
    dateRange.from ? new Date(dateRange.from) : null
  );
  const [tempToDate, setTempToDate] = useState<Date | null>(
    dateRange.to ? new Date(dateRange.to) : null
  );
  const [dateRangeInput, setDateRangeInput] = useState(() => {
    if (dateRange.from && dateRange.to) {
      const from = new Date(dateRange.from).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      const to = new Date(dateRange.to).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      return `${from} - ${to}`;
    } else if (dateRange.from) {
      return new Date(dateRange.from).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    }
    return '';
  });

  const handleDateRangeChange = useCallback((type: 'from' | 'to', value: string) => {
    onDateRangeChange({ ...dateRange, [type]: value });
  }, [dateRange, onDateRangeChange]);

  const clearDateRange = useCallback(() => {
    setTempFromDate(null);
    setTempToDate(null);
    setDateRangeInput('');
    setActiveCalendar(null);
    onDateRangeChange({ from: null, to: null });
  }, [onDateRangeChange]);

  const formatDateForDisplay = useCallback((dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-9 pr-4 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-slate-500/20 focus-visible:border-slate-400 transition-colors"
        />
      </div>

      <div className="flex gap-2">
        {/* Date Range Filter */}
        <div className="relative">
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 h-10 px-4 text-sm font-medium bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <CalendarIcon className="h-4 w-4 text-slate-400" />
            {dateRange.from || dateRange.to ? (
              <span className="text-slate-700 font-medium">
                {formatDateForDisplay(dateRange.from)} - {formatDateForDisplay(dateRange.to)}
              </span>
            ) : (
              <span className="text-slate-700">Date Range</span>
            )}
            {(dateRange.from || dateRange.to) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  clearDateRange();
                  setShowCalendar(false);
                }}
                className="ml-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Calendar Popup */}
          {showCalendar && (
            <div className="absolute top-full mt-2 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-4 min-w-[320px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Select Date Range</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCalendar(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <DateRangeCalendar
                  fromDate={tempFromDate}
                  toDate={tempToDate}
                  onSelectRange={(from, to) => {
                    setTempFromDate(from);
                    setTempToDate(to);
                    if (from && to) {
                      const fromStr = from.toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      });
                      const toStr = to.toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      });
                      setDateRangeInput(`${fromStr} - ${toStr}`);
                    } else if (from) {
                      const fromStr = from.toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      });
                      setDateRangeInput(fromStr);
                    } else {
                      setDateRangeInput('');
                    }
                  }}
                />
                
                {/* Sort Order Section */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-2">Sort Order</label>
                  <div className="flex gap-2">
                    <Button
                      variant={sortOrder === "desc" ? "mybutton" : "mycancel"}
                      size="sm"
                      onClick={() => onSortOrderChange("desc")}
                      className="flex-1"
                    >
                      Newest
                    </Button>
                    <Button
                      variant={sortOrder === "asc" ? "mybutton" : "mycancel"}
                      size="sm"
                      onClick={() => onSortOrderChange("asc")}
                      className="flex-1"
                    >
                      Oldest
                    </Button>
                  </div>
                </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="mycancel"
                  size="sm"
                  onClick={() => {
                    clearDateRange();
                    onSortOrderChange("desc"); // Reset to default
                    setShowCalendar(false);
                  }}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button
                  variant="mybutton"
                  size="sm"
                  onClick={() => {
                    const newDateRange = {
                      from: tempFromDate ? tempFromDate.toISOString().split('T')[0] : null,
                      to: tempToDate ? tempToDate.toISOString().split('T')[0] : null,
                    };
                    onDateRangeChange(newDateRange);
                    setShowCalendar(false);
                  }}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
          </div>
        </div>
          )}
        </div>
      </div>
    </div>
  );
}
