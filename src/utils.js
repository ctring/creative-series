function convertToSeriesFromString(seriesStr, sep) {
  return seriesStr.split(sep).map((x) => (parseFloat(x, 10)));
}
 
export { convertToSeriesFromString };