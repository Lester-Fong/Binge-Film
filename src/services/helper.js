export const handleDate = (date) => {
  // returns a formatted date string (eg: "January 1, 2020")
  if (!date) return "Unknown Date";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};
