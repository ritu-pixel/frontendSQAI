export function transformData(data, options) {
  let [headers, ...rows] = data;

  if (options.uppercaseHeaders) {
    headers = headers.map((h) => h.toUpperCase());
  }

  if (options.removeEmpty) {
    rows = rows.filter((row) => row.some((cell) => cell !== ''));
  }

  return [headers, ...rows];
}
