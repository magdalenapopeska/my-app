import classes from './Modal.module.css';
// @ts-ignore
import { ReactNode } from "react";

type ModalProps = {
    children: ReactNode;
    onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
    return (
        <>
            <div className={classes.backdrop} onClick={onClose} />
            <dialog open className={classes.modal}>
                {children}
            </dialog>
        </>
    );
}
