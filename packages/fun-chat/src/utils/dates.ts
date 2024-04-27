const pad = (n: number, s: number = 2) => `${new Array(s).fill(0)}${n}`.slice(-s);

export function timeDiffInherite(time: string) {
  const now = new Date();
  const date = new Date(time);
  let diff = now.getTime() - date.getTime();

  const diffDays = Math.floor(diff / 1000 / 60 / 60 / 24);
  diff -= diffDays * 1000 * 60 * 60 * 24;

  const diffHours = Math.floor(diff / 1000 / 60 / 60);
  if (diffHours > 12) {
    return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  diff -= diffHours * 1000 * 60 * 60;

  const diffMin = Math.floor(diff / 1000 / 60);
  diff -= diffMin * 1000 * 60;

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function timeDiff(currDate: string, lastDate: string = '') {
  const last = lastDate === '' ? new Date() : new Date(lastDate);
  const curr = new Date(currDate);

  const lastMonth = last.getMonth();
  const currMonth = curr.getMonth();
  const lastDay = last.getDate();
  const currDay = curr.getDate();

  if (lastMonth > currMonth || lastDay > currDay) {
    return `${pad(curr.getFullYear(), 4)}-${pad(currMonth + 1)}-${currDay}`;
  }
  return `${pad(curr.getHours())}:${pad(curr.getMinutes())}`;
}

export function timeFull(time: string | number) {
  const date = new Date(time);
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatTime(time: string | number) {
  const date = new Date(time);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDate(time: string | number) {
  const date = new Date(time);
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
