import React, { Component } from 'react';
import { Grid, Form, Message, Divider } from 'semantic-ui-react';
import ReactResizeDetector from 'react-resize-detector';

import DynamicTimeWarpingDrawer from './drawers/DynamicTimeWarpingDrawer';
import CopiableTextOutput from './components/CopiableTextOutput';
import GraphControls from './components/GraphControls';
import { convertToSeriesFromString } from './utils'

const initialSeries = Array(10).fill(0);

class DynamicTimeWarpingPane extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentSeries1: initialSeries,
      currentSeries2: initialSeries,
      offset1: [],
      offset2: [],
      drawerKey: 0,
      drawerWidth: 1000,
      drawerHeight: 400,

      inputSeriesStr1: '',
      inputSeriesStr2: '',
      errorMessage: '',

      lowY: -1,
      highY: 1,
      showOriginal: true,
    };

    this.drawerContainer = React.createRef();
  }

  onChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  onChangeCheckbox = (e, { name, checked }) => {
    this.setState({ [name]: checked });
  }

  onResize = () => {
    const newWidth = this.drawerContainer.current.offsetWidth;
    const newHeight = this.drawerContainer.current.offsetHeight;
    this.setState({
      drawerWidth: newWidth,
      drawerHeight: newHeight
    })
  }

  onSeriesSubmit = () => {
    const { inputSeriesStr1, inputSeriesStr2, drawerKey } = this.state;
    const inputSeries1 = inputSeriesStr1 ?
      convertToSeriesFromString(inputSeriesStr1, ',') :
      initialSeries;

    const inputSeries2 = inputSeriesStr2 ?
      convertToSeriesFromString(inputSeriesStr2, ',') :
      initialSeries;

    if (inputSeries1.findIndex(isNaN) !== -1) {
      this.setState({
        errorMessage: 'Series 1 must only contain numeric values'
      });
    }

    if (inputSeries2.findIndex(isNaN) !== -1) {
      this.setState({
        errorMessage: 'Series 2 must only contain numeric values'
      });
    }

    const min = Math.min(...inputSeries1, ...inputSeries2);
    const max = Math.max(...inputSeries1, ...inputSeries2);
    const padding = max === min ? 1 : (max - min) * 0.1;
    this.setState({
      currentSeries1: inputSeries1,
      currentSeries2: inputSeries2,
      errorMessage: '',
      drawerKey: drawerKey + 1,
      lowY: min - padding,
      highY: max + padding,
      offset1: [],
      offset2: [],
    });

  }

  onOffsetChange = (offset) => {
    this.setState({ offset });
  }

  renderInputForm = () => {
    const { errorMessage } = this.state;
    return (
      <Form error={errorMessage !== ''} onSubmit={this.onSeriesSubmit}>
        <Message error header='Invalid series' content={errorMessage} />
        <Form.TextArea
          label='Input series 1'
          name='inputSeriesStr1'
          placeholder='Enter a series of number separated by commas.'
          autoHeight
          onChange={this.onChange}
        />
        <Form.TextArea
          label='Input series 2'
          name='inputSeriesStr2'
          placeholder='Enter a series of number separated by commas.'
          autoHeight
          onChange={this.onChange}
        />
        <Form.Button content='Set series' />
      </Form>);
  }

  render() {
    const {
      drawerKey, drawerWidth, drawerHeight,
      currentSeries1, currentSeries2,
      offset1, offset2,
      lowY, highY, showOriginal
    } = this.state;

    const outputSeries1 = currentSeries1.map(
      (x, i) => ((x + (offset1[i] || 0)).toFixed(2))
    ).join(', ');

    const outputSeries2 = currentSeries2.map(
      (x, i) => ((x + (offset2[i] || 0)).toFixed(2))
    ).join(', ');

    return (
      <div>
        <Grid celled>
          <Grid.Row centered columns={2}>
            <Grid.Column width={2}>
              <GraphControls
                lowY={lowY}
                highY={highY}
                showOriginal={showOriginal}
                onChange={this.onChange}
                onChangeCheckbox={this.onChangeCheckbox} />
            </Grid.Column>
            <Grid.Column width={14} >
              <div style={{ width: '100%', height: '100%' }} ref={this.drawerContainer}>
                <DynamicTimeWarpingDrawer
                  key={drawerKey}
                  width={drawerWidth}
                  height={drawerHeight}
                  series={[currentSeries1, currentSeries2]}
                  rangeY={[lowY, highY]}
                  showOriginal={showOriginal}
                  onOffsetChange={this.onOffsetChange} />
              </div>
            </Grid.Column>

          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              {this.renderInputForm()}              
            </Grid.Column>
            <Grid.Column>
              <CopiableTextOutput content={outputSeries1} label='Modified series 1' />
              <Divider hidden />
              <CopiableTextOutput content={outputSeries2} label='Modified series 2' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ReactResizeDetector handleHeight handleWidth onResize={this.onResize} />
      </div>
    );
  }
}

export default DynamicTimeWarpingPane;

