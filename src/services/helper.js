export const handleDate = (date) => {
  // returns a formatted date string (eg: "January 1, 2020")
  if (!date) return "Unknown Date";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const truncateText = (text, maxLength = 100) => {
  // truncates text to a specified length and adds ellipsis if necessary
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
