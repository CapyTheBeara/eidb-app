var __ = {};

__.DOMStringListToArray = function(list, objFun) {
  var arr = [];
  for (var i = 0; i < list.length; i++) {arr[i] = objFun(i, list);}
  return arr;
};

export default __;
