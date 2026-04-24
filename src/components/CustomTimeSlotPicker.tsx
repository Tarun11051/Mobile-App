import React, { useState, useRef } from "react";
import {
  Modal,
  Platform,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import dayjs, { Dayjs } from "dayjs";

// ─── Web-only MUI imports ─────────────────────────────────────────────────────
let LocalizationProvider: any = null;
let AdapterDayjs: any = null;
let MUITimePicker: any = null;
if (Platform.OS === "web") {
  try {
    LocalizationProvider =
      require("@mui/x-date-pickers/LocalizationProvider").LocalizationProvider;
    AdapterDayjs = require("@mui/x-date-pickers/AdapterDayjs").AdapterDayjs;
    MUITimePicker = require("@mui/x-date-pickers/TimePicker").TimePicker;
  } catch (_) {}
}

type Props = {
  onApply: (value: string) => void;
  disabled?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5; // must be odd
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

// ─── Drum Roll Column ─────────────────────────────────────────────────────────
const DrumColumn = ({
  items,
  selectedIndex,
  onSelect,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) => {
  const flatRef = useRef<FlatList>(null);
  const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

  // Scroll to selected on mount
  React.useEffect(() => {
    setTimeout(() => {
      flatRef.current?.scrollToOffset({
        offset: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 50);
  }, []);

  return (
    <View style={{ height: PICKER_HEIGHT, width: 70, overflow: "hidden" }}>
      {/* Top fade */}
      <View style={drumStyles.fadeTop} pointerEvents="none" />
      {/* Center highlight */}
      <View style={drumStyles.centerHighlight} pointerEvents="none" />
      {/* Bottom fade */}
      <View style={drumStyles.fadeBottom} pointerEvents="none" />

      <FlatList
        ref={flatRef}
        data={items}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: PADDING }}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          const clamped = Math.max(0, Math.min(index, items.length - 1));
          onSelect(clamped);
        }}
        onScrollEndDrag={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          const clamped = Math.max(0, Math.min(index, items.length - 1));
          onSelect(clamped);
        }}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              style={drumStyles.item}
              onPress={() => {
                onSelect(index);
                flatRef.current?.scrollToOffset({
                  offset: index * ITEM_HEIGHT,
                  animated: true,
                });
              }}
              activeOpacity={0.6}
            >
              <Text style={[drumStyles.itemText, isSelected && drumStyles.itemTextSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

// ─── Full Picker Modal ────────────────────────────────────────────────────────
const NativeDrumPicker = ({
  time,
  onChange,
  onDone,
  onCancel,
}: {
  time: Dayjs;
  onChange: (d: Dayjs) => void;
  onDone: () => void;
  onCancel: () => void;
}) => {
  const [hourIdx,   setHourIdx]   = useState(HOURS.indexOf(time.format("hh")));
  const [minuteIdx, setMinuteIdx] = useState(MINUTES.indexOf(time.format("mm")));
  const [periodIdx, setPeriodIdx] = useState(PERIODS.indexOf(time.format("A")));

  const commit = (hI: number, mI: number, pI: number) => {
    const h = parseInt(HOURS[hI]);
    const m = parseInt(MINUTES[mI]);
    const p = PERIODS[pI];
    const h24 = p === "AM" ? h % 12 : (h % 12) + 12;
    onChange(time.hour(h24).minute(m).second(0));
  };

  return (
    <Modal transparent animationType="slide">
      <View style={drumStyles.overlay}>
        <View style={drumStyles.sheet}>
          {/* Header */}
          <View style={drumStyles.header}>
            <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
              <Text style={drumStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={drumStyles.headerTitle}>Select Time</Text>
            <TouchableOpacity onPress={onDone} activeOpacity={0.7}>
              <Text style={drumStyles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Drum Columns */}
          <View style={drumStyles.columnsRow}>
            <DrumColumn
              items={HOURS}
              selectedIndex={hourIdx}
              onSelect={(i) => { setHourIdx(i); commit(i, minuteIdx, periodIdx); }}
            />
            <Text style={drumStyles.colon}>:</Text>
            <DrumColumn
              items={MINUTES}
              selectedIndex={minuteIdx}
              onSelect={(i) => { setMinuteIdx(i); commit(hourIdx, i, periodIdx); }}
            />
            <View style={{ width: 16 }} />
            <DrumColumn
              items={PERIODS}
              selectedIndex={periodIdx}
              onSelect={(i) => { setPeriodIdx(i); commit(hourIdx, minuteIdx, i); }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CustomTimeSlotPicker = ({ onApply, disabled = false }: Props) => {
  const [time, setTime] = useState<Dayjs>(dayjs());
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (value: Dayjs) => value.format("hh:mm A");

  // Web
  if (Platform.OS === "web" && MUITimePicker && LocalizationProvider && AdapterDayjs) {
    return (
      <div style={webStyles.wrap}>
        <p style={webStyles.title}>Custom Time Slot</p>
        <p style={webStyles.hint}>Select time using picker</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MUITimePicker
            label="Select Time"
            value={time}
            onChange={(v: Dayjs | null) => v && setTime(v)}
            disabled={disabled}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                sx: {
                  marginTop: "10px",
                  backgroundColor: "#F8FAFC",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                },
              },
            }}
          />
        </LocalizationProvider>
        <button
          style={{ ...webStyles.btn, ...(disabled ? webStyles.btnDisabled : {}) }}
          onClick={() => !disabled && onApply(formatTime(time))}
          disabled={disabled}
        >
          Apply
        </button>
      </div>
    );
  }

  // Native
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Custom Time Slot</Text>
      <Text style={styles.hint}>Select time using picker</Text>

      <TouchableOpacity
        style={[styles.input, disabled && { opacity: 0.5 }]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        activeOpacity={0.75}
      >
        <View style={styles.inputLeft}>
          <Text style={styles.clockEmoji}>🕐</Text>
          <Text style={styles.inputText}>{formatTime(time)}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, disabled && styles.btnDisabled]}
        onPress={() => onApply(formatTime(time))}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Apply</Text>
      </TouchableOpacity>

      {showPicker && (
        <NativeDrumPicker
          time={time}
          onChange={setTime}
          onDone={() => setShowPicker(false)}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </View>
  );
};

export default CustomTimeSlotPicker;

// ─── Drum Picker Styles ───────────────────────────────────────────────────────
const drumStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  cancelText: { fontSize: 15, color: "#8E8E93" },
  doneText: { fontSize: 15, fontWeight: "700", color: "#2563EB" },
  columnsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  item: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 22,
    color: "#636366",
    fontWeight: "400",
  },
  itemTextSelected: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  colon: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginHorizontal: 4,
    marginBottom: 4,
  },
  centerHighlight: {
    position: "absolute",
    top: 48 * 2,             // ITEM_HEIGHT * floor(VISIBLE_ITEMS/2)
    left: 6,
    right: 6,
    height: 48,
    backgroundColor: "rgba(37,99,235,0.15)",
    borderRadius: 10,
    zIndex: 1,
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 2,
    backgroundColor: "transparent",
    // Simulated fade using opacity overlay
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 2,
    backgroundColor: "transparent",
  },
});

// ─── Main Styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
  },
  title: { fontSize: 15, fontWeight: "700", color: "#111827" },
  hint: { marginTop: 4, color: "#6B7280", fontSize: 12 },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  clockEmoji: { fontSize: 16 },
  inputText: { color: "#111827", fontSize: 16, fontWeight: "600" },
  chevron: { fontSize: 22, color: "#9CA3AF", marginTop: -2 },
  btn: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },
  btnDisabled: { backgroundColor: "#93C5FD" },
  btnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
});

// ─── Web Styles ───────────────────────────────────────────────────────────────
const webStyles: Record<string, React.CSSProperties> = {
  wrap: {
    marginTop: 14,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    border: "1px solid #E5E7EB",
    padding: 14,
    fontFamily: "sans-serif",
  },
  title: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 },
  hint: { marginTop: 4, color: "#6B7280", fontSize: 12, margin: "4px 0 0" },
  btn: {
    marginTop: 12,
    width: "100%",
    backgroundColor: "#2563EB",
    border: "none",
    borderRadius: 10,
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: 13,
    paddingTop: 12,
    paddingBottom: 12,
    cursor: "pointer",
  },
  btnDisabled: { backgroundColor: "#93C5FD", cursor: "not-allowed" },
};