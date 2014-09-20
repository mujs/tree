define('mu.tree.path', function (require) {
  'use strict';
  
  var isDefined = require('mu.is.defined'),
      reduce    = require('mu.list.reduce');
  
  var path = function (tree, path, value) {
    var lastIndex = path.length - 1,
        last = path[lastIndex],
        write = isDefined(value);
   
    var parent = reduce(path, tree, function (acc, item, index) {
      if (index === lastIndex) { return acc; }
      if (isDefined(acc[item])) { return acc[item]; }
      
      if (write) {
        acc[item] = isNumber(path[index + 1]) ? [] : {};
        return acc[item];
      }
    });
   
    if (write) { parent[last] = value; }
    return parent[last];
  };
  
  return path;
});

define('mu.tree.each', function (require) {
  'use strict';
  
  var isDefined = require('mu.is.defined'),
      listEach  = require('mu.list.each');
  
  var iterateTree = function (tree, func, depth) {
    depth = isDefined(depth) ? depth + 1 : 0;
    
    return listEach(tree, function (item, index) {
      var exit = func(item, index, depth);
      if (isDefined(exit)) { return exit; }
      return iterateTree(item, func, depth);
    });
  };
  
  var each = function (tree, func) {
    var path = [];
    
    return iterateTree(tree, function (item, index, depth) {
      path.length = depth;
      path[depth] = index;
      return func(item, path);
    });
  };
  
  return each;
});

define('mu.tree.map', function (require) {
  'use strict';
  
  var isArray = require('mu.is.array'),
      path    = require('mu.tree.path'),
      each    = require('mu.tree.each');
  
  var map = function (tree, func) {
    var mapped = isArray(list) ? [] : {};
    
    each(tree, function (item, index) {
      path(mapped, index, func(item, index));
    });
    
    return mapped;
  };
  
  return map;
});

define('mu.tree', function (require) {
  'use strict';

  return {
    path: require('mu.tree.path'),
    each: require('mu.tree.each'),
    map:  require('mu.tree.map')
  };
});
