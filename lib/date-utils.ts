export function formatDate(date: Date, includeTime = false): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  let formattedDate = `${day}/${month}/${year}`;

  if (includeTime) {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    formattedDate += ` ${hours}:${minutes} ${ampm}`;
  }

  return formattedDate;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
}

export function getWeekdayName(day: number): string {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[day];
}

export function getYearsRange(currentYear: number, range = 65): number[] {
  const years = [];
  for (let i = currentYear - range; i <= currentYear + range; i++) {
    years.push(i);
  }
  return years;
}
