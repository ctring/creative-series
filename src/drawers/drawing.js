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

/**
 * Render lines connecting points of a series.
 * @param {array} screenX screen X-coordinates of the points
 * @param {array} screenY screen Y-coordinates of the points
 * @param {array} screenOffset offsets of the screen Y-coordinates
 * @param {string} key key for the line
 * @param {object} style style for the line
 */
function renderLines(screenX, screenY, screenOffset, key, style) {
  let points = [];
  screenY.forEach((y, i) => {
    points.push(screenX[i]);
    points.push(y + (screenOffset[i] || 0));
  });
  return <Line points={points} key={key} {...style} />
}

/**
 * Render points of a series.
 * @param {array} screenX screen X-coordinates of the points
 * @param {array} screenY screen Y-coordinates of the points
 * @param {array} screenOffset offsets of the screen Y-coordinates
 * @param {string} key prefix of key for the set of points
 * @param {object} style style for the points
 */
function renderPoints(screenX, screenY, screenOffset, key, style) {
  return screenY.map((y, i) => (
    <Circle
      x={screenX[i]}
      y={y + (screenOffset[i] || 0)}
      radius={POINT_RADIUS}
      key={key + i.toString()}
      {...style}
    />))
}

function packScreenData(screenX, screenY, screenOffset) {
  return { screenX, screenY, screenOffset };
}

/**
 * Render the matching lines between two series.
 * @param {object} screenData0 object of first series { screenX, screenY, screenOffset }
 * @param {object} screenData1 object of second series { screenX, screenY, screenOffset }
 * @param {array} matches array of pairs of point indices being matched
 * @param {string} stroke stroke color props of konva Line component
 */
function renderMatches(screenData0, screenData1, matches, style) {
  const {
    screenX: screenX0,
    screenY: screenY0,
    screenOffset: screenOffset0
  } = screenData0;
  const {
    screenX: screenX1,
    screenY: screenY1,
    screenOffset: screenOffset1
  } = screenData1;

  return matches.map((match, i) => {
    const { 0: m0, 1: m1} = match;
    const x0 = screenX0[m0];
    const y0 = screenY0[m0] + (screenOffset0[m0] || 0);
    const x1 = screenX1[m1];
    const y1 = screenY1[m1] + (screenOffset1[m1] || 0);
    const points = [x0, y0, x1, y1];
    return <Line points={points} key={'match-' + i} {...style} />
  })
}

export { 
  computeScreenX, 
  computeScreenY, 
  computeSpace,
  renderLines,
  renderPoints,
  renderMatches,
  packScreenData,
  PADDING,
  POINT_RADIUS
};