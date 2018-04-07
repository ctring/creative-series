import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Line, Circle } from 'react-konva';

export default class TimeSeriesDrawer extends Component {

  state = {
    offset: [] 
  }

  padding = 10

  middleY() {
    return this.props.height / 2;
  }

  length() {
    return this.props.length || 5;
  }

  ys() {
    return this.props.series || Array(this.length()).fill(0);
  }

  space() {
    let { width } = this.props; 
    return (width - 2 * this.padding) / (this.length() - 1);
  }

  renderLines() {
    let { offset } = this.state;
    var points = [];
    let space = this.space();
    this.ys().forEach((y, i) => {
      points.push(this.padding + i * space);
      points.push(this.middleY() - y + (offset[i] || 0));
    });
    return <Line points={points} stroke='red' />
  }

  renderPoints() {
    let { pointRadius } = this.props;
    let space = this.space();
    return this.ys().map((y, i) => {
      let { offset } = this.state;
      let trueY = this.middleY() - y;
      return <Circle 
        x={this.padding + i * space}
        y={trueY + (offset[i] || 0)}
        radius={pointRadius || 5}
        fill='black'
        key={i}
      />
    })
  }

  render() {
    let { width, height } = this.props;
    let { offset } = this.state;

    let space = this.space();
    let middleY = this.middleY();
    let ys = this.ys();

    let offsetUpdateFunc = (e) => {
      if (e.evt && e.evt.buttons === 1) {
        let index = Math.floor((e.evt.layerX - this.padding)/space);
        var newOffset = offset.slice();
        let newY = e.evt.layerY;
        let trueY = middleY - ys[index];
        newOffset[index] = newY - trueY;
        this.setState({ 'offset': newOffset});
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
  pointRadius: PropTypes.number
}