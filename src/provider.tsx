import React from "react";
import ReactDOM from "react-dom";
import {v4 as uuidv4} from 'uuid';
import { LocalToastContext, LocalToastContextType } from "./context";
import { ToastComponent, ToastProps } from "./toast";
import { DefaultActionData } from "./types";

interface LocalToastProviderProps<T> {
    children?: React.ReactNode,
    Component?: React.ComponentType<ToastProps<T>>,
}

const LocalToastViewport = () => {
    const {refs, toasts, q, setQ, Component} = React.useContext(LocalToastContext);
    const [title, setTitle] = React.useState('');
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);

    React.useEffect(() => {
        // Handle q here
    }, [q]);

    // TODO: rewrite this so first render on both server and client(!) will return null
    // https://github.com/vercel/next.js/blob/canary/examples/with-portals/components/ClientOnlyPortal.js
    if (typeof document === 'undefined') return (<></>);
    return ReactDOM.createPortal(
        <>
        {title && <Component x={x} y={y} data={{text: title, type: 'success'}} />}
        </>,
        document.body,
    );
};

export const LocalToastProvider = ({children, Component = ToastComponent}: LocalToastProviderProps<DefaultActionData>) => {
    const [refs, setRefs] = React.useState<LocalToastContextType<DefaultActionData>["refs"]>({});
    const [toasts, setToasts] = React.useState<LocalToastContextType<DefaultActionData>["toasts"]>({});
    const [q, setQ] = React.useState<LocalToastContextType<DefaultActionData>["q"]>([]);

    const registerRef = (name: string, ref: React.RefObject<HTMLElement>) => {
        setRefs({
            ...refs,
            [name]: ref,
        });
    };

    const removeRef = (name: string) => {
        const {[name]: _, ...rest} = refs;
        setRefs(rest);
    };

    const showToast = (name: string, text: string) => {
        const ref = refs[name];
        if (!ref || !ref.current) {
            console.warn(`Tried to show toast on unmounted component '${name}'`);
        }
        console.log('Showing toast with text', text, 'on element with name', name, ref.current);
        const id = uuidv4();

    };

    const hideToast = (name: string) => {
        console.log('Hiding toast', name);
    };

    return (<LocalToastContext.Provider value={{
        Component,
        q,
        setQ,
        refs,
        toasts,
        registerRef,
        removeRef,
        showToast,
        hideToast
    }}>{children}<LocalToastViewport /></LocalToastContext.Provider>);
};