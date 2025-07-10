export function getOffset(): number {
  let offset = localStorage.getItem("time_offset");
  if (offset == null) return 0;
  return parseInt(offset);
}

export function setOffset(offset: number) {
  localStorage.setItem("time_offset", offset.toString());
}

export function addOffsetBySeconds(offset_seconds: number) {
  setOffset(getOffset() + offset_seconds * 1000);
}

export function addOffsetByMinutes(offset_minutes: number) {
  addOffsetBySeconds(offset_minutes * 60);
}

export function addOffsetByHours(offset_hours: number) {
  addOffsetByMinutes(offset_hours * 60);
}

export function addOffsetByDays(offset_days: number) {
  addOffsetByHours(offset_days * 24);
}

export function getNow(): number {
  return new Date().getTime() + getOffset();
}

export function getNowDate(): Date {
  return new Date(getNow());
}
