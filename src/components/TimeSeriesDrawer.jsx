import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Line, Circle } from 'react-konva';

function scale(x, fromLow, fromHigh, toLow, toHigh) {
  let factor = (toHigh - toLow) / (fromHigh - fromLow);
  return factor * (x - fromLow) + toLow;
}

export default class TimeSeriesDrawer extends Component {

  state = {
    userOffset: [],
    screenOffset: [],
  };

  padding = 10;

  // Y scale from user
  userRangeY() {
    if (this.props.rangeY) {
      return this.props.rangeY;
    }
    const userSeries = this.props.series;
    const min = Math.min(...userSeries);
    const max = Math.max(...userSeries);
    const padding = max === min ? 1 : (max - min) * 0.1;
    return [min - padding, max + padding];
  }

  // Series in screen coordinate system
  screenSeries() {
    const userSeries = this.props.series;
    const userRangeY = this.userRangeY();
    return userSeries.map((y, i) => (
      scale(y, userRangeY[0], userRangeY[1], this.props.height, 0)
    ));
  }

  space() {
    const userSeries = this.props.series;
    return (this.props.width - 2 * this.padding) / (userSeries.length - 1);
  }

  // X-coordinate in screen coordinate system
  screenX() {
    const userSeries = this.props.series;
    const space = this.space();
    return userSeries.map((_, i) => (
      this.padding + i * space
    ));
  }

  renderLines() {
    const { screenOffset } = this.state;
    let screenSeries = this.screenSeries();
    let screenX = this.screenX();
    let points = [];
    screenSeries.forEach((y, i) => {
      points.push(screenX[i] + this.padding);
      points.push(y + (screenOffset[i] || 0));
    });
    return <Line points={points} stroke='red' />
  }

  renderPoints() {
    const { pointRadius } = this.props;
    const { screenOffset } = this.state;
    let screenSeries = this.screenSeries();
    let screenX = this.screenX();
    return screenSeries.map((y, i) => (
      <Circle
        x={screenX[i] + this.padding}
        y={y + (screenOffset[i] || 0)}
        radius={pointRadius || 2}
        fill='black'
        key={'ts-' + i}
      />
    ))
  }

  render() {
    const { width, height, onOffsetChange } = this.props;
    const { screenOffset, userOffset } = this.state;

    let space = this.space();
    let screenSeries = this.screenSeries();
    let userRangeY = this.userRangeY();

    // Function for updating the offsets of the points
    let offsetUpdateFunc = (e) => {
      if (e.evt && e.evt.buttons === 1) {
        let index = Math.floor((e.evt.layerX - this.padding) / space);

        let newScreenOffset = screenOffset.slice();
        let newUserOffset = userOffset.slice();

        newScreenOffset[index] = e.evt.layerY - screenSeries[index];
        newUserOffset[index] = scale(newScreenOffset[index], 0, width, userRangeY[1], userRangeY[0]);

        onOffsetChange && onOffsetChange(newUserOffset);

        this.setState({ screenOffset: newScreenOffset, userOffset: newUserOffset });
      }
    };

    return (
      <Stage width={width} height={height}
        onMouseMove={offsetUpdateFunc}
        onMouseDown={offsetUpdateFunc}>
        <Layer>
          {this.renderLines()}
          {this.renderPoints()}
        </Layer>
      </Stage>
    )
  }
}

TimeSeriesDrawer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  series: PropTypes.array.isRequired,
  rangeY: PropTypes.array,
  pointRadius: PropTypes.number,
  onOffsetChange: PropTypes.func,
}