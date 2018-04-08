
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';

export default function InputSeriesForm (props) {
  const {
    onSeriesSubmit,
    onChange,
    errorMessage,
    numberOfSeries,
  } = props;

  return (
    <Form error={errorMessage !== ''} onSubmit={onSeriesSubmit}>
      <Message error header='Invalid values' content={errorMessage} />
      {
        Array.from({length: numberOfSeries}, (v, i) => {
          const index = numberOfSeries === 1 ? '' : (i + 1).toString();
          return <Form.TextArea
            label={'Input series ' + index}
            name={'inputSeriesStr' + index}
            placeholder='Enter a series of number separated by commas.'
            autoHeight
            onChange={onChange}
            key={'input-' + i}/>
        })
      }
      <Form.Button content='Set series' />
    </Form>
  );
}

InputSeriesForm.propTypes = {
  numberOfSeries: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  onSeriesSubmit: PropTypes.func,
  errorMessage: PropTypes.string,
};
