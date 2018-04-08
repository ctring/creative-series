import React from 'react';

import { Line, Circle } from 'react-konva';

import { 
  scaleAndTranslate,
} from './algorithms';

const PADDING = 5;
const POINT_RADIUS = 2;

// Series in screen coordinate system
function computeScreenY(series, rangeY, height) {
  return series.map((y, i) => (
    scaleAndTranslate(y, rangeY[0], rangeY[1], height, 0)
  ));
}

function computeSpace(series, width) {
  // Exclude left and right padding the divided by the number of segments
  return (width - 2 * PADDING) / (series.length - 1);
}

// X-coordinate in screen coordinate system
function computeScreenX(series, space) {
  return series.map((_, i) => (
    PADDING + i * space
  ));
}

function renderLines(screenX, screenY, screenOffset, isOriginal) {
  let points = [];
  let stroke;
  screenY.forEach((y, i) => {
    points.push(screenX[i]);
    if (isOriginal) {
      points.push(y);
      stroke='gray';
    }
    else {
      points.push(y + (screenOffset[i] || 0));
      stroke='red';
    }
  });
  return <Line points={points} stroke={stroke} />
}

function renderPoints(screenX, screenY, screenOffset, isOriginal) {
  return screenY.map((y, i) => {
    let trueY, key;
    if (isOriginal) {
      trueY = y;
      key = 'orig-' + i;
    }
    else {
      trueY = y + (screenOffset[i] || 0);
      key = 'new-' + i;
    }
    return (
      <Circle
        x={screenX[i]}
        y={trueY}
        radius={POINT_RADIUS}
        fill='black'
        key={key}
      />
    )
  })
}

export { 
  computeScreenX, 
  computeScreenY, 
  computeSpace,
  renderLines,
  renderPoints,
  PADDING,
  POINT_RADIUS
};