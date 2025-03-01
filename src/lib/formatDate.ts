export function formatDate(date: Date | undefined) {
  if (!date) {
    return null;
  }
  const castDate = new Date(date.toString());
  const formatDate =
    castDate.getFullYear() +
    "年" +
    String(castDate.getMonth() + 1).padStart(2, "0") +
    "月" +
    String(castDate.getDate()).padStart(2, "0") +
    "日";
  return formatDate;
}
