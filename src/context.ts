import React from "react";
import { Action, ToastPlacement, ToastComponentProps } from "./types";

export interface LocalToastContextType<T> {
    Component: React.ComponentType<ToastComponentProps<T>>,
    placement: ToastPlacement,
    q: Action<T>[],
    setQ: (q: Action<T>[]) => void,
    refs: {
        [name: string]: React.RefObject<HTMLElement>,
    },

    registerRef: (name: string, ref: React.RefObject<HTMLElement>) => void,
    removeRef: (name: string) => void,

    addToast: (name: string, data: T, placement?: ToastPlacement) => string,
    removeToast: (id: string) => void,
    removeAllByName: (name: string) => void,
    removeAll: () => void,
}

export const createContext = <T>(component: React.ComponentType<ToastComponentProps<T>>) => {
    return React.createContext<LocalToastContextType<T>>({
        Component: component,
        placement: "top",
        q: [],
        setQ: () => {},
        refs: {},
        addToast: () => 'mock',
        removeToast: () => {},
        removeAll: () => {},
        removeAllByName: () => {},
        registerRef: () => {},
        removeRef: () => {},
    });
};