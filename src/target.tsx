import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';
import { LocalToastContextType } from './context';

export interface LocalToastTargetPropsWithoutRef {
    name: string;
    children: React.ReactNode;
}

export interface LocalToastTargetProps<R> extends LocalToastTargetPropsWithoutRef {
    ref?: React.Ref<R>
}

export type LocalToastTargetType = <R extends HTMLElement>(props: LocalToastTargetProps<R>) => JSX.Element;

export const createTarget = <T,>(Context: React.Context<LocalToastContextType<T>>): LocalToastTargetType => {
    return React.forwardRef<HTMLElement, LocalToastTargetPropsWithoutRef>(<R extends HTMLElement,>({ name, children }: LocalToastTargetPropsWithoutRef, forwardedRef: React.ForwardedRef<R>) => {
        const ctx = React.useContext(Context);
        const ref = React.useRef<R>(null);

        const composeRefs = useComposedRefs(forwardedRef, ref);
        
        React.useEffect(() => {
            ctx.registerRef(name, ref);
            return () => {
                ctx.removeRef(name);
            };
        }, []);

        return <Slot ref={composeRefs}>{children}</Slot>;
    }) as LocalToastTargetType;
};
