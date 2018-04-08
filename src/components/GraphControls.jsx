import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';

export default function GraphControls(props) {
  const {
    lowY, highY, showOriginal,
    onChange, onChangeCheckbox
  } = props;
  return (
    <Form>
      <Form.Field
        fluid
        type='number'
        control={Input}
        name='highY'
        step={0.1}
        value={highY}
        onChange={onChange}
        label='High Y' />
      <Form.Field
        fluid
        type='number'
        control={Input}
        name='lowY'
        step={0.1}
        value={lowY}
        onChange={onChange}
        label='Low Y' />
      <Form.Checkbox
        label='Show original'
        name='showOriginal'
        checked={showOriginal}
        onChange={onChangeCheckbox} />
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
  showOriginal: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeCheckbox: PropTypes.func,
};