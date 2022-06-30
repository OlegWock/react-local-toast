import React from "react";
import {v4 as uuidv4} from 'uuid';
import { LocalToastContextType } from "./context";
import { Action, ToastPlacement, ToastComponentProps } from "./types";
import { createViewport } from "./viewport";

interface LocalToastProviderProps<T> {
    children?: React.ReactNode,
    Component?: React.ComponentType<ToastComponentProps<T>>,
}


export const createProvider = <T,>(Context: React.Context<LocalToastContextType<T>>, ToastComponent: React.ComponentType<ToastComponentProps<T>>, defaultPlacement: ToastPlacement = 'top') => {
    const Viewport = createViewport(Context);

    return ({children, Component = ToastComponent}: LocalToastProviderProps<T>) => {
        const [refs, setRefs] = React.useState<LocalToastContextType<T>["refs"]>({});
        const [q, setQ] = React.useState<LocalToastContextType<T>["q"]>([]);

        const dispatchAction = (action: Action<T>) => {
            setQ((prevQ) => {
                return [...prevQ, action];
            })
        };
    
        const registerRef = (name: string, ref: React.RefObject<HTMLElement>) => {
            setRefs((prevRefs) => ({
                ...prevRefs,
                [name]: ref,
            }));
        };
    
        const removeRef = (name: string) => {
            setRefs((prevRefs) => {
                const {[name]: _, ...rest} = prevRefs;
                return rest;
            });
            dispatchAction({
                type: 'removeAllByName',
                name,
            });
        };
    
        const addToast = (name: string, data: T, placement: ToastPlacement = defaultPlacement) => {
            const ref = refs[name];
            if (!ref || !ref.current) {
                console.warn(`Tried to show toast on unmounted component '${name}'`);
            }

            console.log('Showing toast with data', data, 'on element with name', name, ref.current);
            const id = uuidv4();
            // TODO: calculate x and y, take into account `placement`
            const x = 0;
            const y = 0;

            dispatchAction({
                type: 'create',
                descriptor: {
                    name,
                    id,
                    data,
                    x,
                    y,
                }  
            });

            return id;
        };
    
        const removeToast = (id: string) => {
            console.log('Hiding toast', id);
            dispatchAction({
                type: 'remove',
                id,
            });
        };

        const removeAllByName = (name: string) => {
            console.log('Hiding toast', name);
            dispatchAction({
                type: 'removeAllByName',
                name,
            });
        };

        const removeAll = () => {
            dispatchAction({
                type: 'removeAll',
            });
        };
    
        return (<Context.Provider value={{
            Component,
            placement: defaultPlacement,
            q,
            setQ,
            refs,
            registerRef,
            removeRef,
            addToast,
            removeToast,
            removeAllByName,
            removeAll
        }}>{children}<Viewport /></Context.Provider>);
    };
};