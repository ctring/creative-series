import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';

export default function GraphControls(props) {
  const {
    lowY, highY, showOriginal, showDTWMatches,
    onChange, onChangeCheckbox,
    numberOfSeries, focusSeries,
  } = props;

  const seriesOptions = Array.from(
    {length: numberOfSeries}, 
    (x, i) => (
      { key: i, text: 'Series ' + (i + 1), value: i }
    ));

  return (
    <Form>
      <Form.Field fluid type='number' control={Input} name='highY'
        step={0.1}
        value={highY}
        onChange={onChange}
        label='High Y' />
      <Form.Field fluid type='number' control={Input} name='lowY'
        step={0.1}
        value={lowY}
        onChange={onChange}
        label='Low Y' />
      <Form.Checkbox label='Show original' name='showOriginal'
        checked={showOriginal} onChange={onChangeCheckbox} />
      {numberOfSeries > 1 &&
        <Form.Checkbox label='Show DTW matches' name='showDTWMatches'
        checked={showDTWMatches} onChange={onChangeCheckbox} />}
      {numberOfSeries > 1 &&
        <Form.Select fluid label='Focus series' name='focusSeries'
          options={seriesOptions} value={parseInt(focusSeries, 10)} 
          onChange={onChange} />}
    </Form>
  )
}

GraphControls.propTypes = {
  lowY: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  highY: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  numberOfSeries: PropTypes.number,
  focusSeries: PropTypes.number,  
  showOriginal: PropTypes.bool,
  showDTWMatches: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeCheckbox: PropTypes.func,
};