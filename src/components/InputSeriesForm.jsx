
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';

export default function InputSeriesForm (props) {
  const {
    onSeriesSubmit,
    onChange,
    errorMessage,
    separator,
  } = props;

  return (
    <Form error={errorMessage !== ''} onSubmit={onSeriesSubmit}>
      <Message error header='Invalid values' content={errorMessage} />
      <Form.Input 
        label='Separator'
        name='separator'
        placeholder='Use regular expression. Default is comma ( , ).'
        value={separator}
        onChange={onChange}/>
      <Form.TextArea
          label={'Input series'}
          name={'inputSeriesStr'}
          placeholder='Enter a series of number separated by the above separator. One series per line.'
          autoHeight
          onChange={onChange}/>
      <Form.Button content='Set series' />
    </Form>
  );
}

InputSeriesForm.propTypes = {
  onChange: PropTypes.func,
  onSeriesSubmit: PropTypes.func,
  errorMessage: PropTypes.string,
  separator: PropTypes.string,
};
