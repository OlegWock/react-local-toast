import React from 'react';
import clsx from 'clsx';
import { createCustomLocalToast } from './factory';
import { DefaultToastData, ToastPlacement, ToastComponentProps } from './types';
import { DEFAULT_PLACEMENT } from './const';
import { createHocFromHook } from './hoc';
import { AiOutlineLoading, IoCloseCircleSharp, IoIosCheckmarkCircle, IoIosInformationCircle, RiErrorWarningFill } from './icons';

const animations = {
    top: 'rltTop',
    bottom: 'rltBottom',
    left: 'rltLeft',
    right: 'rltRight',
};


const iconByType = {
    info: IoIosInformationCircle,
    success: IoIosCheckmarkCircle,
    warning: RiErrorWarningFill,
    error: IoCloseCircleSharp,
    loading: AiOutlineLoading,
};


const ToastComponent = React.forwardRef(
    (props: ToastComponentProps<DefaultToastData>, ref: React.Ref<HTMLElement>) => {
        // If you enable transition and change elements position in same tick -- position change will be animated.
        // This codes delays enabling transition by one render
        const [disableTransitions, setDisableTransitions] = React.useState(props.animation.disableTransitions);
        React.useEffect(() => {
            if (props.animation.disableTransitions !== disableTransitions) {
                setDisableTransitions(props.animation.disableTransitions);
            }
        });
        
        const contentIsText = ['string', 'number'].includes(typeof props.data.text);
        const Icon = iconByType[props.data.type];

        let animation = 'none';
        if (props.animation.state === 'entering') animation = `${animations[props.placement]} ${props.animation.duration}ms linear 0s 1 normal`;
        if (props.animation.state === 'exiting') animation = `${animations[props.placement]} ${props.animation.duration}ms linear 0s 1 reverse`;

        const styles = {
            transition: disableTransitions ? 'none' : '0.1s linear',
            animation,
            ...props.style
        };

        return (
            <div
                className={clsx({
                    'react-local-toast': true,
                    [`react-local-toast-${props.data.type}`]: true,
                    'react-local-toast-persistent': props.animation.duration === 0,
                    [`react-local-toast-${props.animation.state}`]: true,
                    [`react-local-toast-${props.placement}`]: true,
                    'react-local-toast-disable-transitions': props.animation.disableTransitions,
                })}
                style={styles}
                ref={ref as React.Ref<HTMLDivElement>}
                role="presentation"
                tabIndex={contentIsText ? -1 : 0}
            >
                <Icon className="react-local-toast-icon" aria-hidden="true" />
                <span 
                    role={['warning', 'error'].includes(props.data.type) ?  'alert' : 'status'} 
                    aria-atomic="true" 
                    aria-live={'assertive'} 
                    className="react-local-toast-text"
                >
                    {props.data.text}
                </span>
            </div>
        );
    }
);

interface ShowToastOptions {
    type?: DefaultToastData['type'];
    placement?: ToastPlacement;
    duration?: number;
}

export const { Provider, Target, useCustomLocalToast } = createCustomLocalToast(ToastComponent);

export const useLocalToast = () => {
    const { addToast, updateToast, removeToast, removeAllToastsByName, removeAllToasts } = useCustomLocalToast();

    const showToast = (
        name: string,
        text: DefaultToastData['text'],
        options?: ShowToastOptions
    ) => {
        const { type = 'success', placement = DEFAULT_PLACEMENT, duration = 2500 } = (options || {});

        const id = addToast(
            name,
            {
                type,
                text,
            },
            placement
        );
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
        return id;
    };


    return { showToast, updateToast, removeToast, removeAllToastsByName, removeAllToasts };
};

export const withLocalToast = createHocFromHook(useLocalToast);

export type LocalToastHocProps = typeof useLocalToast extends () => infer R ? R : never;