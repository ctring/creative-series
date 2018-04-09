import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment } from 'semantic-ui-react';

const DTW_VARIATION_OPTIONS = [
  { key: 'euclidean', text: 'Euclidean', value: 'euclidean' },
  { key: 'manhattan', text: 'Manhattan', value: 'manhattan' },
  { key: 'minkowski', text: 'Minkowski', value: 'minkowski' },
];

export default function GraphControls(props) {
  const {
    lowY, highY, showOriginal, showDTWMatches,
    onChange, onChangeCheckbox,
    numberOfSeries, focusSeries,
    dtwBandSize, dtwReduceFunc,
  } = props;

  const seriesOptions = Array.from(
    { length: numberOfSeries },
    (x, i) => (
      { key: i, text: 'Series ' + (i + 1), value: i }
    ));

  return (
    <Form>
      {numberOfSeries > 1 &&
        <Form.Select fluid label='Focus series' name='focusSeries'
          options={seriesOptions} value={parseInt(focusSeries, 10)}
          onChange={onChange} />}
      <Form.Group widths='equal'>
        <Form.Input fluid type='number' name='highY'
          step={0.1}
          value={highY}
          onChange={onChange}
          label='High Y' />
        <Form.Input fluid type='number' name='lowY'
          step={0.1}
          value={lowY}
          onChange={onChange}
          label='Low Y' />
      </Form.Group>
      <Form.Checkbox toggle label='Show original' name='showOriginal'
        checked={showOriginal} onChange={onChangeCheckbox} />

      {numberOfSeries > 1 &&
        <Segment>
          <Form.Checkbox toggle label='Show DTW matches' name='showDTWMatches'
            checked={showDTWMatches} onChange={onChangeCheckbox} />
          <Form.Select fluid label='DTW variation' name='dtwReduceFunc'
            options={DTW_VARIATION_OPTIONS} onChange={onChange} value={dtwReduceFunc} />
          <Form.Input fluid type='number' label='Restricting band size' name='dtwBandSize'
            step={1} min={0} value={parseInt(dtwBandSize, 10)}
            onChange={onChange} />
        </Segment>}
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
  focusSeries: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),

  showOriginal: PropTypes.bool,
  showDTWMatches: PropTypes.bool,

  dtwBandSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  dtwReduceFunc: PropTypes.string,

  onChange: PropTypes.func,
  onChangeCheckbox: PropTypes.func,
};