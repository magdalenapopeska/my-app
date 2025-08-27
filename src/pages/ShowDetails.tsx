import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ShowDetails.module.css";
import { getShowDetails } from "../api/tvmaze";
import classes from "./Account.module.css";

type Episode = {
    id: number;
    season: number;
    number: number;
    name: string | null;
    airdate: string | null;
};

type ShowInfo = {
    name: string;
    image?: { medium?: string; original?: string };
    summary?: string;
};

const ShowDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const showId = Number(id);

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [showInfo, setShowInfo] = useState<ShowInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!showId) return;

        const fetchShow = async () => {
            try {
                const res = await getShowDetails(showId);
                setShowInfo(res.data);
                setEpisodes(res.data._embedded.episodes);
            } catch (error) {
                console.error("Failed to fetch show:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShow();
    }, [showId]);

    if (loading) return <p className={styles.noEpisodes}>Loading show details...</p>;
    if (!showInfo) return <p className={styles.noEpisodes}>Show not found.</p>;

    const sortedEpisodes = episodes.sort((a, b) => {
        if (a.season === b.season) return (a.number ?? 0) - (b.number ?? 0);
        return a.season - b.season;
    });

    return (
        <>

        <div className={classes.backHome}>
            <a href="/">Back to Home</a>
        </div>
        <div className={styles.container}>
            <div className={styles.showHeader}>
                {showInfo.image?.medium && (
                    <img src={showInfo.image.medium} alt={showInfo.name} className={styles.showImage} />
                )}
                <div className={styles.showInfo}>
                    <h1 className={styles.title}>{showInfo.name}</h1>
                    {showInfo.summary && (
                        <div
                            className={styles.summary}
                            dangerouslySetInnerHTML={{ __html: showInfo.summary }}
                        />
                    )}
                </div>
            </div>

            <h2 className={styles.title}>Episodes</h2>
            {sortedEpisodes.length === 0 ? (
                <p className={styles.noEpisodes}>No episodes available.</p>
            ) : (
                <ul className={styles.episodeList}>
                    {sortedEpisodes.map((ep) => (
                        <li key={ep.id} className={styles.episodeItem}>
              <span className={styles.episodeLabel}>
                S{ep.season ?? "?"}E{ep.number ?? "?"}:
              </span>
                            <span className={styles.episodeTitle}>
                {ep.name && !/^Episode\s\d+$/.test(ep.name) && ep.name.trim() !== "" ? ep.name : ""}
              </span>
                            {ep.airdate && <span className={styles.airDate}>({ep.airdate})</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </>
    );
};

export default ShowDetails;

