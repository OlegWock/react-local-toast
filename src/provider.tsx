import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_ANIMATION_DURATION, DEFAULT_PLACEMENT } from './const';
import { LocalToastContextType } from './context';
import { Action, ToastPlacement, ToastComponentType } from './types';
import { createViewport } from './viewport';

export interface LocalToastProviderProps<T> {
    children?: React.ReactNode;
    Component?: ToastComponentType<T>;
    animationDuration?: number;
    defaultPlacement?: ToastPlacement;
    portalInto?: HTMLElement,
}

export type LocalToastProviderType<T> = (props: LocalToastProviderProps<T>) => JSX.Element;

export const createProvider = <T,>(
    Context: React.Context<LocalToastContextType<T>>,
    ToastComponent: ToastComponentType<T>
): LocalToastProviderType<T> => {
    const Viewport = createViewport(Context);

    return ({
        children,
        Component = ToastComponent,
        animationDuration = DEFAULT_ANIMATION_DURATION,
        defaultPlacement = DEFAULT_PLACEMENT,
        portalInto = undefined,
    }: LocalToastProviderProps<T>) => {
        const [refs, setRefs] = React.useState<LocalToastContextType<T>['refs']>({});
        const [q, setQ] = React.useState<LocalToastContextType<T>['q']>([]);

        const dispatchAction = (action: Action<T>) => {
            setQ((prevQ) => {
                return [...prevQ, action];
            });
        };

        const registerRef = (name: string, ref: React.RefObject<HTMLElement>) => {
            setRefs((prevRefs) => ({
                ...prevRefs,
                [name]: ref,
            }));
        };

        const removeRef = (name: string) => {
            setRefs((prevRefs) => {
                const { [name]: _, ...rest } = prevRefs;
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
                console.warn(`Tried to show toast on not mounted component '${name}'`);
                return '';
            }

            const id = uuidv4();

            dispatchAction({
                type: 'create',
                descriptor: {
                    name,
                    id,
                    placement,
                    ref,
                    data,
                },
            });

            return id;
        };

        const updateToast = (id: string, newData: Partial<T>) => {
            dispatchAction({
                type: 'update',
                id,
                newData,
            });
        };

        const removeToast = (id: string) => {
            dispatchAction({
                type: 'remove',
                id,
            });
        };

        const removeAllToastsByName = (name: string) => {
            dispatchAction({
                type: 'removeAllByName',
                name,
            });
        };

        const removeAllToasts = () => {
            dispatchAction({
                type: 'removeAll',
            });
        };

        // Document is unavailable in Next.js SSR, so postpone actual rendering of viewport (portal)
        const [mounted, setMounted] = React.useState(false);
        React.useEffect(() => {
            setMounted(true);
        }, []);

        return (
            <Context.Provider
                value={{
                    Component,
                    placement: defaultPlacement,
                    animationDuration,
                    q,
                    setQ,
                    refs,
                    registerRef,
                    removeRef,
                    addToast,
                    updateToast,
                    removeToast,
                    removeAllToastsByName,
                    removeAllToasts,
                }}
            >
                {children}
                {mounted && <Viewport portalInto={portalInto} />}
            </Context.Provider>
        );
    };
};
