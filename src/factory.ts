import React from 'react';
import { createContext, LocalToastContextType } from './context';
import { createProvider, LocalToastProviderType } from './provider';
import { createTarget, LocalToastTargetType } from './target';
import { ToastComponentType } from './types';

interface CreateCustomLocalToastResult<T> {
    Provider: LocalToastProviderType<T>;
    Target: LocalToastTargetType;
    useCustomLocalToast: () => Pick<
        LocalToastContextType<T>,
        'addToast' | 'updateToast' | 'removeToast' | 'removeAllToastsByName' | 'removeAllToasts'
    >;
}

export const createCustomLocalToast = <T>(component: ToastComponentType<T>): CreateCustomLocalToastResult<T> => {
    const Context = createContext(component);
    const Provider = createProvider(Context, component);
    const Target = createTarget(Context);

    const useCustomLocalToast = () => {
        const { addToast, updateToast, removeToast, removeAllToastsByName, removeAllToasts } = React.useContext(Context);
        return { addToast, updateToast, removeToast, removeAllToastsByName, removeAllToasts };
    };

    return { Provider, Target, useCustomLocalToast };
};
