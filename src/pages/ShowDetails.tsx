import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShowDetails } from "../api/tvmaze";
import styles from "./ShowDetails.module.css";
import classes from "./Account.module.css";
import EpisodeItem from "../components/EpisodeItem";

type Episode = {
    id: number;
    season: number;
    number: number;
    name: string | null;
    airdate: string | null;
};

export type EpisodeSummary = {
    id: string;
    showId?: string;
    season?: number;
    number?: number;
    name?: string | null;
    airdate?: string | null;
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

function mapEpisode(ep: Episode, showId: number): EpisodeSummary {
    return {
        id: String(ep.id),
        showId: String(showId),
        season: ep.season,
        number: ep.number,
        name: ep.name,
        airdate: ep.airdate,
    };
}

const ShowDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const showId = Number(id);

    const [show, setShow] = useState<Show | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [episodeFilter, setEpisodeFilter] = useState<"all" | "watched" | "unwatched">("all");

    const storedUser = sessionStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const username = parsedUser
        ? `${parsedUser.name}_${parsedUser.surname}_${parsedUser.subscription}`
        : null;

    const [watchlist, setWatchlist] = useState<any[]>([]);
    useEffect(() => {
        if (!username) return;
        const raw = localStorage.getItem(`watchlist_${username}`);
        setWatchlist(raw ? JSON.parse(raw) : []);
    }, [username]);

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

    if (loading) return <p className={styles.noEpisodes}>Loading episodes...</p>;
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

    const filteredEpisodes =
        selectedSeason && episodesBySeason[selectedSeason]
            ? episodesBySeason[selectedSeason].filter((ep) => {
                const showEntry = watchlist.find((s: any) => s.showId === show.id);
                const epStatus = showEntry?.episodes.find((e: any) => String(e.id) === String(ep.id))?.status;

                if (episodeFilter === "all") return true;
                if (episodeFilter === "watched") return epStatus === "watched";
                if (episodeFilter === "unwatched") return !epStatus || epStatus !== "watched";
                return true;
            })
            : [];

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

                        <div className={styles.seasonSelector}>
                            <label htmlFor="filter">Filter Episodes: </label>
                            <select
                                id="filter"
                                value={episodeFilter}
                                onChange={(e) =>
                                    setEpisodeFilter(e.target.value as "all" | "watched" | "unwatched")
                                }
                            >
                                <option value="all">All</option>
                                <option value="watched">Watched</option>
                                <option value="unwatched">Unwatched</option>
                            </select>
                        </div>

                        <ul className={styles.episodeList}>
                            {filteredEpisodes.map((ep) => {
                                const mapped = mapEpisode(ep, showId);
                                return username ? (
                                    <EpisodeItem
                                        key={mapped.id}
                                        episode={mapped}
                                        username={username}
                                        show={{
                                            id: show.id,
                                            name: show.name,
                                            image: show.image ? { medium: show.image.medium } : undefined,
                                        }}
                                    />
                                ) : (
                                    <li key={mapped.id}>
                                        <span>Please log in</span>
                                    </li>
                                );
                            })}
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
