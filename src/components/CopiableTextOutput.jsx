import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Segment, Message } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';

class CopiableTextOutput extends Component {

  state = {
    copied: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { copied: false };
  }

  render() {
    const { copied } = this.state;
    return (
      <Container fluid>
        <Segment attached='top'>
          {this.props.content}
        </Segment>

        <CopyToClipboard text={this.props.content}>
          <Button
            attached='bottom'
            icon='clipboard'
            content='Copy to clipboard'
            onClick={() => { this.setState({ copied: true }) }} />
        </CopyToClipboard>

        <Message positive hidden={!copied}>
          Copied to clipboard!
        </Message>
      </Container >
    )
  };
}

CopiableTextOutput.propTypes = {
  content: PropTypes.string.isRequired,
};

export default CopiableTextOutput;