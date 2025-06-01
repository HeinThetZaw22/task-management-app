import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import { Box, Typography, IconButton, ButtonBase } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

interface WeeklyDatePickerProps {
  onFilterChange?: (params: {
    dueMin: string;
    dueMax: string;
    selectedDate: string | null;
  }) => void;
  initialSelectedDate?: string | null;
}

const WeeklyDatePicker: React.FC<WeeklyDatePickerProps> = ({
  onFilterChange,
  initialSelectedDate = null,
}) => {
  const [currentStartDate, setCurrentStartDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialSelectedDate
  );

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(currentStartDate, i)
  );

  const dueMin = format(currentStartDate, "yyyy-MM-dd");
  const dueMax = format(
    endOfWeek(currentStartDate, { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  const handleDayToggle = (dateStr: string) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  };

  const goToPreviousWeek = () => {
    setCurrentStartDate((prev) => addDays(prev, -7));
    setSelectedDate(null);
  };

  const goToNextWeek = () => {
    setCurrentStartDate((prev) => addDays(prev, 7));
    setSelectedDate(null);
  };

  useEffect(() => {
    onFilterChange?.({
      dueMin,
      dueMax,
      selectedDate,
    });
  }, [dueMin, dueMax, selectedDate]);

  return (
    <Box p={2}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <IconButton onClick={goToPreviousWeek}>
          <ArrowBackIos fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1">
          {format(currentStartDate, "MMM d")} –{" "}
          {format(addDays(currentStartDate, 6), "MMM d, yyyy")}
        </Typography>
        <IconButton onClick={goToNextWeek}>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>

      {/* Dates Row */}
      <Box display="flex" gap={2} overflow="auto">
        {weekDates.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const isSelected = selectedDate === dateStr;

          return (
            <Box key={dateStr} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                {format(date, "EEE")}
              </Typography>
              <ButtonBase
                onClick={() => handleDayToggle(dateStr)}
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  mt: 0.5,
                  bgcolor: isSelected
                    ? theme.palette.primary.main
                    : theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[200],
                  color: isSelected
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  transition: "0.2s",
                })}
              >
                <Typography variant="body2">{format(date, "d")}</Typography>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default WeeklyDatePicker;
