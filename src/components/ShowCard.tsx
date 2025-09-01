import { Link } from "react-router-dom";
import styles from "./ShowCard.module.css";
import {useEffect, useState} from "react";
import {getWatchList} from "../utils/localStorage";

type ShowCardProps = {
    showId: number;
    imgUrl?: string;
    title: string;
    network?: string;
    nextEpisode?: string;
};

export default function ShowCard({showId, imgUrl, title, network, nextEpisode}: ShowCardProps) {
    const [status, setStatus] = useState<"planned" | "watched" | null>(null);

    useEffect(() => {
        const watchList = getWatchList();
        const ep = watchList.find((e: any) => e.id === showId);
        if (ep){
            setStatus(status);
        }
    }, [showId]);


    return (
        <div className={styles.cardWrapper}>
        <Link to={`/show-details/${showId}`} className={styles.card}>
            {imgUrl && <img src={imgUrl} alt={title} />}
            <h2>{title}</h2>
            {network && <p>{network}</p>}
            {nextEpisode && <div className={styles.badge}>{nextEpisode}</div>}
        </Link>

        </div>

    );
}

