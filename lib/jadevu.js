
/**
 * Module exports
 */

module.exports = exports = Jadevu;

/**
 * Version.
 */

exports.version = '0.0.3';

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
  +     ', t = function(i, p){'
  +         'var r = _[i](p);'
  +         'return "undefined" != typeof jQuery ? jQuery(r) : r;'
  +       '}'
  +     ', _ = t._ = {};'
  +   't.noConflict = function(){'
  +     'w.template = p;'
  +     'return t;'
  +   '};'
  +   't.$e = ' + stringify(runtime.escape) + ';'
  +   't.$a = ' + stringify(runtime.attrs).replace(/escape/g, 't.$e') + ';'
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

  return new Jadevu(
      block
    , compiler
    , params || {}
    , compiler.__templates++ == 0
  ).compile();
};

/**
 * Compiler constructor.
 *
 * @api public
 */

function Jadevu (block, compiler, params, includeScript) {
  Compiler.call(this, block, compiler.options);

  if (this.node.nodes.length > 2) {
    throw new Error('Templates must be composed of a single parent element.');
  }

  this.compiler = compiler;
  this.includeScript = includeScript;
  this.id = params.id;

  if (!this.id) {
    throw new Error('The first element of the `template:` filter must be the `id` tag');
  }
}

/**
 * Inherit from Compiler
 */

Jadevu.prototype.__proto__ = Compiler.prototype;

/**
 * Captures the tag we use as identifier of the template (`id`)
 *
 * @api public
 */

Jadevu.prototype.visitTag = function (node) {
  if (!this.id) {
    if ('id' != node.name) {
      throw new Error('The first element of the `template:` filter must be the `id` tag');

    }

    this.id = node.text.nodes[0].trim();
  } else {
    var script = new Tag('script')
      , text = '';

    if (this.includeScript) {
      text += cs;
    }

    text += 'window.template._[' + this.id + '] = ' + compile(
        this.compiler.constructor
      , node
    ) + ';';

    script.code = new Code(JSON.stringify(text), true, false);

    Compiler.prototype.visitTag.call(this, script);
  }
}

/**
 * Compiles a function from Nodes.
 *
 * @param {Function} Compiler constructor
 * @param {Node}
 * @return Function
 * @api private
 */

function compile (compiler, ast) {
  return ''
    + 'function (locals) {'
    +   'var buf = [], __ = {}, t = window.template, attrs = t.$a, escape = t.$e;'
    +   'with (locals || {}) {' + new Compiler(ast).compile() + '};'
    +   'return buf.join("");'
    + '}';
}
