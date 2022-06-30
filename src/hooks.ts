import { useContext } from "react";
import { LocalToastContext } from "./context";

export const useLocalToast = () => {
    const {showToast, hideToast} = useContext(LocalToastContext);
    return {showToast, hideToast};
};

export const useCustomLocalToast = <T>() => {

};