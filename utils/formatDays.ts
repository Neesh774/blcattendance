export function formatDays(days: string[]) {
  if (days.length === 1) {
    return days[0] + "s";
  }
  else if (days.length === 2) {
    return days[0] + "s and " + days[1] + "s";
  }
  else {
    let daysString = "";
    for (let i = 0; i < days.length - 1; i++) {
      daysString += days[i] + "s, ";
    }
    daysString += "and " + days[days.length - 1] + "s";
    return daysString;
  }
}