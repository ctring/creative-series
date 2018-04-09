import React, { Component } from 'react';
import { Grid, Divider } from 'semantic-ui-react';
import ReactResizeDetector from 'react-resize-detector';

import MultiSeriesDrawer from './drawers/MultiSeriesDrawer';
import InputSeriesForm from './components/InputSeriesForm';
import CopiableTextOutput from './components/CopiableTextOutput';
import GraphControls from './components/GraphControls';
import { convertToSeriesFromString, downloadURI } from './utils'

const initialSeries = Array(10).fill(0);

class DynamicTimeWarpingPane extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentSeries1: initialSeries,
      currentSeries2: initialSeries,
      offset1: [],
      offset2: [],
      focusSeries: 0,

      drawerKey: 0,
      drawerWidth: 1000,
      drawerHeight: 400,

      inputSeriesStr: '',
      separator: '',
      errorMessage: '',

      lowY: -1,
      highY: 1,
      showOriginal: true,

      showDTWMatches: false,
      dtwReduceFunc: 'euclidean',
      dtwBandSize: initialSeries.length,
    };

    this.drawerContainer = React.createRef();
    this.stageRef = React.createRef();
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
    const { inputSeriesStr, drawerKey, separator } = this.state;
    const inputSeriesArr = inputSeriesStr.trim().split(/\n+/);
    const reSep = new RegExp(separator || ',');
    const inputSeries1 = inputSeriesArr[0] ?
      convertToSeriesFromString(inputSeriesArr[0], reSep) :
      initialSeries;
    const inputSeries2 = inputSeriesArr[1] ?
      convertToSeriesFromString(inputSeriesArr[1], reSep) :
      initialSeries;

    if (inputSeries1.findIndex(isNaN) !== -1) {
      this.setState({
        errorMessage: 'Series 1 must only contain numeric values'
      });
      return;
    }

    if (inputSeries2.findIndex(isNaN) !== -1) {
      this.setState({
        errorMessage: 'Series 2 must only contain numeric values'
      });
      return;
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
      dtwBandSize: Math.max(inputSeries1.length, inputSeries2.length),
    });

  }

  onOffsetChange = (offset) => {
    this.setState({ offset1: offset[0], offset2: offset[1] });
  }

  onSaveClicked = () => {
    const stage = this.stageRef.current.getStage();
    downloadURI(stage.toDataURL(), 'graph.png');
  }

  render() {
    const {
      drawerKey, drawerWidth, drawerHeight,
      currentSeries1, currentSeries2, focusSeries,
      offset1, offset2,
      lowY, highY, showOriginal, showDTWMatches,
      dtwBandSize, dtwReduceFunc,
      errorMessage, separator,
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
            <Grid.Column width={3} style={{height: '428px', overflow: 'auto'}}>
              <GraphControls
                lowY={lowY}
                highY={highY}
                showOriginal={showOriginal}
                showDTWMatches={showDTWMatches}
                onChange={this.onChange}
                onChangeCheckbox={this.onChangeCheckbox}
                onSaveClicked={this.onSaveClicked}
                focusSeries={focusSeries}
                dtwBandSize={dtwBandSize}
                numberOfSeries={2}
                dtwReduceFunc={dtwReduceFunc} />
            </Grid.Column>
            <Grid.Column width={13} >
              <div style={{ width: '100%', height: '100%' }} ref={this.drawerContainer}>
                <MultiSeriesDrawer
                  key={drawerKey}
                  width={drawerWidth}
                  height={drawerHeight}
                  stageRef={this.stageRef}
                  series={[currentSeries1, currentSeries2]}
                  rangeY={[lowY, highY]}
                  showOriginal={showOriginal}
                  showDTWMatches={showDTWMatches}
                  onOffsetChange={this.onOffsetChange}
                  dtwBandSize={parseInt(dtwBandSize, 10)}
                  dtwReduceFunc={dtwReduceFunc}
                  focusSeries={focusSeries} />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <InputSeriesForm
                errorMessage={errorMessage}
                onChange={this.onChange}
                onSeriesSubmit={this.onSeriesSubmit}
                separator={separator}
              />
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

