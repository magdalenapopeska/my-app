import { useState, useEffect } from "react";
import type { FC } from "react";
import type {EpisodeSummary} from "../pages/ShowDetails";
import {addEpisodeToWatchlist, getWatchList} from "../utils/watchList";
import styles from "../pages/ShowDetails.module.css";

type Props = {
    episode: EpisodeSummary;
    username: string;
}

const EpisodeItem: FC<Props> = ({episode, username}) => {
    const [status, setStatus] = useState<"planned" | "watched" | null>(null);

    useEffect(() => {
        const currentStatus = getWatchList(username).find((e:any) => e.id === episode.id)?.status;
        setStatus(currentStatus ?? null);
    }, [episode.id, username]);

    const handleAdd = (newStatus: "planned" | "watched") => {
        if (!username) return;
        addEpisodeToWatchlist(username, episode, newStatus);
        setStatus(newStatus);
    };


    return (
        <li key={episode.id} className={styles.episodeItem}>
            <span className={styles.episodeLabel}>
                S{episode.season}E{episode.number}:
            </span>{" "}
            <span className={styles.episodeTitle}>
                {episode.name && !/^Episode\s\d+$/.test(episode.name) && episode.name.trim() !== ""
                    ? episode.name
                    : ""}
            </span>
            {episode.airdate && <span className={styles.airDate}>({episode.airdate})</span>}

            <div className={styles.watchlistButtons}>
                {status === "planned" && <p>Status: Planned</p>}
                {status === "watched" && <p>Status: Watched</p>}
                {!status && (
                    <>
                        <button onClick={() => handleAdd("planned")}>Add to Planned</button>
                        <button onClick={() => handleAdd("watched")}>Add to Watched</button>
                    </>
                )}
            </div>
        </li>
    )
}

export default EpisodeItem;