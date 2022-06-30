import React from "react";
import { ToastComponent, ToastProps } from "./toast";
import { Action, DefaultAction, DefaultActionData, Toast } from "./types";

export interface LocalToastContextType<T> {
    Component: React.ComponentType<ToastProps<T>>,
    q: Action<T>[],
    setQ: (q: Action<T>[]) => void,
    refs: {
        [name: string]: React.RefObject<HTMLElement>,
    },
    toasts: {
        [name: string]: Toast
    },

    registerRef: (name: string, ref: React.RefObject<HTMLElement>) => void,
    removeRef: (name: string) => void,

    showToast: (name: string, text: string) => void,
    hideToast: (name: string) => void,
}

export const LocalToastContext = React.createContext<LocalToastContextType<DefaultActionData>>({
    Component: ToastComponent,
    q: [],
    setQ: () => {},
    refs: {},
    toasts: {},
    showToast: () => {},
    hideToast: () => {},
    registerRef: () => {},
    removeRef: () => {},
});