import React, { Context } from 'react';
import ReactDOM from 'react-dom';
import { Transition, TransitionGroup } from 'react-transition-group';
import { LocalToastContextType } from './context';
import { ToastPlacement } from './types';

interface ToastInfo<T> {
    id: string;
    placement: ToastPlacement;
    parentName: string;
    parentRef: React.RefObject<HTMLElement>;
    toastRef: { current: null | HTMLElement };
    attachRef: React.Ref<HTMLElement>;
    cachedSize: [number, number];
    changedSizeRecently: boolean;
    createdAt: number;
    data: T;
}

interface ViewportProps {
    portalInto?: HTMLElement,
}

// Source: https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
const useWindowSize = () => {
    const [size, setSize] = React.useState([0, 0]);
    React.useLayoutEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
};

export const createViewport = <T,>(context: Context<LocalToastContextType<T>>) => {
    return ({portalInto}: ViewportProps) => {
        const renderToast = (toast: ToastInfo<T>) => {
            const removeMe = () => {
                setToasts((t) => t.filter((tst) => tst.id !== toast.id));
            };

            if (!toast.parentRef.current) return null;

            let styles: React.CSSProperties = {};
            let disableTransitions = false;

            if (toast.toastRef.current) {
                if (toast.changedSizeRecently) {
                    disableTransitions = true;
                    // We don't need this to trigger re-render
                    toast.changedSizeRecently = false;
                }
                const MARGIN = 4;

                const toastRect = toast.toastRef.current.getBoundingClientRect();
                const parentRect = toast.parentRef.current.getBoundingClientRect();

                const parentX = parentRect.left + window.pageXOffset;
                const parentY = parentRect.top + window.pageYOffset;
                const parentEndX = parentRect.right + window.pageXOffset;
                const parentEndY = parentRect.bottom + window.pageYOffset;

                const neighbourToasts = toasts.filter((t) => {
                    return (
                        t.parentName === toast.parentName &&
                        t.placement === toast.placement &&
                        t.id !== toast.id &&
                        t.createdAt < toast.createdAt
                    );
                });
                const neighbourToastsHeight = neighbourToasts.reduce((height, toastDetails) => {
                    return height + toastDetails.cachedSize[1] + MARGIN;
                }, 0);

                styles = {
                    position: 'absolute',
                };
                if (toast.placement === 'top') {
                    styles.top = parentY - toastRect.height - MARGIN - neighbourToastsHeight;
                    styles.left = (parentX + parentEndX) / 2 - toastRect.width / 2;
                }

                if (toast.placement === 'bottom') {
                    styles.top = parentEndY + MARGIN + neighbourToastsHeight;
                    styles.left = (parentX + parentEndX) / 2 - toastRect.width / 2;
                }

                if (toast.placement === 'left') {
                    styles.top = (parentY + parentEndY) / 2 - toastRect.height / 2 - neighbourToastsHeight;
                    styles.left = parentX - toastRect.width - MARGIN;
                }

                if (toast.placement === 'right') {
                    styles.top = (parentY + parentEndY) / 2 - toastRect.height / 2 - neighbourToastsHeight;
                    styles.left = parentEndX + MARGIN;
                }

                if (styles.left && styles.left < 0) styles.left = MARGIN;
                if (styles.left && ((styles.left as number) + toastRect.width) > document.body.scrollWidth) styles.left = document.body.scrollWidth - toastRect.width - MARGIN;
            } else {
                // First paint
                // Draw offscreen to estimate tooltip size on next render
                disableTransitions = true;
                styles = {
                    position: 'absolute',
                    left: '-1000px',
                };
            }

            return (
                <Transition unmountOnExit timeout={animationDuration} key={toast.id}>
                    {(state) => (
                        <Component
                            placement={toast.placement}
                            animation={{ state, duration: animationDuration, disableTransitions }}
                            style={styles}
                            id={toast.id}
                            removeMe={removeMe}
                            name={toast.parentName}
                            data={toast.data}
                            ref={toast.attachRef}
                        />
                    )}
                </Transition>
            );
        };

        // We don't really need window size, but we need to re-render once window size changes
        const [width, height] = useWindowSize();

        const { q, setQ, Component, animationDuration } = React.useContext(context);
        const [toasts, setToasts] = React.useState<ToastInfo<T>[]>([]);

        React.useEffect(() => {
            q.forEach((action) => {
                if (action.type === 'create') {
                    setToasts((t) => {
                        const ref: { current: null | HTMLElement } = { current: null };
                        return [
                            ...t,
                            {
                                id: action.descriptor.id,
                                placement: action.descriptor.placement,
                                parentName: action.descriptor.name,
                                parentRef: action.descriptor.ref,
                                toastRef: ref,
                                cachedSize: [0, 0],
                                changedSizeRecently: false,
                                attachRef: (el) => {
                                    ref.current = el;
                                },
                                data: action.descriptor.data,
                                createdAt: Date.now(),
                            },
                        ];
                    });
                } else if (action.type === 'update') {
                    setToasts((tsts) =>
                        tsts.map((t) => {
                            if (t.id === action.id) {
                                return {
                                    ...t,
                                    data: {
                                        ...t.data,
                                        ...action.newData,
                                    },
                                };
                            }
                            return t;
                        })
                    );
                } else if (action.type === 'remove') {
                    setToasts((t) => t.filter((toast) => toast.id !== action.id));
                } else if (action.type === 'removeAll') {
                    setToasts([]);
                } else if (action.type === 'removeAllByName') {
                    setToasts((t) => t.filter((toast) => toast.parentName !== action.name));
                }
            });

            if (q.length) setQ([]);
        }, [q]);

        React.useLayoutEffect(() => {
            // If any of toasts changed their size after render -- we need to reposition it (and thus schedule one more render)
            const newSizes: { [id: string]: [number, number] } = {};
            toasts.forEach((t) => {
                if (!t.toastRef.current) return;
                const { width, height } = t.toastRef.current.getBoundingClientRect();
                if (t.cachedSize[0] !== width || t.cachedSize[1] !== height) {
                    newSizes[t.id] = [width, height];
                }
            });
            if (Object.keys(newSizes).length) {
                setToasts((tsts) =>
                    tsts.map((t) => {
                        if (newSizes[t.id]) {
                            return {
                                ...t,
                                cachedSize: newSizes[t.id],
                                changedSizeRecently: true,
                            };
                        }
                        return t;
                    })
                );
            }
        });

        return ReactDOM.createPortal(
            <>
                <TransitionGroup component={null}>{toasts.map(renderToast)}</TransitionGroup>
            </>,
            portalInto || document.body
        );
    };
};
