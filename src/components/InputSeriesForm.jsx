
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';

export default function InputSeriesForm (props) {
  const {
    onSeriesSubmit,
    onChange,
    errorMessage,
    numberOfSeries,
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
      {
        Array.from({length: numberOfSeries}, (v, i) => {
          const index = numberOfSeries === 1 ? '' : (i + 1).toString();
          return <Form.TextArea
            label={'Input series ' + index}
            name={'inputSeriesStr' + index}
            placeholder='Enter a series of number separated by the above separator.'
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
  separator: PropTypes.string,
};
