import { useState, useEffect } from "react";
import type { FC } from "react";
import type { EpisodeSummary } from "../pages/ShowDetails";
import { addEpisodeToWatchlist, getWatchList } from "../utils/watchList";
import styles from "../pages/ShowDetails.module.css";
import classes from "./EpisodeItem.module.css";

type Props = {
    episode: EpisodeSummary;
    username: string;
    show: { id: number; name: string; image?: { medium?: string } };
};

const EpisodeItem: FC<Props> = ({ episode, username, show }) => {
    const [status, setStatus] = useState<"planned" | "watched" | null>(null);

    useEffect(() => {
        const watchList = getWatchList(username);
        const showEntry = watchList.find((s: any) => s.showId === show.id);
        const currentStatus =
            showEntry?.episodes.find((e: any) => e.id === episode.id)?.status ?? null;
        setStatus(currentStatus);
    }, [episode.id, username, show.id]);

    const handleAdd = (newStatus: "planned" | "watched") => {
        if (!username) return;
        addEpisodeToWatchlist(username, show, episode, newStatus);
        setStatus(newStatus);
    };

    return (
        <li key={episode.id} className={styles.episodeItem}>
            <span className={styles.episodeLabel}>
                S{episode.season}E{episode.number}:
            </span>{" "}
            <span className={styles.episodeTitle}>
                {episode.name &&
                !/^Episode\s\d+$/.test(episode.name) &&
                episode.name.trim() !== ""
                    ? episode.name
                    : ""}
            </span>
            {episode.airdate && (
                <span className={styles.airDate}>({episode.airdate})</span>
            )}
            <div className={styles.watchlistButtons}>
                {status === "planned" && (
                    <>
                        <p>Status: Planned</p>
                        <button onClick={() => handleAdd("watched")}>Mark as Watched</button>
                    </>
                )}
                {status === "watched" && <p>Status: Watched</p>}
                {!status && (
                    <div className={classes.watchlistButtons}>
                        <button onClick={() => handleAdd("planned")}>Add to Planned</button>
                        <button onClick={() => handleAdd("watched")}>Add to Watched</button>
                    </div>
                )}
            </div>
        </li>
    );
};

export default EpisodeItem;
