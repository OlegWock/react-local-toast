import React, { useContext } from "react";
import { LocalToastContextType } from "./context";
import { ToastPlacement } from "./types";

// Reference https://react-typescript-cheatsheet.netlify.app/docs/hoc/intro/

export interface WithLocalToastContextProps<T> {
    addToast: (name: string, data: T, placement?: ToastPlacement) => string;
    updateToast: (id: string, newData: Partial<T>) => void;
    removeToast: (id: string) => void;
    removeAllToastsByName: (name: string) => void;
    removeAllToasts: () => void;
}

export type WithHookProps<T> = T;


export const createHocFromContext = <T,>(context: React.Context<LocalToastContextType<T>>) => <P extends WithLocalToastContextProps<T>>(
    WrappedComponent: React.ComponentType<P>,
) => {

    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
    const ComponentWithToast = (props: Omit<P, keyof WithLocalToastContextProps<T>>) => {
        const contextProps = useContext(context);
        return <WrappedComponent {...contextProps} {...(props as P)} />;
    };

    ComponentWithToast.displayName = `withLocalToast(${displayName})`;
    return ComponentWithToast;
};


export const createHocFromHook = <T extends {}>(hook: () => T) => <P extends T>(
    WrappedComponent: React.ComponentType<P>,
) => {

    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
    const ComponentWithToast = (props: Omit<P, keyof WithLocalToastContextProps<T>>) => {
        const hookProps = hook();
        return <WrappedComponent {...hookProps} {...(props as P)} />;
    };

    ComponentWithToast.displayName = `withLocalToast(${displayName})`;
    return ComponentWithToast;
};
