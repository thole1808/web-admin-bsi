"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

interface DashboardFilterProps {
  period: string;
  setPeriod: (val: string) => void;
}

const DashboardFilter: React.FC<DashboardFilterProps> = ({ period, setPeriod }) => {
  const periods = [
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "this_year", label: "This Year" },
  ];

  return (
    <div className="flex justify-end items-center gap-2 text-sm text-muted-foreground">
      <CalendarDays className="h-5 w-5 text-teal-600" />
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="w-[160px] text-xs">
          <SelectValue placeholder="Select Period" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DashboardFilter;