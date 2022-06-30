import React, { Context } from "react";
import ReactDOM from "react-dom";
import { LocalToastContextType } from "./context";


export const createViewport = <T,>(context: Context<LocalToastContextType<T>>) => {
    return () => {
        const { refs, q, setQ, Component } = React.useContext(context);
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
                {/* TODO: write proper render */}
                {/* @ts-ignore */}
                {title && <Component x={x} y={y} data={{ text: title, type: 'success' }} />}
            </>,
            document.body,
        );
    };
};