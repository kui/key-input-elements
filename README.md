# key-input-elements

Custom elements to input key press events.

- [Demo](https://kui.github.io/key-input-elements/)
- [Demo source](https://github.com/kui/key-input-elements/blob/master/docs/index.html)

## Usage

Put an `key-input` element to your HTML.

```html
<script type="module">
  import * as ki from "./js/key-input-registerer.js";
  ki.register();
</script>
<input is="key-input" />
```

Then press `D` key, the `key-input` displays `KeyD`. And then press `D` key with any shift keys, it displays `Shift + KeyD`.

See [demo](https://kui.github.io/key-input-elements/) for details.
