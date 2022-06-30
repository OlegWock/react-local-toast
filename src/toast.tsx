import React from "react";
import styled from "styled-components";
import { DefaultActionData } from "./types";

export interface ToastProps<T> {
    x: number,
    y: number,
    data: T
}

const StyledToast = styled.div<{$x: number, $y: number}>`
    position: absolute;
    top: ${({$y}) => $y}px;
    left: ${({$x}) => $x}px;
    padding: 4px;
    background-color: white;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
`;

export const ToastComponent = (props: ToastProps<DefaultActionData>) => {
    return (<StyledToast $x={props.x} $y={props.y}>{props.data.text}</StyledToast>);
}