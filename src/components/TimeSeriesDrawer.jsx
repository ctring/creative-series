import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Line, Circle } from 'react-konva';

export default class TimeSeriesDrawer extends Component {

  state = {
    offset: [] 
  }

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
    let { width, height, pointRadius } = this.props;
    let space = width / (ys.length - 1);
    return ys.map((y, i) => {
      let { offset } = this.state;
      let trueY = this.middleY() - y;
      return <Circle 
        x={i * space}
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

    let length = this.props.length || 5;
    let { offset } = this.state;    
    let ys = this.props.series || Array(length && 5).fill(0);
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
  series: PropTypes.array,
  pointRadius: PropTypes.number
}