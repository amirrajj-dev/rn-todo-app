const dateFilters: { label: string; value: "today" | "thisWeek" | "all" }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "thisWeek" },
  { label: "All", value: "all" },
];

const priorityFilters: {
  label: string;
  value: "low" | "medium" | "high" | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const notificationsFilter : {
  label: string;
  value: "all" | "seen" | "notSeen";
}[] = [
  { label: "All", value: "all" },
  { label: "Seen", value: "seen" },
  { label: "Not Seen", value: "notSeen" }
]

const motivationalQuotes = [
  "Small steps lead to big results. 🚀",
  "Done is better than perfect. ✅",
  "Progress, not perfection. 📈",
  "One task at a time. You got this! 💪",
  "The future is created by what you do today. ⏳",
  "Stay focused, stay productive. 🔍",
  "Every task completed is a win. 🏆",
  "Start where you are. Use what you have. Do what you can. 🌟",
  "Productivity is the key to freedom. 🔑",
  "Keep going. The effort will pay off. 🎯",
  "Keep pushing forward! 🚀",
  "Every step counts. 🐾",
  "You’re stronger than you think. 💪",
  "Seize the day! ☀️",
  "Dream big, act now. 🌟",
  "Focus and conquer. 🎯",
  "Make it happen. ⚡",
  "Rise and grind. ⏰",
  "Stay the course. 🛤️",
  "Small wins, big gains. 🏅",
  "Be unstoppable. 🔥",
  "One goal at a time. ✅",
  "Embrace the challenge. 🧗",
  "Keep it moving. 🏃",
  "You’ve got this! 🙌",
  "Action breeds success. 🛠️",
  "Stay hungry, stay focused. 🍽️",
  "Turn plans into reality. 🏗️",
  "Every task is progress. 📊",
  "Shine through the grind. ✨"
];

export { dateFilters, priorityFilters, motivationalQuotes };
