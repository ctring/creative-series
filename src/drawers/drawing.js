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

function renderLines(screenX, screenY, screenOffset, stroke, key) {
  let points = [];
  screenY.forEach((y, i) => {
    points.push(screenX[i]);
    points.push(y + (screenOffset[i] || 0));
  });
  return <Line points={points} stroke={stroke} key={key} />
}

function renderPoints(screenX, screenY, screenOffset, key) {
  return screenY.map((y, i) => (
    <Circle
      x={screenX[i]}
      y={y + (screenOffset[i] || 0)}
      radius={POINT_RADIUS}
      fill='black'
      key={key + i.toString()}
    />))
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