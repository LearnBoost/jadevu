
JadeVu
======

Jadevu allows to expose pre-compile Jade templates to the client side through an
extremely simple and easy-to-use API.

## Example

In your jade template, use the `template:` filter and set the `id` property:

    p Hello world

    template(id="my-template"):
      div
        p This is my template
        - if (a == 2)
          p It can have code
        - else
          p It can have many things

When compiled, this turns into HTML that looks like this:

```html
<p>Hello world</p>

<script>
  if ('undefined' == typeof template) template = function (id, params) { … }
  template._['my-template'] = function () { /* precompiled template */ };
</script>
```

What does this mean? From your client-side (eg: jQuery) code, you can include that
mini-template, and turn it into HTML:

```html
<script>
  // hint: if jQuery is loaded, `template` will return a jQuery object
  template('my-template', { a: 2 }).appendTo('body');
</script>
```

## How to use

Simply add `require('jadevu')` to your app.

## How it compares to alternatives

### Running jade in the browser

JavaScript code is run in a single thread of execution in the browser. The
unnecessary overhead of running a lexer and parser in the client translates
into less time for the browser to do other things. Large templates can result
in perceived periods of blocking-ness with heavy interaction in large web
applications.

In addition, including jade among your browser scripts adds unnecessary weight
to your pages.

### Ajax

Some projects want to do everything (including compilation) in the server-side.
This of course comes with a huge latency penalty for templates that appear
multiple times in the same page or are rendered as the result of real-time push
(such as [http://socket.io](socket.io))

### Building HTML manually with jQuery

Cumbersome concatenation, hard to include logic (like the `if` statement in the
example above).

## License 

(The MIT License)

Copyright (c) 2011 Guillermo Rauch &lt;guillermo@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
