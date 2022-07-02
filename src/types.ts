import React from "react";
import { TransitionStatus } from 'react-transition-group';

export type ToastPlacement = 'top' | 'right' | 'bottom' | 'left';

export type ToastComponentType<T> = React.ComponentType<ToastComponentProps<T> & React.RefAttributes<HTMLElement>>;

type ToastDescriptor<T> = {
    id: string,
    name: string,
    placement: ToastPlacement,
    ref: React.RefObject<HTMLElement>,
    data: T,
}

type ToastAnimationProps = {
    state: TransitionStatus,
    duration: number,
}

export type ToastComponentProps<T> = {
    style: React.CSSProperties,
    id: string,
    name: string,
    removeMe: () => void,
    animation: ToastAnimationProps,
    placement: ToastPlacement,
    data: T,
};

export type ActionType = 'create' | 'remove';

interface ActionCreate<T> {
    type: 'create',
    descriptor: ToastDescriptor<T>
}

interface ActionUpdate<T> {
    type: 'update',
    id: string,
    newData: Partial<T>,
}

interface ActionRemove {
    type: 'remove',
    id: string,
}

interface ActionRemoveAllByName {
    type: 'removeAllByName',
    name: string,
}

interface ActionRemoveAll {
    type: 'removeAll',
}

export type Action<T> = ActionCreate<T> | ActionUpdate<T> | ActionRemove | ActionRemoveAllByName | ActionRemoveAll;



export interface DefaultActionData {
    text: string,
    type: 'info' | 'success' | 'warning' | 'error',
}

export type DefaultToastData = ToastComponentProps<DefaultActionData>

export type DefaultAction = Action<DefaultActionData>;