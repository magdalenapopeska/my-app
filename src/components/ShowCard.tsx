import { Link } from "react-router-dom";
import styles from "./ShowCard.module.css";
import { useEffect, useState } from "react";
import { getWatchList } from "../utils/watchList";

type ShowCardProps = {
    showId: number;
    imgUrl?: string;
    title: string;
    network?: string;
    nextEpisode?: string;
    username?: string;
    showStatus?: boolean;
};


export default function ShowCard({ showId, imgUrl, title, network, nextEpisode, username, showStatus }: ShowCardProps) {
    const [status, setStatus] = useState<"planned" | "watched" | null>(null);

    useEffect(() => {
        if (!username) return;

        const watchList = getWatchList(username);
        const showEntry = watchList.find((s: any) => s.showId === showId);

        if (showEntry) {
            if (showEntry.episodes.some((ep: any) => ep.status === "watched")) {
                setStatus("watched");
            } else if (showEntry.episodes.some((ep: any) => ep.status === "planned")) {
                setStatus("planned");
            } else {
                setStatus(null);
            }
        } else {
            setStatus(null);
        }
    }, [showId, username]);

    return (
        <div className={styles.cardWrapper}>
            <Link to={`/show-details/${showId}`} className={styles.card}>
                {imgUrl && <img src={imgUrl} alt={title} />}
                <h2>{title}</h2>
                {network && <p>{network}</p>}
                {nextEpisode && <div className={styles.badge}>{nextEpisode}</div>}
            </Link>

            {showStatus && status && (
                <p className={styles.showStatus}>
                    Status: {status === "watched" ? "Watched" : "Planned"}
                </p>
            )}
        </div>
    );
}
