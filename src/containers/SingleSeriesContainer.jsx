import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TimeSeriesDrawer from '../components/TimeSeriesDrawer';
import { setInputSeries } from '../actions/single';

class SingleSeriesContainer extends Component {
  render() {
    return (     
      <Grid>
        <Grid.Row>
          <TimeSeriesDrawer width={1000} height={400} length={50}/>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <div>
              <textarea cols={72} rows={6} style={{resize: 'none'}}
                placeholder='Enter a series of number, separated by commas'/>
            </div>
            <Button>Set Time Series</Button>
          </Grid.Column>
          <Grid.Column>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

SingleSeriesContainer.propTypes = {
  inputSeries: PropTypes.array,
};

const mapStateToProps = state => ({
  inputSeries: state.single.inputSeries,
});

const mapDispatchToProps = dispatch => ({
  setInputSeries
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleSeriesContainer);

