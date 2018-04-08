import React, { Component } from 'react';
import { Grid, Form, Message } from 'semantic-ui-react';
import ReactResizeDetector from 'react-resize-detector';

import SeriesDrawer from './drawers/DynamicTimeWarpingDrawer';
import CopiableTextOutput from './components/CopiableTextOutput';
import GraphControls from './components/GraphControls';

const initialSeries = Array(10).fill(0);

class SingleSeriesPane extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentSeries: initialSeries,
      offset: [],
      drawerKey: 0,
      drawerWidth: 1000,
      drawerHeight: 400,

      inputSeriesStr: '',
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
    const { inputSeriesStr, drawerKey } = this.state;
    let inputSeries = inputSeriesStr ?
      inputSeriesStr.split(',').map((x) => (parseFloat(x, 10))) :
      initialSeries;
    if (inputSeries.findIndex(isNaN) !== -1) {
      this.setState({
        errorMessage: 'Series must only contain numeric values'
      });
    }
    else {
      const min = Math.min(...inputSeries);
      const max = Math.max(...inputSeries);
      const padding = max === min ? 1 : (max - min) * 0.1;
      this.setState({
        currentSeries: inputSeries,
        errorMessage: '',
        drawerKey: drawerKey + 1,
        lowY: min - padding,
        highY: max + padding,
        offset: [],
      });
    }
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
          label='Input series'
          name='inputSeriesStr'
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
      currentSeries, offset,
      lowY, highY, showOriginal
    } = this.state;

    const outputSeries = currentSeries.map(
      (x, i) => ((x + (offset[i] || 0)).toFixed(2))
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
                <SeriesDrawer
                  key={drawerKey}
                  width={drawerWidth}
                  height={drawerHeight}
                  series={currentSeries}
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
              <CopiableTextOutput content={outputSeries} label='Modified series' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ReactResizeDetector handleHeight handleWidth onResize={this.onResize} />
      </div>
    );
  }
}

export default SingleSeriesPane;

