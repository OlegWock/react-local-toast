# react-local-toast

[![npm version][npmv-image]][npmv-url]
[![build status][build-image]][build-url]
[![npm downloads][npmd-image]][npmd-url]

> Local toast helps you to provide feedback related to particular components on page

## Features

* Local toasts are linked to particular component in DOM.
* Toast can be displayed on right/left/top/bottom side of component.
* Toast can be hidden after some timout or hidden programatically.
* Component might have multiple toasts.
* Multiple toasts stucks **vertically**, even if displayed on left or right side.
* `info`, `success`, `warning` and `error` toasts out of the box.
* You can bring your own design. Or your own Toast component. Or your custom implementation of toasts.
* TypeScript!


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

`LocalToastProvider` accepts prop `Component`, you can supply your component which will be used as toast. To see which props available to use in component, refer to [default Toast implementation](https://github.com/OlegWock/react-local-toast/blob/master/src/toast.tsx#L5-L9).

```jsx
import React from 'react';
import { LocalToastProvider } from 'react-local-toast';

const MyToast = ({x, y, data}) => {
    return (<div style={{
        position: 'absolute',
        top: y, 
        left: x, 
        background: '#333', 
        color: 'white'
        padding: 8,
    }}>{data.text}</div>);
};

export default () => {
    return (<LocalToastProvider Component={MyToast}>
        {/* All your components that will use local toasts should be children of this provider. */}
        <App />
    </LocalToastProvider>);
};
```

### ... add buttons to toast or make any other customizations to toast?

It depends. If it's one-time shot, you can get away with passing JSX to `showToast` function.

```jsx
import React from 'react';
import { LocalToastTarget, useLocalToast } from 'react-local-toast';

export const App = () => {
    const showJsxToast = () => {
        const toastId = showToast('btn', (<div>
            This looks kinda hacky, but I guess it's fine for one-time trick. 
            <button onClick={() => hideToast(toastId)}>Dismiss</button>
        </div>));
    };

    const {showToast, hideToast} = useLocalToast();

    return (<div>
        <p>This component should be inside LocalToastProvider</p>
        <LocalToastTarget name="btn">
            <button onClick={() => showJsxToast()}>Click me please!</button>
        </LocalToastTarget>
    </div>);
};
```


If you want to add 'Dismiss' button to all toasts, you could use `Component` prop of `LocalToastProvider`. Your custom component will receive `removeMe` prop which can be used to dissmiss toast. Like this:

```jsx
import React from 'react';
import { LocalToastProvider } from 'react-local-toast';

const MyToast = ({x, y, data, removeMe}) => {
    return (<div style={{
        position: 'absolute',
        top: y, 
        left: x, 
        background: '#333', 
        color: 'white'
        padding: 8,
    }}>
        {data.text}
        <button onClick={() => removeMe()}>Dismiss</button>    
    </div>);
};

export default () => {
    return (<LocalToastProvider Component={MyToast}>
        {/* All your components that will use local toasts should be children of this provider. */}
        <App />
    </LocalToastProvider>);
};
```

If you need even finer control over toasts, you could provide your custom implementation. Do not be scared, it's not that hard. Actually, default implementation (which you saw in examples above) fits into single file.

When this might be handy? When default implementation isn't enough for you obviously. E.g. you need to pass a lot more data that standart `type` and `text`. Maybe you want to have both `title` and `message` for toast? Or custom `loading` type? You're in the right place of documentation, friend.

To provide custom implementation:

1. Create typing for your data (only if you use TypeScript). This data will be passed to your toast component.

```typescript
interface MyToastData {
    title: string,
    message: string,
    dissmissable: boolean
}
```

2. Implement your Toast component. It should accept props of type `ToastComponentProps<T>` where `T` is your data type. Again, if you're using good old JavaScript, you can skip all this typing stuff, just implement Toast!

```tsx
const MyToast = (props: ToastComponentProps<MyToastData>) => {
    const {x, y, title, message, dissmissable, removeMe} = props;
    const styles = {
        position: 'absolute',
        top: y, 
        left: x, 
        background: '#333', 
        color: 'white'
        padding: 8,
    };

    return (<div style={styles}>
        <h2>{title}</h2>
        <p>{message}</p>
        {dissmissable && <button onClick={() => removeMe()}>OK!</button>}
    </div>);
};
```

3. Cool. Now give this component to `createCustomLocalToast` function. It will return you `Provider`, `Target` and `useCustomLocalToast`. You can export `Provider` and `Target` as is. `useCustomLocalToast` can be used as is too, but let's make this a bit prettier.

```typescript
const {Provider, Target, useCustomLocalToast} = createCustomLocalToast(MyToast);

export const MyToastProvider = Provider;
export const MyToastTarget = Target;

export const useMyLocalToast = () => {
    const {addToast, removeToast, removeAllByName, removeAll} = useCustomLocalToast();

    const showDissmissable = (name: string, title: MyToastData["title"], message: MyToastData["message"], placement?: ToastPlacement) => {
        return addToast(name, {
            title,
            message,
            dissmissable: true,
        }, placement);
    }

    const showPermanent = (name: string, title: MyToastData["title"], message: MyToastData["message"], placement?: ToastPlacement) => {
        return addToast(name, {
            title,
            message,
            dissmissable: false,
        }, placement);
    }

    return {showDissmissable, showPermanent, removeToast, removeAllByName, removeAll};
};
```

4. Congratulations! Now you can use your custom toasts. Just don't forget to wrap your app in `Provider` and target components in `Target`.


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
[npmv-image]: https://img.shields.io/npm/v/react-local-toast.svg?style=flat-square
[npmv-url]: https://www.npmjs.com/package/react-local-toast
[npmd-image]: https://img.shields.io/npm/dm/react-local-toast.svg?style=flat-square
[npmd-url]: https://www.npmjs.com/package/react-local-toast
