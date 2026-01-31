# ref-button

A simple button component with variants and sizes.

## Usage

```html
<ref-button label="Click me"></ref-button>
<ref-button label="Secondary" variant="secondary"></ref-button>
<ref-button label="Outline" variant="outline"></ref-button>
<ref-button label="Large Button" size="large"></ref-button>
<ref-button label="Disabled" disabled></ref-button>
```

<!-- Auto Generated Below -->


## Properties

| Property             | Attribute  | Description                    | Type                                    | Default     |
| -------------------- | ---------- | ------------------------------ | --------------------------------------- | ----------- |
| `disabled`           | `disabled` | Whether the button is disabled | `boolean`                               | `false`     |
| `label` _(required)_ | `label`    | Button label text              | `string`                                | `undefined` |
| `size`               | `size`     | The button size                | `"large" \| "medium" \| "small"`        | `'medium'`  |
| `variant`            | `variant`  | The button variant style       | `"outline" \| "primary" \| "secondary"` | `'primary'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
