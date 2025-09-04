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

    const username = parsedUser
        ? `${parsedUser.name}_${parsedUser.surname}_${parsedUser.subscription}`
        : null;

    const [enrichedShows, setEnrichedShows] = useState<any[]>([]);
    const [filter, setFilter] = useState<"all" | "watched" | "planned">("all");

    const { t } = useTranslation();


    useEffect(() => {
        async function enrichWatchlist() {
            if (!username) return;

            const raw = getWatchList(username);

            const updated = await Promise.all(
                raw.map(async (show: any) => {
                    if (!show.genres || show.genres.length === 0) {
                        try {
                            const res = await fetch(`https://api.tvmaze.com/shows/${show.showId}`);
                            const fullShow = await res.json();
                            return { ...show, genres: fullShow.genres ?? [] };
                        } catch (e) {
                            console.error("Failed to fetch genres for show:", show.showId, e);
                            return { ...show, genres: ["Other"] };
                        }
                    }
                    return show;
                })
            );

            localStorage.setItem(`watchlist_${username}`, JSON.stringify(updated));
            setEnrichedShows(updated);
        }

        enrichWatchlist();
    }, [username]);

    const filteredShows = enrichedShows.filter(show => {
        if (filter === "all") return true;
        return show.episodes?.some((e: any) => e.status === filter);
    });

    const showsByGenre: Record<string, any[]> = {};
    filteredShows.forEach((show: any) => {
        (show.genres ?? ["Other"]).forEach((genre: string) => {
            if (!showsByGenre[genre]) {
                showsByGenre[genre] = [];
            }
            showsByGenre[genre].push(show);
        });
    });

    function toggleLanguage() {
        const newLang = i18n.language === "en" ? "de" : "en";
        i18n.changeLanguage(newLang);
    }

    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>
                    <div className={classes.navbar}>

            <div className={classes.backHome}>
                <Link to="/">{t("backToHome")}</Link>
            </div>

                <div className={classes.filter}>
                    <select
                        id="status"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                    >
                        <option value="all">{t("all")}</option>
                        <option value="watched">{t("watched")}</option>
                        <option value="planned">{t("planned")}</option>
                    </select>
                </div>
                    </div>
            <div
                onClick={toggleLanguage}
                style={{ cursor: "pointer", marginLeft: "10px", fontSize: "22px" }}
            >
                {i18n.language === "en" ? (
                    <ReactCountryFlag countryCode="DE" svg style={{ width: "1em", height: "0.5em", marginBottom: "7px" }} />
                ) : (
                    <ReactCountryFlag countryCode="GB" svg style={{ width: "1em", height: "0.5em", marginBottom: "7px" }} />
                )}
            </div>

            </div>

            <div className={classes.title}>
                <h2>{t("yourWatchList")}</h2>
            </div>



            <div className={classes.genreSection}>
                {Object.entries(showsByGenre).map(([genre, shows]) => (
                    <div key={genre} className={classes.genreSelection}>
                        <h3 className={classes.genreTitle}>{genre}</h3>
                        <div className={classes.watchListGrid}>
                            {shows.map((show: any) => (
                                <div key={show.showId} className="cardWrapper">
                                    <ShowCard
                                        showId={show.showId}
                                        imgUrl={show.image}
                                        title={show.name}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </>
    );
}
