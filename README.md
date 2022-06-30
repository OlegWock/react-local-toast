# react-local-toast

[![npm version][npmv-image]][npmv-url]
[![build status][build-image]][build-url]
[![coverage status][codecov-image]][codecov-url]
[![npm downloads][npmd-image]][npmd-url]

> Local toast helps you to provide feedback related to particular components on page

## Features

* Local toasts are linked to particular component in DOM.
* Toast can be displayed on right/left/top/bottom side of component.
* Toast can be hidden after some timout or hidden programatically.
* Component might have multiple toasts.
* Multiple toasts stucks **vertically**, even if displayed on left or right side.
* `info`, `success`, `warning` and `error` toasts out of the box.
* You can bring your own design.
* Or you can bring not just your own deisgn, but your own toast component!

## Installation

```
npm install react-local-toast --save
# Or if you prefer yarn
yarn add react-local-toast
```

## Basic Usage

For starters, you need to wrap your application in `LocalToastProvider`. 

```jsx
import React from 'react';
import { LocalToastProvider } from 'react-local-toast';

export default () => {
    return (<LocalToastProvider>
        {/* All your components that will use local toasts should be children of this provider. */}
        <App />
    </LocalToastProvider>);
}
```

Local toasts are linked to particular components on page, so let's mark our component as target for local toast:

```jsx
import React from 'react';
import { LocalToastTarget } from 'react-local-toast';

export const App = () => {
    return (<div>
        <p>This component should be inside LocalToastProvider</p>
        {/* Wrap your component with <LocalToastTarget> */}
        <LocalToastTarget name="btn">
            <button>Click me please!</button>
        </LocalToastTarget>
    </div>);
};
```

Local toast uses refs to calculate position of component, so in case you want to use toasts with functional components -- make sure they are wrapped in `React.forwardRef`.

And final piece! Update your component to actually produce local toasts:

```jsx
import React from 'react';
// New import here !!
import { LocalToastTarget, useLocalToast } from 'react-local-toast';

export const App = () => {
    // Use hook to show and hide toasts
    const {showToast, hideToast} = useLocalToast();

    return (<div>
        <p>This component should be inside LocalToastProvider</p>
        <LocalToastTarget name="btn">
            <button onClick={() => showToast('btn', 'Hello my first toast!')}>Click me please!</button>
        </LocalToastTarget>
    </div>);
};
```

Cool, huh?

## Live Examples

- [Basic Usage](https://codesandbox.io/)
- [API Example](https://codesandbox.io/)
- [UMD Build (Development)](https://codesandbox.io/)
- [UMD Build (Production)](https://codesandbox.io/)


## How can I ...

### ... use my own design for toast?

`LocalToastProvider` accepts prop `Component`, you can supply your component which will be used as toast. To see which props available to use in component, refer to [default Toast implementation]().

### ... add buttons to toast or make any other customizations to toast?

TODO: write this section

## API

### `LocalToastProvider`

TODO: write this section

### `LocalToastTarget`

TODO: rename this component

### `useLocalToast`

TODO: write this section

### `useCustomLocalToast`

TODO: write this section (will be used to write your own hooks with custom api)

## Installation

There are also UMD builds available via [unpkg](https://unpkg.com/). I didn't test them though. So if you have any problems with them please let me know

- https://unpkg.com/react-local-toast/dist/react-local-toast.umd.development.js
- https://unpkg.com/react-local-toast/dist/react-local-toast.umd.production.js

Make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.development.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.development.js)


## License

MIT

[build-image]: https://img.shields.io/github/workflow/status/OlegWock/react-local-toast/CI?style=flat-square
[build-url]: https://github.com/OlegWock/react-local-toast/actions?query=workflow%3ACI
[codecov-image]: https://img.shields.io/codecov/c/github/OlegWock/react-local-toast.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/OlegWock/react-local-toast
[npmv-image]: https://img.shields.io/npm/v/react-local-toast.svg?style=flat-square
[npmv-url]: https://www.npmjs.com/package/react-local-toast
[npmd-image]: https://img.shields.io/npm/dm/react-local-toast.svg?style=flat-square
[npmd-url]: https://www.npmjs.com/package/react-local-toast
