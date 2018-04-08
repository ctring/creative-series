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

function getRangeFromMultipleSeries(...series) {
  return series.reduce((prev, current) => {
    return [Math.min(prev[0], getRangeFromSeries(current)),
            Math.max(prev[1], getRangeFromSeries(current))];
  }, [Infinity, -Infinity]);
}

function fillArray(shape, value) {
  if (shape.length === 0) {
    return value;
  }
  return Array.from({ length: shape[0] }, (v, i) => fillArray(shape.slice(1), value));
}

const euclideanReduce = (prev, x, y) => (prev + Math.pow((x - y),2))

function dynamicTimeWarping(a, b, reduceFunc = euclideanReduce) {
  console.log(a);
  const m = a.length;
  const n = b.length;
  if (m === 0 || n === 0) {
    return {
      distance: 0,
      matches: [],
    }
  }

  let f = fillArray([m, n], 0);
  let trace = fillArray([m, n], [-1, -1]);

  f[0][0] = reduceFunc(0, a[0], b[0])

  for (let i = 1; i < m; i++) {
    f[i][0] = reduceFunc(f[i - 1][0], a[i], b[0]);
    trace[i][0] = [i - 1, 0];
  }

  for (let i = 1; i < n; i++) {
    f[0][i] = reduceFunc(f[0][i - 1], a[0], b[i]);
    trace[0][i] = [0, i - 1];
  }
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (f[i - 1][j] < f[i][j - 1] && f[i - 1][j] < f[i - 1][j - 1]) {
        f[i][j] = f[i - 1][j];
        trace[i][j] = [i - 1, j];
      }
      else if (f[i][j - 1] < f[i - 1][j] && f[i][j - 1] < f[i - 1][j - 1]) {
        f[i][j] = f[i][j - 1];
        trace[i][j] = [i, j - 1];
      }
      else {
        f[i][j] = f[i - 1][j - 1];
        trace[i][j] = [i - 1, j - 1];
      }
      f[i][j] = reduceFunc(f[i][j], a[i], b[j]);
    }
  }

  let i = m - 1;
  let j = n - 1;
  let matches = [];
  while (i !== -1) {
    matches.push([i, j])
    const tr = trace[i][j];
    i = tr[0];
    j = tr[1];
  }

  return {
    distance: Math.sqrt(f[m - 1][n - 1]),
    matches
  };
}

export {
  translate,
  scale,
  scaleAndTranslate,
  getRangeFromSeries,
  getRangeFromMultipleSeries,
  dynamicTimeWarping,
};