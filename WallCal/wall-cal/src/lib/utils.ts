import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats JS Date to YYYY-MM-DD
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const month = d.toLocaleString("default", { month: "short" });
  return `${month} ${d.getDate()}`;
}

export const MONTH_DATA = [
  { accent: "#457B9D", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&h=900&fit=crop" }, // Jan
  { accent: "#E07A5F", image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&h=900&fit=crop" }, // Feb
  { accent: "#81B29A", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&h=900&fit=crop" }, // Mar - Spring Blossoms
  { accent: "#F2CC8F", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1600&h=900&fit=crop" }, // Apr
  { accent: "#2A9D8F", image: "https://images.unsplash.com/photo-1772802764646-ded66e17265d?w=1600&h=900&fit=crop" }, // May - Wildflower Meadow
  { accent: "#E9C46A", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop" }, // Jun
  { accent: "#264653", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&h=900&fit=crop" }, // Jul
  { accent: "#F4A261", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=900&fit=crop" }, // Aug
  { accent: "#C17817", image: "https://images.unsplash.com/photo-1507371341162-763b5e419408?w=1600&h=900&fit=crop" }, // Sep
  { accent: "#D64933", image: "https://images.unsplash.com/photo-1445264618000-f1e069c5920f?w=1600&h=900&fit=crop" }, // Oct
  { accent: "#6D597A", image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1600&h=900&fit=crop" }, // Nov - Foggy Forest Morning
  { accent: "#355070", image: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1600&h=900&fit=crop" }, // Dec - Snowy Mountain Village
];

export const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "12-25": "Christmas Day"
};

export const FESTIVALS: Record<string, string> = {
  // 2025
  "2025-02-02": "Vasant Panchami",
  "2025-02-26": "Maha Shivaratri",
  "2025-03-14": "Holi",
  "2025-04-06": "Rama Navami",
  "2025-04-14": "Baisakhi",
  "2025-07-10": "Guru Purnima",
  "2025-08-09": "Raksha Bandhan",
  "2025-08-15": "Janmashtami (Smarta)",
  "2025-08-16": "Janmashtami (ISKCON)",
  "2025-08-27": "Ganesh Chaturthi",
  "2025-09-05": "Onam",
  "2025-10-02": "Dussehra",
  "2025-10-20": "Diwali",
  "2025-10-23": "Bhaiya Dooj",
  "2025-11-05": "Guru Nanak Jayanti",
  
  // 2026
  "2026-01-23": "Vasant Panchami",
  "2026-02-15": "Maha Shivaratri",
  "2026-03-04": "Holi",
  "2026-03-26": "Rama Navami (Smarta)",
  "2026-03-27": "Rama Navami (ISKCON)",
  "2026-08-26": "Onam",
  "2026-08-28": "Raksha Bandhan",
  "2026-09-04": "Krishna Janmashtami",
  "2026-09-14": "Ganesh Chaturthi",
  "2026-10-11": "Navratri Begins",
  "2026-10-20": "Dussehra",
  "2026-11-08": "Diwali",
  "2026-11-11": "Bhaiya Dooj",
  "2026-11-24": "Guru Nanak Jayanti",
  
  // 2027
  "2027-02-11": "Vasant Panchami",
  "2027-03-06": "Maha Shivaratri",
  "2027-03-22": "Holi",
  "2027-08-17": "Raksha Bandhan",
  "2027-08-25": "Krishna Janmashtami",
  "2027-09-04": "Ganesh Chaturthi",
  "2027-09-12": "Onam",
  "2027-10-09": "Dussehra",
  "2027-10-29": "Diwali",
  "2027-10-31": "Bhaiya Dooj",
  "2027-11-14": "Guru Nanak Jayanti"
};
