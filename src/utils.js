function convertToSeriesFromString(seriesStr, sep) {
  return seriesStr.trim().split(sep).map((x) => (parseFloat(x, 10)));
}

function downloadURI(uri, name) {
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { convertToSeriesFromString, downloadURI };