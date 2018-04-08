import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

export default function GraphControls(props) {
  const { lowY, highY, onChange } = props;
  return(
    <div>
      <Input
        fluid
        type='number'
        name='lowY'
        step={0.1}
        value={lowY}
        onChange={onChange}
        label='Low Y' />
      <Input
        fluid        
        type='number'
        name='highY'
        step={0.1}
        value={highY}
        onChange={onChange}
        label='High Y' />
    </div>
  )
}

GraphControls.propTypes = {
  lowY: PropTypes.number,
  highY: PropTypes.number,
  onChange: PropTypes.func,
};