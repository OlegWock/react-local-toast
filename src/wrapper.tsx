import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { useContext, useEffect, useRef } from "react";
import { LocalToastContext } from "./context";

export interface LocalToastTargetProps {
    name: string,
    children: React.ReactNode
}

export const LocalToastTarget = ({name, children}: LocalToastTargetProps) => {
    const ctx = useContext(LocalToastContext);
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        ctx.registerRef(name, ref);
        return () => {
            ctx.removeRef(name);
        }
    }, []);

    return <Slot ref={ref}>
        {children}
    </Slot>
};