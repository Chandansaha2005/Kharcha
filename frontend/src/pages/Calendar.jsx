import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import api from "../api/axios";
import CalendarView from "../components/Calendar/CalendarView";
import DayDetailModal from "../components/Calendar/DayDetailModal";
import SkeletonLoader from "../components/Shared/SkeletonLoader";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarQuery = useQuery({
    queryKey: ["dashboard-summary", currentMonth.getMonth() + 1, currentMonth.getFullYear()],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/summary", {
        params: {
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        },
      });
      return data.calendarData;
    },
  });

  return (
    <div className="page-enter">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Calendar overview</p>
        <h1 className="mt-3 text-2xl font-black text-text sm:text-3xl">See income and spending day by day.</h1>
      </div>

      <div className="mt-6">
        {calendarQuery.isLoading ? (
          <SkeletonLoader className="h-[560px]" />
        ) : (
          <CalendarView
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            calendarData={calendarQuery.data || {}}
            onSelectDate={setSelectedDate}
          />
        )}
      </div>

      {selectedDate ? <DayDetailModal date={selectedDate} onClose={() => setSelectedDate(null)} /> : null}
    </div>
  );
}
