import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShowDetails } from "../api/tvmaze"; // make sure the path is correct
import styles from "./ShowDetails.module.css";
import classes from "./Account.module.css";

type Episode = {
    id: number;
    season: number;
    number: number;
    name: string | null;
    airdate: string | null;
};

type Show = {
    id: number;
    name: string;
    image?: { medium?: string; original?: string } | null;
    summary?: string | null;
    _embedded?: {
        episodes: Episode[];
    };
};

const ShowDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const showId = Number(id);

    const [show, setShow] = useState<Show | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const res = await getShowDetails(showId);
                setShow(res.data);
                if (res.data._embedded?.episodes?.length) {
                    const firstSeason = Math.min(
                        ...res.data._embedded.episodes.map((ep: Episode) => ep.season)
                    );
                    setSelectedSeason(firstSeason);
                }
            } catch (error) {
                console.error("Failed to fetch show details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
    }, [showId]);

    if (loading) return <p className={styles.noEpisodes}>Loading show...</p>;
    if (!show) return <p className={styles.noEpisodes}>Show not found.</p>;

    const episodes = show._embedded?.episodes || [];

    const episodesBySeason = episodes.reduce<Record<number, Episode[]>>((acc, ep) => {
        if (!acc[ep.season]) acc[ep.season] = [];
        acc[ep.season].push(ep);
        return acc;
    }, {});

    const seasonNumbers = Object.keys(episodesBySeason)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <>
        <div className={classes.backHome}>
            <a href="/">Back to Home</a>
        </div>
        <div className={styles.container}>
            <h1 className={styles.showTitle}>{show.name}</h1>
            {show.image?.medium && (
                <img src={show.image.medium} alt={show.name} className={styles.showImage} />
            )}
            {show.summary && (
                <div
                    className={styles.showSummary}
                    dangerouslySetInnerHTML={{ __html: show.summary }}
                />
            )}

            {episodes.length > 0 ? (
                <>
                    <div className={styles.seasonSelector}>
                        <label htmlFor="season">Select Season: </label>
                        <select
                            id="season"
                            value={selectedSeason ?? ""}
                            onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        >
                            {seasonNumbers.map((season) => (
                                <option key={season} value={season}>
                                    Season {season}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ul className={styles.episodeList}>
                        {selectedSeason &&
                            episodesBySeason[selectedSeason].map((ep) => (
                                <li key={ep.id} className={styles.episodeItem}>
                  <span className={styles.episodeLabel}>
                    S{ep.season}E{ep.number}:
                  </span>{" "}
                                    <span className={styles.episodeTitle}>
                    {ep.name && !/^Episode\s\d+$/.test(ep.name) && ep.name.trim() !== ""
                        ? ep.name
                        : ""}
                  </span>
                                    {ep.airdate && <span className={styles.airDate}>({ep.airdate})</span>}
                                </li>
                            ))}
                    </ul>
                </>
            ) : (
                <p className={styles.noEpisodes}>No episodes available.</p>
            )}
        </div>
        </>

    );
};

export default ShowDetails;
