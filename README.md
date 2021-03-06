# react-local-toast

[![npm version][npmv-image]][npmv-url]
[![npm downloads][npmd-image]][npmd-url]

> Local toast helps you to provide feedback related to particular components on page

<p align="center">
  <img src="./demo.gif" alt="Demo">
</p>



## Features

* Local toasts are linked to particular component in DOM.
* Toast can be displayed on right/left/top/bottom side of component.
* Toast can be hidden after some timout or hidden programatically.
* Component might have multiple toasts.
* Multiple toasts stucks **vertically** (even if displayed on left or right side).
* `info`, `success`, `warning`, `error` and `loading` toasts out of the box.
* You can bring your own design. Or your own Toast component. Or your custom implementation of toasts.
* WAI-ARIA support. 
* TypeScript!


## Documentation and showcase

Can be found [here](https://react-local-toast.netlify.app/). Check it out, I spent a lot of effort making it 😅.

## Installation

```
npm install react-local-toast --save
# Or if you prefer yarn
yarn add react-local-toast
```

## Basic Usage

react-local-toast doesn't automatically inject its styles into DOM, you need to do that. In most cases it will be just:

```js
import 'react-local-toast/dist/bundle.css';
// There is minified version too!
import 'react-local-toast/dist/bundle.min.css';
```

This should work fine for most of tools (Create React App included). For more specific use cases (e.g. using toasts in Shadow DOM) you might want to inject styles manually.

Now you need to wrap your application in `LocalToastProvider`. 

```jsx
import React from 'react';
import { LocalToastProvider } from 'react-local-toast';

export default () => {
    return (<LocalToastProvider>
        {/* All your components that will use local toasts should be children of this provider. */}
        <App />
    </LocalToastProvider>);
};
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

Local toast uses refs to get position of component, so in case you want to use toasts with functional components – make sure they are wrapped in `React.forwardRef`.

And final piece! Update your component to actually produce local toasts:

```jsx
import React from 'react';
// New import here !!
import { LocalToastTarget, useLocalToast } from 'react-local-toast';

export const App = () => {
    // Use hook to show and hide toasts
    const {showToast, removeToast} = useLocalToast();

    return (<div>
        <p>This component should be inside LocalToastProvider</p>
        <LocalToastTarget name="btn">
            <button onClick={() => showToast('btn', 'Hello my first toast!')}>Click me please!</button>
        </LocalToastTarget>
    </div>);
};
```

In case you need to show toast from class component, you can use HOC like this:

```tsx
import { LocalToastTarget, withLocalToast, LocalToastHocProps } from 'react-local-toast';

interface Props extends LocalToastHocProps {
    name: string
}

class ClassComp extends React.Component<Props, any> {
    sayHello = () => {
        this.props.showToast('class_comp', `Hello, ${this.props.name}!`)
    };
    render() {
        return (<div>
            <LocalToastTarget name='class_comp'>
                <button onClick={sayHello}>Say hello</button>
            </LocalToastTarget>
        </div>);
    }
}

// And later use thic component as you usually do
export default withLocalToast(ClassComp);
```

This will pass toast-related functions (exactly same as in `useLocalToast` hook) as props to wrapped component.

Cool, huh?

## License

MIT

[npmv-image]: https://img.shields.io/npm/v/react-local-toast.svg?style=flat-square
[npmv-url]: https://www.npmjs.com/package/react-local-toast
[npmd-image]: https://img.shields.io/npm/dm/react-local-toast.svg?style=flat-square
[npmd-url]: https://www.npmjs.com/package/react-local-toast
