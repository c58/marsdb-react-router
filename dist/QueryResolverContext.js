'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RouterContext = require('react-router/lib/RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _getParamsForRoute = require('./getParamsForRoute');

var _getParamsForRoute2 = _interopRequireDefault(_getParamsForRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QueryTrackerComponent = function (_React$Component) {
  _inherits(QueryTrackerComponent, _React$Component);

  function QueryTrackerComponent() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, QueryTrackerComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(QueryTrackerComponent)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this._handleDataUpdate = function () {
      _this.forceUpdate();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(QueryTrackerComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.query.on('update', this._handleDataUpdate);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.query.removeListener('update', this._handleDataUpdate);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var providedProps = _props.providedProps;
      var Component = _props.Component;

      return _react2.default.createElement(Component, providedProps);
    }
  }]);

  return QueryTrackerComponent;
}(_react2.default.Component);

var QueryResolverContext = function (_React$Component2) {
  _inherits(QueryResolverContext, _React$Component2);

  function QueryResolverContext(props, context) {
    _classCallCheck(this, QueryResolverContext);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(QueryResolverContext).call(this, props, context));

    _initialiseProps.call(_this2);

    _this2.state = { result: {}, usedProps: {} };
    _this2._queryMap = new Map();
    _this2._ensureQueries(props);
    return _this2;
  }

  _createClass(QueryResolverContext, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this._ensureQueries(nextProps);
    }
  }, {
    key: '_ensureQueries',
    value: function _ensureQueries(props) {
      var _this3 = this;

      this._ready = false;
      var unusedComponentsSet = new Set(this._queryMap.keys());
      var routes = props.routes;
      var components = props.components;

      // Execute new queries or update existing

      var executePromises = components.map(function (c, i) {
        if (c && c.getQuery) {
          var route = routes[i];
          var params = (0, _getParamsForRoute2.default)(_extends({ route: route }, props));

          if (!_this3._queryMap.has(c)) {
            var query = c.getQuery(params);
            _this3._queryMap.set(c, query);
            return query.execute();
          } else {
            var _ret2 = function () {
              unusedComponentsSet.delete(c);
              var query = _this3._queryMap.get(c);
              return {
                v: query.updateVariables(params).then(function () {
                  return query.execute();
                })
              };
            }();

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
          }
        }
      });

      // Stop and remove not used queries
      unusedComponentsSet.forEach(function (c) {
        _this3._queryMap.get(c).stop();
        _this3._queryMap.delete(c);
      });

      // Set result when ready
      Promise.all(executePromises).then(function (result) {
        _this3._firstReady = true;
        _this3._ready = true;

        var resultMap = new Map();
        result.forEach(function (x, i) {
          resultMap.set(components[i], x);
        });

        _this3.setState({
          result: resultMap,
          usedProps: props
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this._firstReady) {
        return this.props.loadingPlaceholder;
      } else {
        var InnerContext = this.props.InnerContext;

        return _react2.default.createElement(
          StaticContainer,
          { shouldUpdate: this._ready },
          _react2.default.createElement(InnerContext, _extends({}, this.state.usedProps, {
            createElement: this._createElement
          }))
        );
      }
    }
  }]);

  return QueryResolverContext;
}(_react2.default.Component);

QueryResolverContext.defaultProps = {
  loadingPlaceholder: _react2.default.createElement('div', null),
  InnerContext: _RouterContext2.default
};

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this._createElement = function (Component, props) {
    var query = _this4._queryMap.get(Component);

    if (!query) {
      return _react2.default.createElement(Component, props);
    } else {
      var containerParams = (0, _getParamsForRoute2.default)(props);
      var data = _this4.state.result.get(Component) || {};
      return _react2.default.createElement(QueryTrackerComponent, {
        query: query,
        providedProps: _extends({}, props, containerParams, data),
        Component: Component
      });
    }
  };
};

exports.default = QueryResolverContext;