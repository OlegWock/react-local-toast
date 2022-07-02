import React from 'react';
import { DEFAULT_ANIMATION_DURATION, DEFAULT_PLACEMENT } from './const';
import { Action, ToastPlacement, ToastComponentType } from './types';

export interface LocalToastContextType<T> {
    Component: ToastComponentType<T>;
    placement: ToastPlacement;
    animationDuration: number;
    q: Action<T>[];
    setQ: (q: Action<T>[]) => void;
    refs: {
        [name: string]: React.RefObject<HTMLElement>;
    };

    registerRef: (name: string, ref: React.RefObject<HTMLElement>) => void;
    removeRef: (name: string) => void;

    addToast: (name: string, data: T, placement?: ToastPlacement) => string;
    updateToast: (id: string, newData: Partial<T>) => void;
    removeToast: (id: string) => void;
    removeAllByName: (name: string) => void;
    removeAll: () => void;
}

export const createContext = <T>(component: ToastComponentType<T>): React.Context<LocalToastContextType<T>> => {
    return React.createContext<LocalToastContextType<T>>({
        Component: component,
        placement: DEFAULT_PLACEMENT,
        animationDuration: DEFAULT_ANIMATION_DURATION,
        q: [],
        setQ: () => {},
        refs: {},
        addToast: () => 'noop',
        updateToast: () => {},
        removeToast: () => {},
        removeAll: () => {},
        removeAllByName: () => {},
        registerRef: () => {},
        removeRef: () => {},
    });
};
