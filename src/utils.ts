function getTimeStamp(): string {
  const today = new Date();
  const date = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  const seconds = today.getSeconds().toString().padStart(2, '0');

  const time = `${date} ${today.getHours()}:${today.getMinutes()}:${seconds}`;
  return time;
}

export default { getTimeStamp };
