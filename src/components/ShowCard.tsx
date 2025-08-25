import { useState, useEffect } from "react";
import { getShowEpisodes } from "../api/tvmaze";
import styles from "./ShowCard.module.css";

type ShowCardProps = {
    showId?: number;
    imgUrl?: string;
    title: string;
    network?: string;
}

export default function ShowCard({ showId, imgUrl, title, network }: ShowCardProps) {
    const [nextEpisode, setNextEpisode] = useState<string | null>(null);

    useEffect(() => {
        getShowEpisodes(showId)
            .then(res => {
                const episodes = res.data._embedded.episodes;

                // TODO: check which episodes are watched (for now, take the first)
                const nextEp = episodes[0];
                if (nextEp) {
                    setNextEpisode(`S${nextEp.season}E${nextEp.number}: ${nextEp.name}`);
                }
            })
            .catch(err => console.error(err));
    }, [showId]);

    return (
        <div className={styles.card}>
            {imgUrl && <img src={imgUrl} alt={title} />}
            <h2>{title}</h2>
            {network && <p>{network}</p>}
            {nextEpisode && <div className={styles.badge}>{nextEpisode}</div>}
        </div>
    );
}
