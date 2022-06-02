# cssed

_the complete css framework_

![cssed](assets/showcase.gif)

## Description

A framework with which you're able to write css and generate html without the need to know its syntax. 

## Getting started

```js
import {render} from './src/cssed.js'

render(
    document.querySelector('#app'),
    `
    .wrapper {
        content: "hello world";
        color: blue;
    }
    `
)
```

## Usage

### HTML element types

To use different html element types you can define them in brackets at the end of the class name

```css
.wrapper {
. . .
}

.wrapper[div] {
. . .
}
```

```css
.heading[h1] {
. . .
}
```

```css
.random-button[button] {
. . .
}
```

### Nesting

The type of the parent doesn't have to be defined if you want `title` to be inside of `wrapper`.

```css
.wrapper[main] {
. . .
}

.wrapper .title[h1] {
. . .
}
```

### Set content

To set content, use the content css property.

```css
.title[h1] {
    content: "hello world";
}
```