import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer } from 'react-konva';

import {
  scale,
  getRangeFromMultipleSeries,
  dynamicTimeWarpingMatches,
} from './algorithms';

import {
  computeScreenX,
  computeScreenY,
  computeSpace,
  renderLines,
  renderPoints,
  renderMatches,
  packScreenData,
  PADDING,
} from './drawing';

import { STYLES } from './styles';

export default class DynamicTimeWarpingDrawer extends Component {
  state = {
    userOffset: [],   // 2-D array
    screenOffset: [], // 2-D array
  };

  // Rescale screen offset when new rangeY comes in
  static getDerivedStateFromProps(nextProps, prevState) {
    const { height, series, rangeY } = nextProps;
    const computedRangeY = rangeY || getRangeFromMultipleSeries(...series);

    const newUserOffset = prevState.userOffset.length === 0 ?
      Array(series.length).fill([]) : prevState.userOffset;

    const newScreenOffset = newUserOffset.map((offsets) => (
      offsets.map((offset) => scale(offset,
        computedRangeY[0], computedRangeY[1], height, 0))
    ));

    return {
      screenOffset: newScreenOffset,
      userOffset: newUserOffset,
    }
  }

  // Function for updating the offsets of the points
  offsetUpdateFunc = (e) => {
    const {
      height, width,
      onOffsetChange,
      series,
      rangeY,
    } = this.props;
    const focusSeries = this.props.focusSeries || 0;

    const {
      screenOffset,
      userOffset,
    } = this.state;

    const space = series.map((s) => computeSpace(s, width));
    const computedRangeY = rangeY || getRangeFromMultipleSeries(...series);
    const screenY = series.map((s) => computeScreenY(s, rangeY, height));

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

  render() {
    const {
      width, height,
      series, // 2-D array
      rangeY,
      showOriginal,
      showDTWMatches,
      dtwReduceFunc, dtwBandSize,
      stageRef
    } = this.props;
    const focusSeries = this.props.focusSeries || 0;

    const {
      screenOffset,
      userOffset,
    } = this.state;

    const space = series.map((s) => computeSpace(s, width));
    const screenX = series.map((s, i) => computeScreenX(s, space[i]));
    const screenY = series.map((s) => computeScreenY(s, rangeY, height));
    const zeroOffset = screenOffset.map((so) => (Array(so.length).fill(0)));

    // Perform dynamic time warping rendering on series 0 and 1 only
    let MatchesJSX;
    if (showDTWMatches) {
      const matches = dynamicTimeWarpingMatches(
        series[0].map((s, i) => (s + (userOffset[0][i] || 0))),
        series[1].map((s, i) => (s + (userOffset[1][i] || 0))),
        dtwReduceFunc,
        dtwBandSize);
      const screenData0 = packScreenData(screenX[0], screenY[0], screenOffset[0]);
      const screenData1 = packScreenData(screenX[1], screenY[1], screenOffset[1]);
      MatchesJSX = renderMatches(screenData0, screenData1, matches, STYLES.matches);
    }

    return (
      <Stage width={width} height={height} ref={stageRef}
        onMouseMove={this.offsetUpdateFunc}
        onMouseDown={this.offsetUpdateFunc}
        style={{ cursor: 'crosshair' }}>
        {showOriginal &&
          <Layer>
            {
              screenY.reduce((prev, screenYi, i) => {
                prev.push(renderLines(screenX[i], screenYi, zeroOffset[i], 'original' + i, 
                  STYLES.lineOriginal));
                prev.push(renderPoints(screenX[i], screenYi, zeroOffset[i], 'original' + i,
                  STYLES.pointNormal));
                return prev;
              }, [])
            }
          </Layer>
        }
        <Layer>
          {MatchesJSX}
          {
            screenY.reduce((prev, screenYi, i) => {
              prev.push(renderLines(screenX[i], screenYi, screenOffset[i], 'new' + i,
                i === focusSeries ? STYLES.lineFocused : STYLES.lineNormal));
              prev.push(renderPoints(screenX[i], screenYi, screenOffset[i], 'new' + i,
                i === focusSeries ? STYLES.pointFocused : STYLES.pointNormal));
              return prev;
            }, [])
          }
        </Layer>
      </Stage>
    )
  }
}

DynamicTimeWarpingDrawer.propTypes = {
  // Basic properties
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  series: PropTypes.array.isRequired,
  rangeY: PropTypes.array,

  // Callback functions
  onOffsetChange: PropTypes.func,

  // Display options
  showOriginal: PropTypes.bool,
  focusSeries: PropTypes.number,
  stageRef: PropTypes.object,

  // DTW properties
  showDTWMatches: PropTypes.bool,
  dtwReduceFunc: PropTypes.string,
  dtwBandSize: PropTypes.number,
}