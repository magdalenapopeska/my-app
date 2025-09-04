import { useEffect, useState } from "react";
import ShowCard from "../components/ShowCard";
import classes from "./WatchList.module.css";
import { getWatchList } from "../utils/watchList";
import { Link } from "react-router-dom";

export default function WatchList() {
    const storedUser = sessionStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const username = parsedUser
        ? `${parsedUser.name}_${parsedUser.surname}_${parsedUser.subscription}`
        : null;

    const [enrichedShows, setEnrichedShows] = useState<any[]>([]);

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

    const showsByGenre: Record<string, any[]> = {};
    enrichedShows.forEach((show: any) => {
        (show.genres ?? ["Other"]).forEach((genre: string) => {
            if (!showsByGenre[genre]) {
                showsByGenre[genre] = [];
            }
            showsByGenre[genre].push(show);
        });
    });

    return (
        <>
            <div className={classes.backHome}>
                <Link to="/">Back to Home</Link>
            </div>

            <div className={classes.title}>
                <h2>Your Watch List</h2>
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
        </>
    );
}
