import { Slot } from '@radix-ui/react-slot';
import React from 'react';
import { LocalToastContextType } from './context';

export interface LocalToastTargetProps {
    name: string;
    children: React.ReactNode;
}

export type LocalToastTargetType = (props: LocalToastTargetProps) => JSX.Element;

export const createTarget = <T,>(Context: React.Context<LocalToastContextType<T>>): LocalToastTargetType => {
    return ({ name, children }: LocalToastTargetProps) => {
        const ctx = React.useContext(Context);
        const ref = React.useRef<HTMLElement>(null);
        React.useEffect(() => {
            ctx.registerRef(name, ref);
            return () => {
                ctx.removeRef(name);
            };
        }, []);

        return <Slot ref={ref}>{children}</Slot>;
    };
};
