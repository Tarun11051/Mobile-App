import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type DateItem = {
  day: string;
  dayNum: number;
  key: string;
};

type DateSelectorProps = {
  dates: DateItem[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const parseDateKey = (key: string): Date => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const da = String(date.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
};

const sameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const buildMonthGrid = (viewYear: number, viewMonth: number) => {
  const first = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startWeekday = first.getDay(); // 0 = Sunday
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewYear, viewMonth, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const DateSelector = ({
  dates,
  selectedDateKey,
  onSelectDate,
}: DateSelectorProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const selectedAsDate = useMemo(() => {
    const d = parseDateKey(selectedDateKey);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [selectedDateKey]);

  const [viewYear, setViewYear] = useState(selectedAsDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedAsDate.getMonth());

  const toggleCalendar = useCallback(() => {
    setCalendarOpen((prev) => {
      const next = !prev;
      if (next) {
        // Jump the calendar view to the currently-selected month when opening
        setViewYear(selectedAsDate.getFullYear());
        setViewMonth(selectedAsDate.getMonth());
      }
      return next;
    });
  }, [selectedAsDate]);

  const cells = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handlePickDate = (d: Date) => {
    onSelectDate(toDateKey(d));
    setCalendarOpen(false);
  };

  return (
    <View>
      {/* TOP ROW: chips + arrow */}
      <View style={styles.row}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
          contentContainerStyle={styles.dateRow}
        >
          {dates.map((d) => {
            const isSelected = d.key === selectedDateKey;
            return (
              <TouchableOpacity
                key={d.key}
                style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                onPress={() => onSelectDate(d.key)}
              >
                <Text
                  style={[
                    styles.dateChipDay,
                    isSelected && styles.dateChipTextSelected,
                  ]}
                >
                  {d.day}
                </Text>
                <Text
                  style={[
                    styles.dateChipNum,
                    isSelected && styles.dateChipTextSelected,
                  ]}
                >
                  {d.dayNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={[styles.arrowBtn, calendarOpen && styles.arrowBtnActive]}
          onPress={toggleCalendar}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={calendarOpen ? "Close calendar" : "Open calendar"}
        >
          <Text
            style={[styles.arrowIcon, calendarOpen && styles.arrowIconActive]}
          >
            {calendarOpen ? "✕" : "➤"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* INLINE CALENDAR — expands in-place, pushes content below it down */}
      {calendarOpen && (
        <View style={styles.calendarWrap}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={goPrevMonth} style={styles.navBtn}>
              <Text style={styles.navTxt}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTHS[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={goNextMonth} style={styles.navBtn}>
              <Text style={styles.navTxt}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {WEEK_DAYS.map((w) => (
              <Text key={w} style={styles.weekTxt}>
                {w}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((c, idx) => {
              if (!c) {
                return <View key={`empty-${idx}`} style={styles.cell} />;
              }
              const isSelected = sameDate(c, selectedAsDate);
              const isToday = sameDate(c, new Date());
              return (
                <TouchableOpacity
                  key={toDateKey(c)}
                  style={styles.cell}
                  onPress={() => handlePickDate(c)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.dayPill,
                      isSelected && styles.dayPillSelected,
                      !isSelected && isToday && styles.dayPillToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.cellTxt,
                        isSelected && styles.cellTxtSelected,
                      ]}
                    >
                      {c.getDate()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  dateScroll: { flex: 1, height: 76 },
  dateRow: { paddingHorizontal: 10, gap: 10 },
  dateChip: {
    width: 64,
    height: 76,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dateChipSelected: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  dateChipDay: { fontSize: 12, color: "#6B7280" },
  dateChipNum: { fontSize: 20, fontWeight: "700", color: "#111827" },
  dateChipTextSelected: { color: "#FFFFFF" },

  arrowBtn: {
    width: 52,
    height: 76,
    marginLeft: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowBtnActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  arrowIcon: { fontSize: 22, color: "#111827" },
  arrowIconActive: { color: "#FFFFFF" },

  /* ==== inline calendar ==== */
  calendarWrap: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    // soft elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  navTxt: { fontSize: 20, color: "#111827", lineHeight: 22 },
  monthLabel: { fontSize: 15, fontWeight: "700", color: "#111827" },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  weekTxt: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayPillSelected: { backgroundColor: "#2563EB" },
  dayPillToday: { borderWidth: 1, borderColor: "#2563EB" },
  cellTxt: { fontSize: 14, color: "#111827" },
  cellTxtSelected: { color: "#FFFFFF", fontWeight: "700" },
});