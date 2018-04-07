import React, { Component } from 'react';
import { Grid, Form, Message, Input } from 'semantic-ui-react';

import TimeSeriesDrawer from '../components/TimeSeriesDrawer';
import CopiableTextOutput from '../components/CopiableTextOutput';

class SingleSeriesContainer extends Component {
  state = {
    currentSeries: Array(10).fill(0),
    errorMessage: '',
    drawerKey: 0,
    inputSeriesStr: '',
    lowY: -1,
    highY: 1,
  }

  onChange = (e, { name, value }) => { this.setState({ [name]: value }); }

  onSeriesSubmit = () => {
    const { inputSeriesStr, drawerKey } = this.state;
    let inputSeries = inputSeriesStr.split(',').map((x) => (parseFloat(x, 10)));
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
      });
    }
  }

  renderInputForm = () => {
    const { errorMessage, lowY, highY } = this.state;
    return (
      <Form error={errorMessage !== ''} onSubmit={this.onSeriesSubmit}>
        <Message error header='Invalid series' content={errorMessage} />      
        <Form.Group widths='equal' label='Range of y-axis'>
          <Form.Field 
            type='number'
            control={Input}
            name='lowY'
            step={0.1}
            value={lowY}
            onChange={this.onChange}
            label='Low Y'/>
          <Form.Field
            type='number' 
            control={Input}
            name='highY'
            step={0.1}
            value={highY}
            onChange={this.onChange}
            label='High Y'/>
        </Form.Group>
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
    const { currentSeries, drawerKey, lowY, highY } = this.state;

    return (
      <Grid celled>
        <Grid.Row centered>
          <TimeSeriesDrawer
            key={drawerKey}
            width={1200}
            height={400}
            series={currentSeries}
            rangeY={[lowY, highY]}/>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            {this.renderInputForm()}
          </Grid.Column>
          <Grid.Column>
            <CopiableTextOutput content={currentSeries.join(', ')} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SingleSeriesContainer;

