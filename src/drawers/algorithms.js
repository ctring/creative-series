function translate(x, fromLow, fromHigh, toLow, toHigh) {
  let factor = (toHigh - toLow) / (fromHigh - fromLow);
  return x - factor * fromLow + toLow;
}

function scale(x, fromLow, fromHigh, toLow, toHigh) {
  let factor = (toHigh - toLow) / (fromHigh - fromLow);
  return factor * x;
}

function scaleAndTranslate(x, fromLow, fromHigh, toLow, toHigh) {
  return translate(
    scale(x, fromLow, fromHigh, toLow, toHigh),
    fromLow, fromHigh, toLow, toHigh);
}

function getRangeFromSeries(series) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const padding = max === min ? 1 : (max - min) * 0.1;
  return [min - padding, max + padding];
}

export { translate, scale, scaleAndTranslate, getRangeFromSeries };