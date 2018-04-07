import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TimeSeriesDrawer from '../components/TimeSeriesDrawer';
import { setCurrentSeries } from '../actions/single';

class SingleSeriesContainer extends Component {
  state = {
    inputSeriesStr: '',
    errorMessage: '',
    drawerKey: 0
  }

  onSetSeriesClick = () => {
    const { inputSeriesStr, drawerKey } = this.state;
    let inputSeries = inputSeriesStr.split(',').map((x) => (parseFloat(x, 10)));
    if (inputSeries.findIndex(isNaN) !== -1) {
      this.setState({ errorMessage: 'Series contains a non-number value' });
    }
    else {
      this.props.setCurrentSeries(inputSeries);
      this.setState({ errorMessage: '', drawerKey: drawerKey + 1 });
    }
  }

  render() {
    const { currentSeries } = this.props;
    const { errorMessage, drawerKey } = this.state;
    return (
      <Grid>
        <Grid.Row>
          <TimeSeriesDrawer key={drawerKey} width={1000} height={400} series={currentSeries} />
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form error={errorMessage !== ''}>
              <Form.TextArea
                label='Input series'
                placeholder='Enter a series of number, separated by commas'
                onChange={(e, txtArea) => {
                  this.setState({ inputSeriesStr: txtArea.value });
                }}
              />
              <Message error header='Invalid series' content={errorMessage} />
              <Form.Button onClick={this.onSetSeriesClick}>
                Set Series
              </Form.Button>
            </Form>
          </Grid.Column>
          <Grid.Column>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

SingleSeriesContainer.propTypes = {
  currentSeries: PropTypes.array,
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

