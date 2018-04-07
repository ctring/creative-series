import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

export default function CopiableTextOutput(props) {
  return (
    <Container fluid>
      <p>{props.content}</p>
    </Container>
  );
}

CopiableTextOutput.propTypes = {
  content: PropTypes.string.isRequired,
};