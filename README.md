key-input-elements
=========================

Custom elements to input key press events.

* [Demo](https://kui.github.io/key-input-elements/)
* [Demo source](https://github.com/kui/key-input-elements/blob/master/docs/index.html)


Simplest Usage
------------------

Put an `keydown-input` element to your HTML.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~html
<input is="keydown-input">
<script src="key-input-elements.js"></script>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Then press `D` key, the `keydown-input` displays `KeyD`. And then press `C` key with a shift key, it displays `Shift + KeyD`.
