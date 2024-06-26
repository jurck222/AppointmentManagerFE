export function formatTime(time: number) {
  if (time < 10) {
    return `0${time}:00:00`;
  }
  return `${time}:00:00`;
}

export function formatDate(num: number) {
  return num < 10 ? `0${num}` : num;
}
