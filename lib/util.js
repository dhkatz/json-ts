"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTargetType = isTargetType;
exports.isPrimitiveOrPrimitiveClass = isPrimitiveOrPrimitiveClass;
exports.isArrayOrArrayClass = isArrayOrArrayClass;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isTargetType(val, type) {
  return _typeof(val) === type;
}

function isPrimitiveOrPrimitiveClass(obj) {
  return !!(['string', 'boolean', 'number'].indexOf(_typeof(obj)) > -1 || obj instanceof String || obj === String || obj instanceof Number || obj === Number || obj instanceof Boolean || obj === Boolean);
}

function isArrayOrArrayClass(clazz) {
  if (clazz === Array) {
    return true;
  }

  return Object.prototype.toString.call(clazz) === '[object Array]';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbImlzVGFyZ2V0VHlwZSIsInZhbCIsInR5cGUiLCJpc1ByaW1pdGl2ZU9yUHJpbWl0aXZlQ2xhc3MiLCJvYmoiLCJpbmRleE9mIiwiU3RyaW5nIiwiTnVtYmVyIiwiQm9vbGVhbiIsImlzQXJyYXlPckFycmF5Q2xhc3MiLCJjbGF6eiIsIkFycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFPLFNBQVNBLFlBQVQsQ0FBc0JDLEdBQXRCLEVBQWdDQyxJQUFoQyxFQUFnRTtBQUNyRSxTQUFPLFFBQU9ELEdBQVAsTUFBZUMsSUFBdEI7QUFDRDs7QUFFTSxTQUFTQywyQkFBVCxDQUFxQ0MsR0FBckMsRUFBd0Q7QUFDN0QsU0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixRQUF0QixFQUFnQ0MsT0FBaEMsU0FBZ0RELEdBQWhELEtBQXdELENBQUMsQ0FBekQsSUFBK0RBLEdBQUcsWUFBWUUsTUFBZixJQUF5QkYsR0FBRyxLQUFLRSxNQUFqQyxJQUN6RUYsR0FBRyxZQUFZRyxNQUQwRCxJQUNoREgsR0FBRyxLQUFLRyxNQUR3QyxJQUV6RUgsR0FBRyxZQUFZSSxPQUYwRCxJQUUvQ0osR0FBRyxLQUFLSSxPQUYxQixDQUFSO0FBR0Q7O0FBRU0sU0FBU0MsbUJBQVQsQ0FBNkJDLEtBQTdCLEVBQXVEO0FBQzVELE1BQUlBLEtBQUssS0FBS0MsS0FBZCxFQUFxQjtBQUNuQixXQUFPLElBQVA7QUFDRDs7QUFDRCxTQUFPQyxNQUFNLENBQUNDLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkwsS0FBL0IsTUFBMEMsZ0JBQWpEO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gaXNUYXJnZXRUeXBlKHZhbDogYW55LCB0eXBlOiBvYmplY3QgfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09IHR5cGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZU9yUHJpbWl0aXZlQ2xhc3Mob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuICEhKFsnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnbnVtYmVyJ10uaW5kZXhPZigodHlwZW9mIG9iaikpID4gLTEgfHwgKG9iaiBpbnN0YW5jZW9mIFN0cmluZyB8fCBvYmogPT09IFN0cmluZyB8fFxuICBvYmogaW5zdGFuY2VvZiBOdW1iZXIgfHwgb2JqID09PSBOdW1iZXIgfHxcbiAgb2JqIGluc3RhbmNlb2YgQm9vbGVhbiB8fCBvYmogPT09IEJvb2xlYW4pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlPckFycmF5Q2xhc3MoY2xheno6IEZ1bmN0aW9uKTogYm9vbGVhbiB7XG4gIGlmIChjbGF6eiA9PT0gQXJyYXkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGNsYXp6KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cbiJdfQ==