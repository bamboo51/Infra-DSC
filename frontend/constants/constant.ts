export const DETECTION_COLORS = new Map<string, string>([
  ["longitudinal", "#FF3838"],
  ["equal interval", "#FF9D97"],
  ["alligator", "#FF701F"],
  ["whiteline blur", "#FFB21D"],
  ["crosswalk blur", "#CFD231"],
  ["pothole", "#48F90A"]
]);

export const API_URL = process.env.NEXT_PUBLIC_DJANGO_URL || "http://localhost:8000/api";