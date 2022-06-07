# curssed

[_the complete css framework_](https://jwanner83.github.io/curssed/)

## description

a framework for creating web experiences without knowing any other language than valid css.

## quick start

```js
import { render } from 'curssed.js'

render(document.body, {
  markup: {
    content: `
        .content[p] {
          content: "hello world";
          color: red;
        }
        `
  }
}).then()
```

## example

see the `/docs` folder for a code example or visit [the website](https://jwanner83.github.io/curssed/) to see it live in action.

## usage

### initialization

1. create a `index.html` file in your project directory.
2. create a `index.js` file.
3. add the following script tag to the `index.html` file:

```html
<script src="index.js" type="module"></script>
```

4. import the `render` function from `curssed` inside the `index.js` file.
5. call the function with the `document.body` element and at least the `markup` object.

```js
import { render } from 'curssed.js'

render(document.body, {
  markup: {
    content: '.text[p] { content: "hello world"; color: red; }'
  }
}).then()
```

6. if you want to write your css inside a css file, create a css file, e.g. `markup.css`, add `.content[p] { content: "hello world"; color: red; }` to it and change the method call to use file instead of content:

```js
render(document.body, {
  markup: {
    file: 'markup.css'
  }
}).then()
```

7. If you want to use a separate css which only contains styles without any markup, you can do this either by adding the css directly in the javascript or by providing a file.

```js
render(document.body, {
  markup: {
    file: 'markup.css'
  },
  css: {
    content: '.content { color: red; }' // or file, e.g.: 'style.css'
  }
}).then()
```

### html element types

to use different html element types you can define them in brackets at the end of the class name. if you don't specify
any, the default one is `div`

```css
.container {
. . .
}

/* same as */
.container[div] {
. . .
}
```

```css
.heading[h1] {
. . .
}
```

```css
.image[img] {
. . .
}
```

### nesting

the type of the parent doesn't have to be defined if you want `title` to be inside of the `container`.

```css
.container[main] {
. . .
}

.container .title[h1] {
. . .
}
```

### set content

to set content, use the content css property. you are able to use html inside the value but be careful to use single
quotes instead of double to not break the system.

```css
.title[h1] {
  content: 'hello world';
}
```

```css
.content {
  content: "<i class='test'>hello world</i>";
}
```

### attributes

you can set attributes to the html element by defining them after the type with brackets. if you need multiple of them,
just add multiple brackets.

```css
.image[img][src="https://i.imgflip.com/6i5g81.jpg"]
{
  object-fit: cover;
  height: 200px;
  width: 100%;
}
```

```css
.link[a][href="https://jwanner83.github.io/curssed/"][target="_blank"]
{
  object-fit: cover;
  height: 200px;
  width: 100%;
}
```
