import React from "react";
import { createContext, LocalToastContextType } from "./context";
import { createProvider } from "./provider";
import { createTarget } from "./target";
import { ToastPlacement } from "./types";

export const createCustomLocalToast = <T>(component: LocalToastContextType<T>["Component"], placement: ToastPlacement = 'top') => {
    // Create context
    const Context = createContext(component);
    // Create context provider
    const Provider = createProvider(Context, component, placement);
    // Create LocalToastTarget binded to context
    const Target = createTarget(Context);
    // Create hook
    
    const useCustomLocalToast = () => {
        const {addToast, removeToast, removeAllByName, removeAll} = React.useContext(Context);
        return {addToast, removeToast, removeAllByName, removeAll};
    };

    return {Provider, Target, useCustomLocalToast};
};