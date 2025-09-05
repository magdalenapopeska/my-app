import React from "react";
import styles from "./Skeleton.module.css";

type Props = {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    circle?: boolean;
    style?: React.CSSProperties;
}

const Skeleton: React.FC<Props> = ({ width, height, circle, style }) => {
    return (
        <div
            className={styles.skeleton}
            style={{
                width,
                height,
                borderRadius: circle ? "50%" : "4px",
                ...style,
            }}
        />
    );
};

export default Skeleton;
