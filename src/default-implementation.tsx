import React from "react";
import styled from "styled-components";
import { createCustomLocalToast } from "./factory";
import { DefaultActionData, ToastPlacement, ToastComponentProps } from "./types";

const StyledToast = styled.div<{$x: number, $y: number}>`
    position: absolute;
    top: ${({$y}) => $y}px;
    left: ${({$x}) => $x}px;
    padding: 4px;
    background-color: white;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
`;

const ToastComponent = (props: ToastComponentProps<DefaultActionData>) => {
    // TODO: support different types
    return (<StyledToast $x={props.x} $y={props.y}>{props.data.text}</StyledToast>);
}

export const {Provider, Target, useCustomLocalToast} = createCustomLocalToast(ToastComponent);

export const useLocalToast = () => {
    const {addToast, removeToast, removeAllByName, removeAll} = useCustomLocalToast();

    const showToast = (name: string, type: DefaultActionData["type"], text: DefaultActionData["text"], placement?: ToastPlacement) => {
        return addToast(name, {
            type,
            text
        }, placement);
    };

    return {showToast, removeToast, removeAllByName, removeAll};
};