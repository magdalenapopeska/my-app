import { useEffect, useState } from "react";
import ShowCard from "../components/ShowCard";
import classes from "./WatchList.module.css";
import { getWatchList } from "../utils/watchList";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import ReactCountryFlag from "react-country-flag";

export default function WatchList() {
    const storedUser = sessionStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const username = parsedUser ? `${parsedUser.name}_${parsedUser.surname}_${parsedUser.subscription}` : null;

    const [enrichedShows, setEnrichedShows] = useState<any[]>([]);
    const [nextEpisodes, setNextEpisodes] = useState<Record<number, any>>({});
    const [filter, setFilter] = useState<"all" | "watched" | "planned">("all");
    const { t } = useTranslation();

    useEffect(() => {
        async function enrichWatchlist() {
            if (!username) return;
            const raw = getWatchList(username);

            const updated = await Promise.all(
                raw.map(async (show: any) => {
                    const filteredEpisodes = (show.episodes ?? []).filter(
                        (ep: any) => ep.status === "watched" || ep.status === "planned"
                    );

                    if (!show.genres || show.genres.length === 0) {
                        try {
                            const res = await fetch(`https://api.tvmaze.com/shows/${show.showId}`);
                            const fullShow = await res.json();
                            return { ...show, genres: fullShow.genres ?? [], episodes: filteredEpisodes };
                        } catch {
                            return { ...show, genres: ["Other"], episodes: filteredEpisodes };
                        }
                    }

                    return { ...show, episodes: filteredEpisodes };
                })
            );

            localStorage.setItem(`watchlist_${username}`, JSON.stringify(updated));
            setEnrichedShows(updated);
        }
        enrichWatchlist();
    }, [username]);

    useEffect(() => {
        async function fetchNextEpisodes() {
            const nextEpMap: Record<number, any> = {};
            for (const show of enrichedShows) {
                const nextEp = await getNextEpisodeFromAPI(show.showId, show.episodes);
                if (nextEp) nextEpMap[show.showId] = nextEp;
            }
            setNextEpisodes(nextEpMap);
        }
        fetchNextEpisodes();
    }, [enrichedShows]);

    async function getNextEpisodeFromAPI(showId: number, watchedEpisodes: any[]) {
        try {
            const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
            const episodes = await res.json();

            const sorted = episodes.sort((a: any, b: any) =>
                a.season === b.season ? a.number - b.number : a.season - b.season
            );

            return sorted.find((ep: { season: number; number: number }) =>
                !watchedEpisodes.some(w => w.season === ep.season && w.number === ep.number)
            ) || null;
        } catch (e) {
            console.error("Failed to fetch next episode", e);
            return null;
        }
    }

    const filteredShows = enrichedShows.filter(show => {
        if (filter === "all") return true;
        return show.episodes?.some((e: any) => e.status === filter);
    });

    const showsByGenre: Record<string, any[]> = {};
    filteredShows.forEach((show: any) => {
        (show.genres ?? ["Other"]).forEach((genre: string) => {
            if (!showsByGenre[genre]) showsByGenre[genre] = [];
            showsByGenre[genre].push(show);
        });
    });

    function toggleLanguage() {
        i18n.changeLanguage(i18n.language === "en" ? "de" : "en");
    }

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <div className={classes.navbar}>
                    <div className={classes.backHome}><Link to="/">{t("backToHome")}</Link></div>
                    <div className={classes.filter}>
                        <select value={filter} onChange={e => setFilter(e.target.value as any)}>
                            <option value="all">{t("all")}</option>
                            <option value="watched">{t("watched")}</option>
                            <option value="planned">{t("planned")}</option>
                        </select>
                    </div>
                </div>
                <div onClick={toggleLanguage} style={{ cursor: "pointer", marginLeft: "10px", fontSize: "22px" }}>
                    {i18n.language === "en" ? (
                        <ReactCountryFlag countryCode="DE" svg style={{ width: "1em", height: "0.5em", marginBottom: "7px" }} />
                    ) : (
                        <ReactCountryFlag countryCode="GB" svg style={{ width: "1em", height: "0.5em", marginBottom: "7px" }} />
                    )}
                </div>
            </div>

            <div className={classes.title}><h2>{t("yourWatchList")}</h2></div>

            <div className={classes.nextEpisodes}>
                <h3>{t("nextEpisodes")}</h3>
                <div className={classes.nextRowWrapper}>
                    <div className={classes.nextRow}>
                        {filteredShows.map(show => {
                            const nextEp = nextEpisodes[show.showId];
                            if (!nextEp) return null;

                            const isFuture = new Date(nextEp.airdate) > new Date();

                            return (
                                <div key={show.showId} className={classes.nextCard}>
                                    <img src={show.image} alt={show.name} className={classes.nextPoster} />
                                    <div className={classes.nextDetails}>
                                        <h3>{show.name}</h3>
                                        <p className={classes.episodeTitle}>Next: S{nextEp.season}E{nextEp.number} — {nextEp.name}</p>
                                        <p className={classes.episodeInfo}>
                                            {isFuture ? `Airs on ${nextEp.airdate}` : t("readyToWatch")}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className={classes.genreSection}>
                {Object.entries(showsByGenre).map(([genre, shows]) => (
                    <div key={genre}>
                        <h3 className={classes.genreTitle}>{genre}</h3>
                        <div className={classes.watchListGrid}>
                            {shows.map(show => (
                                <ShowCard key={show.showId} showId={show.showId} imgUrl={show.image} title={show.name} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
