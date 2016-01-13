'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _getParamsForRoute = require('./getParamsForRoute');

var _getParamsForRoute2 = _interopRequireDefault(_getParamsForRoute);

var _marsdbReact = require('marsdb-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MarsRouter = (function (_React$Component) {
  _inherits(MarsRouter, _React$Component);

  function MarsRouter() {
    _classCallCheck(this, MarsRouter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MarsRouter).apply(this, arguments));
  }

  _createClass(MarsRouter, [{
    key: 'createElement',
    value: function createElement(Component, props) {
      var containerParams = (0, _getParamsForRoute2.default)(props);
      return _react2.default.createElement(_marsdbReact.DataManagerContainer, _extends({}, props, containerParams, {
        component: Component
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactRouter.Router, _extends({}, this.props, {
        createElement: this.createElement
      }));
    }
  }]);

  return MarsRouter;
})(_react2.default.Component);

MarsRouter.displayName = 'MarsRouter';
exports.default = MarsRouter;