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

    const watchList = username ? getWatchList(username) : [];

    return (
        <>
            <div className={classes.backHome}>
                <Link to="/">Back to Home</Link>
            </div>

            <div className={classes.watchListGrid}>
                {watchList
                    .filter((show: any) =>
                        (show.episodes ?? []).some((ep: any) => ep.status === "watched")
                    )
                    .map((show: any) => (
                        <div key={show.showId} className="cardWrapper">
                            <ShowCard
                                showId={show.showId}
                                imgUrl={show.image}
                                title={show.name}
                            />
                        </div>
                    ))}
            </div>
        </>
    );
}
