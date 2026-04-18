import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
  startOfMonth,
} from "date-fns";

export const CATEGORY_OPTIONS = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Education",
  "Other",
];

export const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const compactCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const decimalFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

export const formatCompactCurrency = (value) => compactCurrencyFormatter.format(Number(value || 0));

export const formatPercent = (value) => `${decimalFormatter.format(Math.abs(value || 0))}%`;

export const formatInputDate = (value = new Date()) => format(new Date(value), "yyyy-MM-dd");

export const formatDateHeader = (value) => {
  const date = value instanceof Date ? value : parseISO(String(value));

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "MMMM d");
};

export const formatLongDate = (value) => format(new Date(value), "EEEE, MMMM d");

export const formatRelativeTime = (value) =>
  formatDistanceToNow(new Date(value), {
    addSuffix: true,
  });

export const formatMonthYear = (value = new Date()) => format(new Date(value), "MMMM yyyy");

export const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: format(startOfMonth(new Date(2024, index, 1)), "MMMM"),
}));

export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => currentYear - 2 + index);
};
