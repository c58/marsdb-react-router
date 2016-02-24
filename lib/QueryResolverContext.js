import React from 'react';
import getRouteParams from 'react-router/lib/getRouteParams';
import getParamsForRoute from './getParamsForRoute';
import StaticContainer from 'react-static-container';


export default class QueryResolverContext extends React.Component {
  static defaultProps = {
    loadingPlaceholder: <div />,
    InnerContext: RouterContext,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { result: {}, usedProps: {} };
    this._queryMap = new Map();
    this._ensureQueries(props);
  }

  componentWillReceiveProps(nextProps) {
    this._ensureQueries(nextProps);
  }

  _ensureQueries(props) {
    this._ready = false;
    const unusedComponentsSet = new Set(this._queryMap.keys());
    const { routes, components } = props;

    // Execute new queries or update existing
    const executePromises = components.map((c, i) => {
      if (c && c.getQuery) {
        const route = routes[i];
        const params = getParamsForRoute({ route, ...props});

        if (!this._queryMap.has(c)) {
          const query = c.getQuery(params);
          this._queryMap.set(c, query);
          query.on('update', this._handleDataUpdate);
          return query.execute();
        } else {
          unusedComponentsSet.delete(c);
          const query = this._queryMap.get(c);
          return query.updateVariables(params).then(() => {
            return query.execute();
          });
        }
      }
    });

    // Stop and remove not used queries
    unusedComponentsSet.forEach(c => {
      this._queryMap.get(c).stop();
      this._queryMap.delete(c);
    });

    // Set result when ready
    Promise.all(executePromises).then((result) => {
      this._firstReady = true;
      this._ready = true;

      const resultMap = new Map();
      result.forEach((x, i) => {
        resultMap.set(components[i], x);
      });

      this.setState({
        result: resultMap,
        usedProps: props,
      });
    });
  }

  _createElement = (Component, props) => {
    const containerParams = getParamsForRoute(props);
    const data = this.state.result.get(Component) || {};
    return <Component {...props} {...containerParams} {...data} />;
  };

  _handleDataUpdate = () => {
    if (this._ready) {
      this.forceUpdate();
    }
  };

  render() {
    if (!this._firstReady) {
      return this.props.loadingPlaceholder;
    } else {
      const { InnerContext } = this.props;
      return (
        <StaticContainer shouldUpdate={this._ready}>
          <InnerContext
            {...this.state.usedProps}
            createElement={this._createElement}
          />
        </StaticContainer>
      );
    }
  }
}
