import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer } from 'react-konva';

import {
  scale,
  getRangeFromSeries
} from './algorithms';

import {
  computeScreenX,
  computeScreenY,
  computeSpace,
  renderLines,
  renderPoints,
  PADDING
} from './drawing';

export default class SeriesDrawer extends Component {
  state = {
    userOffset: [],
    screenOffset: [],
  };

  // Y range from user
  userRangeY() {

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { height, series } = nextProps;
    const { userOffset } = prevState;
    const rangeY = nextProps.rangeY || getRangeFromSeries(series);

    // Update offset when new rangeY comes in
    return {
      screenOffset: userOffset.map(
        (offset) => scale(offset, rangeY[0], rangeY[1], height, 0)
      )
    }
  }

  render() {
    const {
      width, height,
      series, rangeY,
      onOffsetChange,
      showOriginal
    } = this.props;
    const { screenOffset, userOffset } = this.state;
    const space = computeSpace(series, width);
    const userRangeY = rangeY ? rangeY.map(parseFloat) : getRangeFromSeries(series);
    const screenX = computeScreenX(series, space);
    const screenY = computeScreenY(series, userRangeY, height);

    // Function for updating the offsets of the points
    let offsetUpdateFunc = (e) => {
      if (e.evt && e.evt.buttons === 1) {
        let index = Math.floor((e.evt.layerX - PADDING + space / 2) / space);

        let newScreenOffset = screenOffset.slice();
        let newUserOffset = userOffset.slice();

        newScreenOffset[index] = e.evt.layerY - screenY[index];
        newUserOffset[index] = scale(newScreenOffset[index], 0, height, userRangeY[1], userRangeY[0]);

        onOffsetChange && onOffsetChange(newUserOffset);

        this.setState({ screenOffset: newScreenOffset, userOffset: newUserOffset });
      }
    };

    const zeroOffset = Array(screenOffset.length).fill(0);
    return (
      <Stage width={width} height={height}
        onMouseMove={offsetUpdateFunc}
        onMouseDown={offsetUpdateFunc}>
        <Layer>
          {showOriginal && renderLines(screenX, screenY, zeroOffset, 'gray')}
          {showOriginal && renderPoints(screenX, screenY, zeroOffset, 'original')}
          {renderLines(screenX, screenY, screenOffset, 'red')}
          {renderPoints(screenX, screenY, screenOffset, 'new')}
        </Layer>
      </Stage>
    )
  }
}

SeriesDrawer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  series: PropTypes.array.isRequired,
  rangeY: PropTypes.array,
  pointRadius: PropTypes.number,
  onOffsetChange: PropTypes.func,
  showOriginal: PropTypes.bool,
}