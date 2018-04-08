import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Segment, Label, Message } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';

class CopiableTextOutput extends Component {

  state = {
    copied: false,
  }

  render() {
    const { content, label } = this.props;
    const { copied } = this.state;
    return (
      <div>
        <Segment padded attached='top'>
          <Label attached='top left'>{label}</Label>
          <pre>{content}</pre>
          <Message positive hidden={!copied}>
            Copied to clipboard!
          </Message>
        </Segment>        
        <CopyToClipboard text={this.props.content}>
          <Button
            attached='bottom'
            icon='clipboard'
            content='Copy to clipboard'
            onClick={() => {
              this.setState({ copied: true })
            }} />
        </CopyToClipboard>
      </div>
    )
  };
}

CopiableTextOutput.propTypes = {
  content: PropTypes.string,
  label: PropTypes.string,
};

export default CopiableTextOutput;