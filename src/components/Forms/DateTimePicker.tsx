'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  disableTime?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function DateTimePicker({
  label,
  value,
  onChange,
  disableTime = false,
  required = false,
  className = '',
  error,
  size = 'sm',
}: DateTimePickerProps) {
  const [datePart, setDatePart] = useState<Date | undefined>();
  const [timePart, setTimePart] = useState<string>('00:00');
  const [localError, setLocalError] = useState<string | undefined>(error);

  useEffect(() => {
    if (value) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        setDatePart(parsed);
        const [, time = '00:00'] = value.split('T');
        setTimePart(time.substring(0, 5)); // hh:mm
      }
    }
  }, [value]);

  const emitChange = (selectedDate: Date | undefined, selectedTime: string) => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const finalVal = `${dateStr}T${selectedTime || '00:00'}`;
    onChange(finalVal);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDatePart(date);
    emitChange(date, timePart);
    if (required && !date) {
      setLocalError('Tanggal wajib diisi.');
    } else {
      setLocalError(undefined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimePart(newTime);
    emitChange(datePart, newTime);
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {label && (
        <Label className="text-sm font-medium text-muted-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="flex gap-3 items-center">
        {/* Date via Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {datePart ? format(datePart, 'dd MMM yyyy') : <span className="text-muted-foreground">Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={datePart}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time input if enabled */}
        {!disableTime && (
          <div className="flex items-center gap-2 w-full">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={timePart}
              onChange={handleTimeChange}
              className="w-full"
            />
          </div>
        )}
      </div>

      {(localError || error) && (
        <p className="text-sm text-red-500">{localError || error}</p>
      )}
    </div>
  );
}