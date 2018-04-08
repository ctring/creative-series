import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';

export default function GraphControls(props) {
  const { lowY, highY, onChange } = props;
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
    </Form>
  )
}

GraphControls.propTypes = {
  lowY: PropTypes.number,
  highY: PropTypes.number,
  onChange: PropTypes.func,
};