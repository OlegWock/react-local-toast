import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import clsx from 'clsx';
import { IoIosCheckmarkCircle, IoIosInformationCircle } from 'react-icons/io';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { RiErrorWarningFill } from 'react-icons/ri';
import { AiOutlineLoading } from 'react-icons/ai';
import { TransitionStatus } from 'react-transition-group';
import { createCustomLocalToast } from './factory';
import { DefaultToastData, ToastPlacement, ToastComponentProps } from './types';
import { DEFAULT_PLACEMENT } from './const';
import { createHocFromHook } from './hoc';

const animationToShared = `
    to {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
`;

const animations = {
    top: keyframes`
        from {
            transform: translateY(25%) scale(1);
            opacity: 0;
        }
        ${animationToShared}
    `,
    bottom: keyframes`
        from {
            transform: translateY(-25%) scale(1);
            opacity: 0;
        }
        ${animationToShared}
    `,
    left: keyframes`
        from {
            transform: translateX(25%) scale(1);
            opacity: 0;
        }
        ${animationToShared}
    `,
    right: keyframes`
        from {
            transform: translateX(-25%) scale(1);
            opacity: 0;
        }
        ${animationToShared}
    `,
};

const spinKeyframes = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const colorByType = {
    info: '#3498db',
    loading: '#3498db',
    success: '#2ecc71',
    warning: '#fa983a',
    error: '#eb2f06',
} as const;

const iconSharedStyles = css`
    pointer-events: none;
    margin-right: 12px;
    font-size: 24px;
`;

const SuccessIcon = styled(IoIosCheckmarkCircle)`
    ${iconSharedStyles};
    color: ${colorByType.success};
`;

const InfoIcon = styled(IoIosInformationCircle)`
    ${iconSharedStyles};
    color: ${colorByType.info};
`;

const WarningIcon = styled(RiErrorWarningFill)`
    ${iconSharedStyles};
    color: ${colorByType.warning};
`;

const ErrorIcon = styled(IoCloseCircleSharp)`
    ${iconSharedStyles};
    color: ${colorByType.error};
`;

const LoadingIcon = styled(AiOutlineLoading)`
    ${iconSharedStyles};
    color: ${colorByType.loading};
    animation: ${spinKeyframes} linear infinite 1.5s;
`;

const iconByType = {
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    loading: LoadingIcon,
};

const ToastText = styled.span`
    line-height: 1;
    flex-grow: 1;
`;

const StyledToast = styled.div<{
    $type: DefaultToastData['type'];
    $state: TransitionStatus;
    $duration: number;
    $placement: ToastPlacement;
    $disableTransition: boolean;
}>`
    padding: 6px 12px;
    z-index: 9999;
    background-color: white;
    color: #333;
    font-size: 14px;
    box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
    border-radius: 3px;
    min-width: 150px;
    max-width: min(300px, calc(80vw - 8px));
    min-height: 30px;
    display: flex;
    ${({ $disableTransition }) => ($disableTransition ? '' : 'transition: 0.1s linear;')}
    justify-content: center;
    align-items: center;
    border: 2px solid ${({ $type }) => colorByType[$type]};
    animation: ${({ $state, $duration, $placement }) => {
        if ($state === 'entering')
            return css`
                ${animations[$placement]} ${$duration}ms linear 0s 1 normal
            `;
        if ($state === 'exiting')
            return css`
                ${animations[$placement]} ${$duration}ms linear 0s 1 reverse
            `;

        return `none`;
    }};
`;

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
        return (
            <StyledToast
                className={clsx({
                    'react-local-toast': true,
                    [`react-local-toast-${props.data.type}`]: true,
                    'react-local-toast-persistent': props.animation.duration === 0,
                    [`react-local-toast-${props.animation.state}`]: true,
                    [`react-local-toast-${props.placement}`]: true,
                    'react-local-toast-disable-transitions': props.animation.disableTransitions,
                })}
                $type={props.data.type}
                $placement={props.placement}
                $state={props.animation.state}
                $duration={props.animation.duration}
                $disableTransition={props.animation.disableTransitions || disableTransitions}
                style={props.style}
                ref={ref as React.Ref<HTMLDivElement>}
                role="presentation"
                tabIndex={contentIsText ? -1 : 0}
            >
                <Icon className="react-local-toast-icon" aria-hidden="true" />
                <ToastText role={['warning', 'error'].includes(props.data.type) ?  'alert' : 'status'} aria-atomic="true" aria-live={['warning', 'error'].includes(props.data.type) ? 'assertive' : 'polite'} className="react-local-toast-text">{props.data.text}</ToastText>
            </StyledToast>
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