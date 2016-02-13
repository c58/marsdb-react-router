'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = getParamsForRoute;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _getRouteParams = require('react-router/lib/getRouteParams');

var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLocationParams(paramNames, paramSource) {
  if (!paramNames) {
    return null;
  }

  var paramsForRoute = {};
  paramNames.forEach(function (name) {
    var param = paramSource ? paramSource[name] : null;
    paramsForRoute[name] = param !== undefined ? param : null;
  });

  return paramsForRoute;
}

function getParamsForRoute(_ref) {
  var route = _ref.route;
  var routes = _ref.routes;
  var params = _ref.params;
  var location = _ref.location;

  var paramsForRoute = {};

  // Extract route params for current route and all ancestors.
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var ancestorRoute = _step.value;

      Object.assign(paramsForRoute, (0, _getRouteParams2.default)(ancestorRoute, params));
      if (ancestorRoute === route) {
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  Object.assign(paramsForRoute, getLocationParams(route.queryParams, location.query), getLocationParams(route.stateParams, location.state));

  var prepareParams = route.prepareParams;

  if (prepareParams) {
    (0, _invariant2.default)(typeof prepareParams === 'function', 'react-router-relay: Expected `prepareParams` to be a function.');
    paramsForRoute = prepareParams(paramsForRoute, route);
    (0, _invariant2.default)((typeof paramsForRoute === 'undefined' ? 'undefined' : _typeof(paramsForRoute)) === 'object' && paramsForRoute !== null, 'react-router-relay: Expected `prepareParams` to return an object.');
  }

  return paramsForRoute;
}