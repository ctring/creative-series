import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Line, Circle } from 'react-konva';

export default class TimeSeriesDrawer extends Component {

  middleY() {
    return this.props.height / 2;
  }

  renderLines(ys) {
    let { width } = this.props;
    let space = width / (ys.length - 1);
    var points = [];
    ys.forEach((y, i) => {
      points.push(i * space);
      points.push(this.middleY() - y);
    });
    return <Line points={points} stroke='red' />
    
  }

  renderPoints(ys) {
    let { width, pointRadius } = this.props;
    let space = width / (ys.length - 1);

    return ys.map((y, i) => (
        <Circle 
          x={i * space}
          y={this.middleY() - y}
          radius={pointRadius || 5}
          fill='black'
          key={i}
        />
    ))
  }

  render() {
    let { width, height } = this.props;

    let length = this.props.length || 5;
    let ys = this.props.points || Array(length && 5).fill(0);

    return (
      <Stage width={width} height={height}>
        <Layer>
          {this.renderLines(ys)}
          {this.renderPoints(ys)}
        </Layer>
      </Stage>
    )
  }
}


TimeSeriesDrawer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  length: PropTypes.number,
  points: PropTypes.array,
  pointRadius: PropTypes.number
}