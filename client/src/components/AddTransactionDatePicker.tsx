import { cn } from "@/lib/utils";
import { endOfMonth, startOfDay, subMonths } from "date-fns";
import { DatePicker } from "./ui/date-picker";

interface AddTransactionDatePickerProps {
  value: number;
  onChange: (value: number) => void;
}

const lastDayOfPrevMonthTimestamp = endOfMonth(
  subMonths(new Date(), 1),
).getTime();

export function AddTransactionDatePicker({
  value,
  onChange,
}: AddTransactionDatePickerProps) {
  const dateItems = [
    ["Today", Date.now(), startOfDay(Date.now()).getTime() === startOfDay(value).getTime()],
    ["Previous Month", lastDayOfPrevMonthTimestamp, lastDayOfPrevMonthTimestamp === value],
  ] as const;

  return (
    <ul className="flex gap-4 flex-wrap">
      {dateItems.map(([label, timestamp, isActive]) => (
        <li key={label}>
          <button
            className={cn("px-2 py-1 rounded border border-gray-300 min-w-max text-sm", {
              "bg-gray-300": isActive,
            })}
            onClick={() => onChange(timestamp)}
            type="button"
          >
            {label}
          </button>
        </li>
      ))}
      <li>
        <DatePicker
          selected={value ? new Date(value) : undefined}
          onSelect={(date?: Date) => date && onChange(date.getTime())}
        />
      </li>
    </ul>
  );
}
