import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Segment, Label, Message } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';

class CopiableTextOutput extends Component {

  state = {
    copiedContent: '',
    copied: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      copied: prevState.copiedContent === nextProps.content
    }
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
              this.setState({
                copiedContent: content,
                copied: true
              })
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