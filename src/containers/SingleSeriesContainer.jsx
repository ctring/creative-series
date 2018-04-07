import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Message, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TimeSeriesDrawer from '../components/TimeSeriesDrawer';
import CopiableTextOutput from '../components/CopiableTextOutput';
import { setCurrentSeries } from '../actions/single';

class SingleSeriesContainer extends Component {
  state = {
    inputSeriesStr: '',
    errorMessage: '',
    drawerKey: 0,
    lowY: -1,
    highY: 1,
  }

  onChange = (e, { name, value }) => { this.setState({ [name]: value }); }

  onSeriesSubmit = () => {
    const { inputSeriesStr, drawerKey } = this.state;
    let inputSeries = inputSeriesStr.split(',').map((x) => (parseFloat(x, 10)));
    if (inputSeries.findIndex(isNaN) !== -1) {
      this.setState({ errorMessage: 'Series must only contain numeric values' });
    }
    else {
      this.props.setCurrentSeries(inputSeries);
      this.setState({ errorMessage: '', drawerKey: drawerKey + 1 });
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
    const { currentSeries } = this.props;
    const { drawerKey, lowY, highY } = this.state;
    console.log(currentSeries.join(', '));
    return (
      <Grid celled>
        <Grid.Row centered>
          <TimeSeriesDrawer
            key={drawerKey}
            width={1200}
            height={400}
            series={currentSeries}
            scaleY={[lowY, highY]}/>
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

SingleSeriesContainer.propTypes = {
  currentSeries: PropTypes.array.isRequired,
  setCurrentSeries: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentSeries: state.single.currentSeries,
});

const mapDispatchToProps = dispatch => ({
  setCurrentSeries(inputSeries) {
    dispatch(setCurrentSeries(inputSeries));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleSeriesContainer);

