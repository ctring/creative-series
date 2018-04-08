import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer } from 'react-konva';

import {
  scale,
  getRangeFromMultipleSeries,
} from './algorithms';

import {
  computeScreenX,
  computeScreenY,
  computeSpace,
  renderLines,
  renderPoints,
} from './drawing';

export default class DynamicTimeWarpingDrawer extends Component {
  state = {
    userOffset1: [],
    userOffset2: [],
    screenOffset1: [],
    screenOffset2: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { height, series1, series2, rangeY } = nextProps;
    const { userOffset1, userOffset2 } = prevState;
    const computedRangeY = rangeY || getRangeFromMultipleSeries(series1, series2);

    // Update offset when new rangeY comes in
    return {
      screenOffset1: userOffset1.map(
        (offset) => scale(offset, rangeY[0], rangeY[1], height, 0)
      ),
      screenOffset2: userOffset2.map(
        (offset) => scale(offset, rangeY[0], rangeY[1], height, 0)
      )
    }
  }

  render() {
    const {
      width, height,
      series1, series2,
      onOffsetChange,
      showOriginal,
      rangeY,
    } = this.props;

    const {
      screenOffset1, screenOffset2,
      userOffset1, userOffset2,
    } = this.state;
    const space1 = computeSpace(series1, width);
    const space2 = computeSpace(series2, width);
    const computedRangeY = rangeY || getRangeFromMultipleSeries(series1, series2);
    const screenX1 = computeScreenX(series1, space1);
    const screenY1 = computeScreenY(series1, rangeY, height);
    const screenX2 = computeScreenX(series2, space2);
    const screenY2 = computeScreenY(series2, rangeY, height);

    // Function for updating the offsets of the points
    // let offsetUpdateFunc = (e) => {
    //   if (e.evt && e.evt.buttons === 1) {
    //     let index = Math.floor((e.evt.layerX - PADDING + space / 2) / space);

    //     let newScreenOffset = screenOffset.slice();
    //     let newUserOffset = userOffset.slice();

    //     newScreenOffset[index] = e.evt.layerY - screenY[index];
    //     newUserOffset[index] = scale(newScreenOffset[index], 0, height, userRangeY[1], userRangeY[0]);

    //     onOffsetChange && onOffsetChange(newUserOffset);

    //     this.setState({ screenOffset: newScreenOffset, userOffset: newUserOffset });
    //   }
    // };
    const zeroOffset1 = Array(screenOffset1.length).fill(0);
    const zeroOffset2 = Array(screenOffset2.length).fill(0);    
    return (
      <Stage width={width} height={height}
        // onMouseMove={offsetUpdateFunc}
        // onMouseDown={offsetUpdateFunc}
        >
        <Layer>
          {showOriginal && renderLines(screenX1, screenY1, zeroOffset1, 'gray')}
          {showOriginal && renderPoints(screenX1, screenY1, zeroOffset1, 'original1')}

          {showOriginal && renderLines(screenX2, screenY2, zeroOffset1, 'gray')}
          {showOriginal && renderPoints(screenX2, screenY2, zeroOffset2, 'original2')}

          {renderLines(screenX1, screenY1, screenOffset1, 'red')}
          {renderPoints(screenX1, screenY1, screenOffset1, 'new1')}

          {renderLines(screenX2, screenY2, screenOffset2, 'blue')}
          {renderPoints(screenX2, screenY2, screenOffset2, 'new2')}
        </Layer>
      </Stage>
    )
  }
}

DynamicTimeWarpingDrawer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  series1: PropTypes.array.isRequired,
  series2: PropTypes.array.isRequired,
  rangeY: PropTypes.array,
  pointRadius: PropTypes.number,
  onOffsetChange: PropTypes.func,
  showOriginal: PropTypes.bool,
}