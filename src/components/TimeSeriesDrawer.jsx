import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Line, Circle } from 'react-konva';

export default class TimeSeriesDrawer extends Component {

  render() {
    let middleY = this.props.height / 2;
    let { width, height } = this.props;

    return (
      <Stage width={width} height={height}>
        <Layer>
          <Line points={[0, middleY, width, middleY]} stroke='red' />
        </Layer>
      </Stage>
    )
  }
}


TimeSeriesDrawer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  points: PropTypes.object
}