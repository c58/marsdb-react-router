import React from 'react';
import { Router } from 'react-router';
import getParamsForRoute from './getParamsForRoute';
import { DataManagerContainer } from 'marsdb-react';



export default class MarsRouter extends React.Component {
  static displayName = 'MarsRouter';

  createElement(Component, props) {
    const containerParams = getParamsForRoute(props);
    return (
      <DataManagerContainer
        {...props}
        {...containerParams}
        component={Component}
      />
    );
  }

  render() {
    return (
      <Router
        {...this.props}
        createElement={this.createElement}
      />
    );
  }
}
