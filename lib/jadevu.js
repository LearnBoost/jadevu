/**
 * Module exports
 */

/**
 * Version.
 */

exports.version = '0.0.9';

/**
 * Module dependencies.
 */

var jade = require('jade')
  , runtime = jade.runtime
  , Tag = jade.nodes.Tag
  , Code = jade.nodes.Code
  , Compiler = jade.Compiler

/**
 * Client side wrapper code (minified).
 */

var cs = ''
  + '(function () {'
  +   'var p = "undefined" != typeof template ? template : undefined'
  +     ', w = window'
  +     ', s = Object.prototype.toString'
  +     ', t = function(i, p){'
  +         'var r = _[i](p);'
  +         'return "undefined" != typeof jQuery ? jQuery(r) : r;'
  +       '}'
  +     ', exports = {t: t}'
  +     ', _ = t._ = {};'
  +   't.noConflict = function(){'
  +     'w.template = p;'
  +     'return t;'
  +   '};'
  +   'var $k = Object.keys || function(obj){'
  +     'var a = [];'
  +     'for(var i in obj)'
  +       'if (obj.hasOwnProperty(i)) a.push(i);'
  +     'return a;'
  +   '};'
  +   'var $a = Array.isArray || function(obj){'
  +     'return "[object Array]" == s.call(obj);'
  +   '};'
  +   't.$e = ' + stringify(runtime.escape) + ';'
  +   't.$a = ' 
        + stringify(runtime.attrs)
          .replace(/exports\.escape/g, 'exports.t.$e')
          .replace(/Object\.keys/g, '$k')
          .replace(/Array\.isArray/g, '$a')
        + ';'
  +   'if (!w.template) w.template = t;'
  + '})();';

/**
 * Stringifies a runtime jade function preserving minification
 *
 * @param {Function} fn
 * @api private
 */

function stringify (fn) {
  return fn.toString().replace(/\n/g, '');
}

/**
 * Add `template` filter.
 */

jade.filters.template = function (block, compiler, params) {
  if (!compiler.__templates) {
    compiler.__templates = 0;
  }

  if (!params || !params.id) {
    throw new Error('The first element of the `template:` filter must be the `id` tag');
  }

  var compiled = 'window.template._[' + params.id + '] = ' + compile(
      compiler.constructor
    , block
    , compiler.options
  ) + ';';

  if (compiler.__templates++ === 0)
    compiled = cs + compiled;

  return "buf.push('<script>');buf.push("
    + JSON.stringify(compiled)
    + ");buf.push('</script>')";
};

/**
 * Compiles a function from Nodes.
 *
 * @param {Function} Compiler constructor
 * @param {Node}
 * @return Function
 * @api private
 */

function compile (compiler, ast, opts) {
  opts = opts || {};
  opts.compileDebug = false;

  var compiled = new Compiler(ast, opts).compile();

  return ''
    + 'function (locals) {'
    +   'var buf = [], t = window.template, attrs = t.$a, escape = t.$e;'
    +   'with (locals || {}) {' + compiled + '};'
    +   'return buf.join("");'
    + '}';
}
