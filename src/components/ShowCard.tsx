import { Link } from "react-router-dom";
import styles from "./ShowCard.module.css";

type ShowCardProps = {
    showId: number;
    imgUrl?: string;
    title: string;
    network?: string;
    nextEpisode?: string;
};

export default function ShowCard({showId, imgUrl, title, network, nextEpisode}: ShowCardProps) {

    return (
        <Link to={`/show-details/${showId}`} className={styles.card}>
            {imgUrl && <img src={imgUrl} alt={title} />}
            <h2>{title}</h2>
            {network && <p>{network}</p>}
            {nextEpisode && <div className={styles.badge}>{nextEpisode}</div>}
        </Link>
    );
}

