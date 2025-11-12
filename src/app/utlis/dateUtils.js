// utils/dayBounds.js
function getDhakaYMD(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = +parts.find((p) => p.type === "year").value;
  const m = +parts.find((p) => p.type === "month").value;
  const d = +parts.find((p) => p.type === "day").value;
  return { y, m, d };
}

export function getDhakaStartEnd(date = new Date()) {
  const { y, m, d } = getDhakaYMD(date);
  const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
  return { start, end };
}
