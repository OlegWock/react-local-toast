# react-local-toast

[![npm version][npmv-image]][npmv-url]
[![npm downloads][npmd-image]][npmd-url]

> Local toast helps you to provide feedback related to particular components on page


## Features

* Local toasts are linked to particular component in DOM.
* Toast can be displayed on right/left/top/bottom side of component.
* Toast can be hidden after some timout or hidden programatically.
* Component might have multiple toasts.
* Multiple toasts stucks **vertically** (even if displayed on left or right side).
* `info`, `success`, `warning`, `error` and `loading` toasts out of the box.
* You can bring your own design. Or your own Toast component. Or your custom implementation of toasts.
* TypeScript!


## Showcase

**Work in progress**

## Installation

```
npm install react-local-toast --save
# Or if you prefer yarn
yarn add react-local-toast
```

There are also UMD builds available via [unpkg](https://unpkg.com/). I didn't test them though. So if you have any problems with them please let me know

- https://unpkg.com/react-local-toast/dist/react-local-toast.umd.development.js
- https://unpkg.com/react-local-toast/dist/react-local-toast.umd.production.js

Make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.development.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.development.js)

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

Cool, huh?

## How can I ...

### ... use my own design for toast?

For minor adjustments you can use write custom CSS. Default toast component exposes several classes, see details in file [default-implementation.tsx](src/default-implementation.tsx#L161-L166).

For more complex cases: `LocalToastProvider` accepts `Component` prop, you can supply your component which will be used as toast. Component should accept ref (so, use `React.forwardRef`), this used to measure component size and positon it relative to parent. To see which props available to use in component, refer to API reference.

```jsx
import React from 'react';
import { LocalToastProvider } from 'react-local-toast';

const MyToast = React.forwardRef({style, data}, ref) => {
    return (<div style={style} ref={ref}>Very important message: {data.text}</div>);
});

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
            <button onClick={() => removeToast(toastId)}>Dismiss</button>
        </div>), {type: 'success', duration: 0});
    };

    const {showToast, removeToast} = useLocalToast();

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

const MyToast = React.forwardRef({style, data, removeMe}, ref) => {
    return (<div style={style} ref={ref}>Very important message: {data.text} <button onClick={() => removeMe()}>Dismiss</button></div>);
});

export default () => {
    return (<LocalToastProvider Component={MyToast}>
        {/* All your components that will use local toasts should be children of this provider. */}
        <App />
    </LocalToastProvider>);
};
```

If you need even finer control over toasts, you could provide your custom implementation. Do not be scared, it's not that hard.

When this might be handy? When default implementation isn't enough for you obviously. E.g. you need to pass a lot more data than standart `type` and `text`. Maybe you want to have both `title` and `message` for toast? Or custom `confirm` type with buttons? You're in the right place of documentation, friend.

To provide custom implementation:

1. Create typing for your data (only if you use TypeScript). This data will be passed from hook call to your toast component.

```typescript
interface MyToastData {
    title: string,
    message: string,
    dissmissable: boolean
}
```

2. Implement your Toast component. It should accept props of type [`ToastComponentProps<T>`](src/types.ts#L22-L30) where `T` is your data type. Again, if you're using good old JavaScript, you can skip all this typing stuff, just implement Toast! Important note: react-local-toast uses `style` prop to provide coordinates to toast component, do not forget to pass them to your root node.

```tsx
const MyToast = (props: ToastComponentProps<MyToastData>) => {
    const {style, data} = props;

    return (<div style={style}>
        <h2>{data.title}</h2>
        <p>{data.message}</p>
        {data.dissmissable && <button onClick={() => removeMe()}>OK!</button>}
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

Properties in **bold** are required, other are optional.

### `LocalToastProvider`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Component` | React component | `ToastComponent` | Component used to display toasts |
| `animationDuration` | number (ms) | `80` | Self explanatory |
| `defaultPlacement` | <code>'top' &#124; 'right' &#124; 'bottom' &#124; 'left'</code> | `top` | This might be set on per-toast basis too |


### `LocalToastTarget`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **`name`** | string | - | This should be unique string used to identify toast target |
| **`children`** | React element | - | Lib uses refs to track toast targets, so make sure your child component accept props |

### `useLocalToast`

Calling this hook will return an object with bunch of functions in it. Let's take a closer look on each. Here and farther `name` refers to local toast target name and `id` to toast id. 

```ts
// toastId can be used in remove or update functions
const toastId = showToast(name: string, text: string, options: {
    type?: 'info' | 'success' | 'warning' | 'error' | 'loading',  // Default 'success'
    placement?: ToastPlacement, // Default 'top'
    duration?: number, // Default 2500ms
})
```

To update toast you call `updateToast` function. You can update only toast data. So, for default implementation it's only `type` and `text`. You can't update placement for example.

```ts
updateToast(toastId, {
    type: 'success',
    text: 'Successfully downloaded!'
});

// Partial updated supported too
updateToast(toastId, {
    text: 'Successfully downloaded!'
});
```

To remove one or multiple toasts you call either `removeToast`, `removeAllByName` or `removeAll`.

```ts
// To remove one toast:
removeToast(toastId);
// To remove all toasts from target
removeAllByName(targetName);
// Remove all toasts on page
removeAll();
```

### Custom `ToastComponent`

This is list of props your custom toast component will receive:


| Property | Type | Description |
|----------|------|-------------|
| `id` | string | ID of toast |
| `name` | string | Name of target this toast is attached to |
| `removeMe` | Function `() => void` | Call this to remove current toast |
| `placement` | <code>'top' &#124; 'right' &#124; 'bottom' &#124; 'left'</code> | Placement of current toast. Might be useful to figure out which animation to use |
| `data` | `T` | Data you passed to `addToast` function |
| `animation` | Object | Contains data which might be handy for animating toast |
| `animation.state` | <code>"entering" &#124; "entered" &#124; "exiting" &#124; "exited" &#124; "unmounted"</code> | State of toast. You probably want to enable animation when toast in `entering` or/and `exiting` state |
| `animation.duration` | number | Duration of animation from provider |
| `animation.disableTransitions` | boolean | This will be true for renders where react-local-toast changes toast position (e.g. toast size changed and now requires repositioning) which shouldn't be transitioned (in opposition to positioan changes that you probably want to animate, like moving toast closer to target once previous toast was removed). Since if you enable transition and change elements position in same tick – position change will be animated, I'd recommend to postpone enabling transition for next render (see example in [default-implementation.tsx](src/default-implementation.tsx#L148-155)) |

### `useCustomLocalToast`

This function accepts your `ToastComponent` and creates context and all neccessary pieces to make your custom implementation work under hood. It returns:
* `Provider` – provider to wrap your application in.
* `Target` – target to wrap your components for which you want to display toasts.
* `useCustomLocalToast` – hook that provides access to create/update/remove functions.

While `useCustomLocalToast` might be used as is, I'd recommend to wrap in into other hook with API, that better reflects your needs and application specifics. You can see example in [default-implementation.tsx](src/default-implementation.tsx#L194-211) where we create our own `showToast` function instead of using `addToast` provided by parent hook.

So, `useCustomLocalToast` returns these function:

```ts
// Here T refers to your toast data type
addToast(name: string, data: T, placement?: ToastPlacement) => string; // returns toast id
updateToast(id: string, newData: Partial<T>) => void;
removeToast(id: string) => void;
removeAllByName(name: string) => void;
removeAll() => void;
```


## License

MIT

[npmv-image]: https://img.shields.io/npm/v/react-local-toast.svg?style=flat-square
[npmv-url]: https://www.npmjs.com/package/react-local-toast
[npmd-image]: https://img.shields.io/npm/dm/react-local-toast.svg?style=flat-square
[npmd-url]: https://www.npmjs.com/package/react-local-toast
