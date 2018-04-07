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

  // Series in user coordinate system
  userSeries() {
    const { series, length } = this.props;
    return series.length ? series : Array(length || 10).fill(0);
  }

  // Y scale from user
  userScaleY() {
    return this.props.scaleY || [-1, 1];
  }

  // Series in screen coordinate system
  screenSeries() {
    let userSeries = this.userSeries();
    let userScaleY = this.userScaleY();
    return userSeries.map((y, i) => (
      scale(y, userScaleY[0], userScaleY[1], this.props.height, 0)
    ));
  }

  space() {
    let userSeries = this.userSeries();
    return (this.props.width - 2 * this.padding) / (userSeries.length - 1);
  }

  // X-coordinate in screen coordinate system
  screenX() {
    let userSeries = this.userSeries();
    let space = this.space();
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
    const { width, height } = this.props;
    const { screenOffset, userOffset } = this.state;

    let space = this.space();
    let screenSeries = this.screenSeries();
    let userScaleY = this.userScaleY();

    // Function for updating the offsets of the points
    let offsetUpdateFunc = (e) => {
      if (e.evt && e.evt.buttons === 1) {
        let index = Math.floor((e.evt.layerX - this.padding) / space);

        let newScreenOffset = screenOffset.slice();
        let newUserOffset = userOffset.slice();

        newScreenOffset[index] = e.evt.layerY - screenSeries[index];
        newUserOffset[index] = scale(newScreenOffset[index], 0, width, userScaleY[1], userScaleY[0]);

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
  length: PropTypes.number,
  series: PropTypes.array,
  scaleY: PropTypes.array,
  pointRadius: PropTypes.number
}