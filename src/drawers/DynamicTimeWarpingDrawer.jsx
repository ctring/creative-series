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
  PADDING,
} from './drawing';

export default class DynamicTimeWarpingDrawer extends Component {
  state = {
    userOffset: [],   // 2-D array
    screenOffset: [], // 2-D array
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { height, series, rangeY } = nextProps;
    const computedRangeY = rangeY || getRangeFromMultipleSeries(...series);

    const newUserOffset = prevState.userOffset.length === 0 ?
      Array(series.length).fill([]) : prevState.userOffset;

    const newScreenOffset = newUserOffset.map((offsets) => (
      offsets.map((offset) => scale(offset,
        computedRangeY[0], computedRangeY[1], height, 0))
    ));

    // Update offset when new rangeY comes in
    return {
      screenOffset: newScreenOffset,
      userOffset: newUserOffset,
    }
  }

  render() {
    const {
      width, height,
      series,         // 2-D array
      onOffsetChange,
      showOriginal,
      rangeY,
      focusSeries,      
    } = this.props;

    const {
      screenOffset,
      userOffset,
    } = this.state;

    const space = series.map((s) => computeSpace(s, width));
    const computedRangeY = rangeY || getRangeFromMultipleSeries(...series);
    const screenX = series.map((s, i) => computeScreenX(s, space[i]));
    const screenY = series.map((s) => computeScreenY(s, rangeY, height));

    // Function for updating the offsets of the points
    let offsetUpdateFunc = (e) => {
      if (e.evt && e.evt.buttons === 1) {
        const index = Math.floor((e.evt.layerX - PADDING + space[focusSeries] / 2)
          / space[focusSeries]);

        let newScreenOffset = screenOffset.slice();
        let newUserOffset = userOffset.slice();
        let newScreenOffsetFS = newScreenOffset[focusSeries].slice();
        let newUserOffsetFS = newUserOffset[focusSeries].slice();

        newScreenOffsetFS[index] = e.evt.layerY - screenY[focusSeries][index];
        newUserOffsetFS[index] = scale(newScreenOffsetFS[index],
          0, height, computedRangeY[1], computedRangeY[0]);

        onOffsetChange && onOffsetChange(newUserOffset);

        newScreenOffset[focusSeries] = newScreenOffsetFS;
        newUserOffset[focusSeries] = newUserOffsetFS;

        this.setState({ screenOffset: newScreenOffset, userOffset: newUserOffset });
      }
    };

    const zeroOffset = screenOffset.map((so) => (Array(so.length).fill(0)));
    return (
      <Stage width={width} height={height}
        onMouseMove={offsetUpdateFunc}
        onMouseDown={offsetUpdateFunc}>
        <Layer>
          {
            showOriginal && (
              screenY.reduce((prev, screenYi, i) => {
                prev.push(renderLines(screenX[i], screenYi, zeroOffset[i], 'gray', 'original' + i));
                prev.push(renderPoints(screenX[i], screenYi, zeroOffset[i], 'original' + i));
                return prev;
              }, [])
            )
          }
          {
            screenY.reduce((prev, screenYi, i) => {
              prev.push(renderLines(screenX[i], screenYi, screenOffset[i], 'red', 'new' + i));
              prev.push(renderPoints(screenX[i], screenYi, screenOffset[i], 'new' + i));
              return prev;
            }, [])
          }
        </Layer>
      </Stage>
    )
  }
}

DynamicTimeWarpingDrawer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  series: PropTypes.array.isRequired,
  rangeY: PropTypes.array,
  pointRadius: PropTypes.number,
  onOffsetChange: PropTypes.func,
  showOriginal: PropTypes.bool,
  focusSeries: PropTypes.number,
}