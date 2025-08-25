import { useState, useEffect } from "react";
import { getSchedule } from "../api/tvmaze";
import ShowCard from "../components/ShowCard";
import styles from './Home.module.css';
import { Link, useNavigate } from "react-router-dom";
import Modal from '../components/Modal';
import EnteringName from '../pages/EnteringName';

type User = {
    name: string;
    surname: string;
    subscription: 'Monthly' | 'Yearly';
};

export default function Home() {
    const [schedule, setSchedule] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

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

    const genreMap: Record<string, any[]> = {};
    schedule.forEach(item => {
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
                    </div>

                    <div className={styles.search}>
                        <input type="search" />
                        <button>Search</button>
                    </div>
                </div>

                <h2>Today’s TV Schedule</h2>

                {schedule.length === 0 ? (
                    <p>Loading shows...</p>
                ) : (
                    <>
                        {Object.keys(genreMap).map(genre => (
                            <div key={genre}>
                                <h2>{genre}</h2>
                                <div className={styles.row}>
                                    {genreMap[genre].map(item => (
                                        <ShowCard
                                            key={item.id}
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
