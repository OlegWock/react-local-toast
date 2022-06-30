// userHook(name, type, message, [position]) 
// => context.createToast(name, {type, meessage}: data) 
// => get ref by name, calculate x, y, generate id
// => put {id, x, y, data} in Q (this is ToastDescriptor)
// => Viewport grabs ToastDescriptor from Q
// => Renders <Toast> passing {id, x, y, data, removeMe} as props
// => Viewport puts info about toast in local state

type ToastDescriptor<T> = {
    id: string,
    name: string,
    x: number,
    y: number,
    data: T,
}

export type ToastComponentProps<T> = ToastDescriptor<T> & {
    removeMe: Function,
};

export type ActionType = 'create' | 'remove';

interface ActionCreate<T> {
    type: 'create',
    descriptor: ToastDescriptor<T>
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

export type Action<T> = ActionCreate<T> | ActionRemove | ActionRemoveAllByName | ActionRemoveAll;

export interface DefaultActionData {
    text: string,
    type: 'info' | 'success' | 'warning' | 'error',
}

export type DefaultToastData = ToastComponentProps<DefaultActionData>

export type DefaultAction = Action<DefaultActionData>;

export type ToastPlacement = 'top' | 'right' | 'bottom' | 'left';