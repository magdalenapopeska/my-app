import classes from './Modal.module.css';
import type { ReactNode } from "react";

type ModalProps = {
    children: ReactNode;
    onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
    return (
        <>
            <div className={classes.backdrop} onClick={onClose} />
            <div className={classes.modal} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </>
    );
}
