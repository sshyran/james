import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Request from './request.js';

const {object, array, func} = React.PropTypes;

class Requests extends Component {
  componentWillUpdate() {
    // remember scroll position for when list changes
    const node = findDOMNode(this);
    this.scrollHeight = node.scrollHeight;
    this.scrollTop = node.scrollTop;
  }

  componentDidUpdate() {
    // restore scroll position after list changes
    const node = findDOMNode(this);
    node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
  }

  render() {
    const {requestData, activeRequest, contextRequest, labels, handleClick, handleContextMenu} = this.props;

    const requestNodes = requestData.requests.map(({request, response}) => {
      const isActive = activeRequest && activeRequest.id === request.id || false;
      const isContextMenu = contextRequest && contextRequest.id === request.id || false;

      return <Request
        request={request}
        response={response}
        done={request.done}
        isActive={isActive}
        isContextMenu={isContextMenu}
        labels={labels}
        key={request.id}
        handleClick={handleClick}
        handleContextMenu={handleContextMenu}
      />;
    });

    return <div className="requests">
      {requestNodes}
    </div>;
  }
}

Requests.propTypes = {
  requestData: object.isRequired,
  activeRequest: object,
  contextRequest: object,
  labels: array.isRequired,
  handleClick: func.isRequired,
  handleContextMenu: func.isRequired
};

import { setActiveRequest, setContextRequest } from '../../actions/requests.js';
import { getRequestData, getActiveRequest, getContextRequest } from '../../reducers/requests.js';
import { getLabels } from '../../reducers/app.js';

const mapStateToProps = (state) => ({
  requestData: getRequestData(state),
  labels: getLabels(state),
  activeRequest: getActiveRequest(state),
  contextRequest: getContextRequest(state)
});

const mapDispatchToProps = (dispatch) => ({
  handleClick: ({request, response}) => {
    dispatch(setActiveRequest({request, response, id: request.id}));
    dispatch(setContextRequest(null));
  },
  handleContextMenu: ({request}) => {
    dispatch(setContextRequest(request));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
