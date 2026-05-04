"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeCalendarProps {
  fromDate: Date | null;
  toDate: Date | null;
  onSelectRange: (from: Date | null, to: Date | null) => void;
  className?: string;
}

function DateRangeCalendar({ fromDate, toDate, onSelectRange, className }: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);
  const [selectingFrom, setSelectingFrom] = React.useState(true);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    if (selectingFrom) {
      onSelectRange(date, null);
      setSelectingFrom(false);
    } else {
      if (fromDate && date < fromDate) {
        // If selected date is before from date, swap them
        onSelectRange(date, fromDate);
      } else {
        onSelectRange(fromDate, date);
      }
      setSelectingFrom(true);
    }
  };

  const isInRange = (date: Date) => {
    if (!fromDate || !toDate) return false;
    return date >= fromDate && date <= toDate;
  };

  const isSelected = (date: Date) => {
    return (fromDate && date.toDateString() === fromDate.toDateString()) ||
           (toDate && date.toDateString() === toDate.toDateString());
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const selected = isSelected(date);
      const inRange = isInRange(date);
      const today = isToday(date);
      const hovered = hoveredDate && date.toDateString() === hoveredDate.toDateString();
      const isFrom = fromDate && date.toDateString() === fromDate.toDateString();
      const isTo = toDate && date.toDateString() === toDate.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
          className={cn(
            "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
            "hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400",
            selected && "bg-slate-500 text-white hover:bg-slate-600",
            !selected && inRange && "bg-slate-100 text-slate-900",
            !selected && today && "bg-slate-100 text-slate-900",
            !selected && !inRange && !today && hovered && "bg-slate-100",
            isFrom && "rounded-l-lg",
            isTo && "rounded-r-lg"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={cn("p-3 bg-white rounded-xl border border-slate-200", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </button>
        
        <div className="text-sm font-semibold text-slate-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </button>
      </div>

      {/* Selection Status */}
      <div className="mb-3 p-2 bg-slate-50 rounded-lg">
        <div className="text-xs font-medium text-slate-700 mb-1">
          {selectingFrom ? "Select From Date" : "Select To Date"}
        </div>
        <div className="flex gap-2 text-xs">
          <div className={cn(
            "px-2 py-1 rounded",
            selectingFrom ? "bg-slate-500 text-white" : "bg-slate-200 text-slate-600"
          )}>
            From: {fromDate ? fromDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : 'Not selected'}
          </div>
          <div className={cn(
            "px-2 py-1 rounded",
            !selectingFrom ? "bg-slate-500 text-white" : "bg-slate-200 text-slate-600"
          )}>
            To: {toDate ? toDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : 'Not selected'}
          </div>
        </div>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="h-8 w-8 flex items-center justify-center text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Reset button */}
      <div className="mt-3 pt-3 border-t border-slate-200">
        <button
          onClick={() => {
            onSelectRange(null, null);
            setSelectingFrom(true);
          }}
          className="w-full px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
}

export { DateRangeCalendar };
