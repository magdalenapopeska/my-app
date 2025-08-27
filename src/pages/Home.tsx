import { useState, useEffect } from "react";
import { getSchedule } from "../api/tvmaze";
import ShowCard from "../components/ShowCard";
import styles from './Home.module.css';
import { Link, useNavigate } from "react-router-dom";
import Modal from '../components/Modal';
import EnteringName from '../pages/EnteringName';
import { overlay } from '../components/Modal.module.css';

type User = {
    name: string;
    surname: string;
    subscription: 'Monthly' | 'Yearly';
};

export default function Home() {
    const [selectedGenre, setSelectedGenre] = useState<string>("All");
    const [schedule, setSchedule] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const genres = Array.from(new Set(schedule.flatMap(item => item.show.genres)));
    const genreOptions = ["All", ...genres];

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            setIsModalOpen(true);
        }
    }, []);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        getSchedule("US", today)
            .then(res => setSchedule(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredSchedule = schedule.filter(item =>
        searchQuery.trim() === "" || item.show.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    const genreMap: Record<string, any[]> = {};
    filteredSchedule.forEach(item => {
        item.show.genres.forEach(genre => {
            if (!genreMap[genre]) genreMap[genre] = [];
            genreMap[genre].push(item);
        });
    });

    function handleUserSubmit(data: User) {
        sessionStorage.setItem("user", JSON.stringify(data));
        setIsModalOpen(false);
        navigate("/account");
    }

    return (
        <>
            {isModalOpen && <div className={overlay} />}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <EnteringName onSubmitName={handleUserSubmit} />
                </Modal>
            )}

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.navbar}>
                        <Link to={'/account'}>Account</Link>
                        <Link to={'/watch-list'}>Watch List</Link>

                        <div className={styles.filter}>
                            <label htmlFor={"genre"}>Genre:</label>
                            <select
                                id="genre"
                                value={selectedGenre}
                                onChange={e => setSelectedGenre(e.target.value)}
                            >
                                {genreOptions.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.search}>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={"Search shows"}
                        />
                        <button onClick={() => console.log("Searching for:", searchQuery)}>Search</button>
                    </div>
                </div>

                {schedule.length === 0 ? (
                    <p>Loading shows...</p>
                ) : (
                    <>
                        {selectedGenre === "All" && (
                            <div style={{ width: "100%", marginBottom: "1rem" }}>
                                <h2>Today’s TV Schedule</h2>
                            </div>
                        )}

                        {Object.keys(genreMap)
                            .filter(genre => selectedGenre === "All" || genre === selectedGenre)
                            .map((genre) => (
                                <div key={genre} style={{ width: "100%" }}>
                                     <h3>{genre}</h3>

                                    <div className={selectedGenre === genre ? styles.fullRow : styles.row}>
                                        {genreMap[genre].map(item => (
                                            <ShowCard
                                                key={item.id}
                                                showId={item.show.id}
                                                title={item.show.name}
                                                imgUrl={item.show.image?.medium}
                                                network={item.show.network?.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </>
                )}
            </div>
        </>
    );
}
