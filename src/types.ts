export type ActionType = 'create' | 'remove';

interface ActionCreate<T> {
    type: 'create',
    id: string,
    data: T & {
        ref: React.RefObject<HTMLElement>,
    }
}

interface ActionRemove {
    type: 'remove',
    id: string,
}

export type Action<T> = ActionCreate<T> | ActionRemove;

export interface DefaultActionData {
    text: string,
    type: 'info' | 'success' | 'warning' | 'error',
}

export type DefaultAction = Action<DefaultActionData>;

export interface Toast {
    id: string,
    text: string,
    name: string,
    ref: React.RefObject<HTMLElement>
}