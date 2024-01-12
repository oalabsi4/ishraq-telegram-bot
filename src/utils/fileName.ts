
export function fileName(name: string) {
  const date = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
  };

  return `${name}-${date.year}-${date.month}-${date.day}-${date.hour}`;
}


