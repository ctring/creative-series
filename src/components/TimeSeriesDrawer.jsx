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

  ys() {
    let length = this.props.length || 5;
    return this.props.series || Array(length && 5).fill(0);
  }

  space() {
    let { width } = this.props;    
    return width / (this.ys().length - 1) - 2 * this.padding;
  }

  renderLines() {
    let { offset } = this.state;
    var points = [];
    this.ys().forEach((y, i) => {
      points.push(this.padding + i * this.space());
      points.push(this.middleY() - y + (offset[i] || 0));
    });
    return <Line points={points} stroke='red' />
  }

  renderPoints() {
    let { height, pointRadius } = this.props;
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
        hitFunc={function hitFunc(context) {
          context.beginPath();
          context.rect(-space/2, -trueY, space, height);
          context.closePath();
          context.fillStrokeShape(this);
        }}
        onMouseMove={(e) => {
          if (e.evt && e.evt.buttons === 1) {
            var newOffset = offset.slice();
            let newY = e.evt.clientY;
            newOffset[i] = newY - trueY;
            this.setState({ 'offset': newOffset});
          }
        }}
      />
    })
  }

  render() {
    let { width, height } = this.props;   
    return (
      <Stage width={width} height={height}>
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