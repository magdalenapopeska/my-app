import { useState, useEffect } from "react";
import { getSchedule, searchShows, getPopularShows } from "../api/tvmaze";
import ShowCard from "../components/ShowCard";
import styles from './Home.module.css';
import { Link } from "react-router-dom";
import Modal from '../components/Modal';
import EnteringName from '../pages/EnteringName';
import modalCss from '../components/Modal.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import ReactCountryFlag from "react-country-flag";
import Skeleton from "../components/Skeleton";
import { useTheme } from "../context/ThemeContext";



const { overlay } = modalCss;

type User = {
    name: string;
    surname: string;
    subscription: 'Monthly' | 'Yearly';
};

export default function Home() {
    const {theme, toggleTheme} = useTheme();
    const [selectedGenre, setSelectedGenre] = useState<string>("All");
    const [schedule, setSchedule] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setisDropdownOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [popularShows, setPopularShows] = useState<any[]>([]);


    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setIsModalOpen(true);
        }
    }, []);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setLoading(true);
        getSchedule("US", today)
            .then(res => setSchedule(res.data))
            .catch(err => console.error(err))
            .finally(()=>setLoading(false));
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            const cached = sessionStorage.getItem(`search_${searchQuery}`);
            if(cached){
                setSearchResults(JSON.parse(cached));
                return;
            }

            try {
                setSearchLoading(true);
                const res = await searchShows(searchQuery);
                const results = res.data.map((item: any) => item.show);

                setSearchResults(results);
                sessionStorage.setItem(`search_${searchQuery}`, JSON.stringify(results));
            } catch (err) {
                console.error("Error searching shows:", err);
            } finally {
                setSearchLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    useEffect(() => {
        async function fetchPopular() {
            try {
                const res = await getPopularShows(1); // page 1
                setPopularShows(res.data);
            } catch (err) {
                console.error("Error fetching popular shows:", err);
            }
        }
        fetchPopular();
    }, []);


    const normalizedPopular = popularShows.map((show: any) => ({
        id: show.id,
        name: show.name,
        image: show.image,
        network: show.network,
        genres: show.genres || [],
    }));


    const normalizedSchedule = schedule.map((item: any) => ({
        id: item.show.id,
        name: item.show.name,
        image: item.show.image,
        network: item.show.network,
        genres: item.show.genres,
    }));

    const uniqueSchedule = Array.from(
        new Map(normalizedSchedule.map(show => [show.id, show])).values()
    );

    const normalizedSearchResults = searchResults.map((show: any) => ({
        id: show.id,
        name: show.name,
        image: show.image,
        network: show.network,
        genres: show.genres || [],
    }));

    const activeData = searchQuery.trim()
        ? Array.from(
            new Map(
                [
                    ...normalizedSearchResults,
                    ...uniqueSchedule.filter(show =>
                        show.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
                    )
                ].map(show => [show.id, show])
            ).values()
        )
        : uniqueSchedule;

    const filteredShows = activeData.filter(show =>
        selectedGenre === "All" || show.genres.includes(selectedGenre)
    );

    const genreMap: Record<string, any[]> = {};
    filteredShows.forEach(show => {
        if (show.genres.length === 0) {
            if (searchQuery.trim()) {
                if (!genreMap["Other"]) genreMap["Other"] = [];
                genreMap["Other"].push(show);
            }
        } else {
            show.genres.forEach((genre: string) => {
                if (!genreMap[genre]) genreMap[genre] = [];
                genreMap[genre].push(show);
            });
        }
    });

    const genreOptions = [
        "All",
        ...Array.from(new Set(activeData.flatMap(show => show.genres))),
    ];

    function handleUserSubmit(data: User) {
        sessionStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setIsModalOpen(false);
        setisDropdownOpen(false);
    }

    function logout() {
        sessionStorage.removeItem('user');
        setUser(null);
        setIsModalOpen(true);
    }

    function toggleLanguage() {
        const newLang = i18n.language === "en" ? "de" : "en";
        i18n.changeLanguage(newLang);
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
                        <Link to={'/watch-list'}>{t("watchList")}</Link>

                        <div className={styles.filter}>
                            <label htmlFor={"genre"}>{t("genre")}:</label>
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
                            placeholder={t("searchShows")}
                        />

                        {user && (
                            <div className={styles.userWrapper}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    onClick={() => setisDropdownOpen(!isDropdownOpen)}
                                    className={styles.userIcon}
                                />

                                {isDropdownOpen && (
                                    <div className={styles.userDropdown}>
                                        <p><strong>{t("name")}: {user.name}</strong></p>
                                        <p><strong>{t("surname")}: {user.surname}</strong></p>
                                        <p>{t("subscription")}: {user.subscription}</p>
                                        <div className={styles.edit}>
                                            <Link to={"/account"}>{t("editProfile")}</Link>
                                        </div>
                                        <div className={styles.logout}>
                                            <button onClick={logout}>{t("logout")}</button>
                                            <button onClick={toggleTheme} style={{paddingLeft: "20px"}}>
                                                {theme === "light" ? "Dark🌙" : "Light☀️"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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
                </div>
                {loading || searchLoading ? (
                        <div style={{ padding: "20px" }}>
                            <Skeleton width="200px" height="30px" />
                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} width="150px" height="225px" borderRadius="8px" />
                                ))}
                            </div>
                        </div>
                    ) : activeData.length === 0 ? (
                    <div className={styles.noShows}>
                        <p>{t("noShows")}</p>
                    </div>
                ) : (
                    <>
                        {searchQuery.trim() === "" && selectedGenre === "All" && (
                            <div style={{ width: "100%", padding: "25px" }}>
                                <h2>{t("todaysSchedule")}</h2>
                            </div>
                        )}
                        {normalizedPopular.length > 0 && (
                            <div style={{ width: "100%", padding: "25px" }}>
                                <h2>Top 10 Shows</h2>
                                <div className={styles.fullRow}>
                                    {normalizedPopular.slice(0,10).map(show => (
                                        <ShowCard
                                            key={show.id}
                                            showId={show.id}
                                            title={show.name}
                                            imgUrl={show.image?.medium}
                                            network={show.network?.name}
                                            username={user ? `${user.name}_${user.surname}_${user.subscription}` : undefined}
                                            showStatus={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}


                        {Object.keys(genreMap)
                            .filter(genre => selectedGenre === "All" || genre === selectedGenre)
                            .map((genre) => (
                                <div key={genre} style={{ width: "100%", padding: "30px" }}>
                                    <h3>{genre}</h3>
                                    <div className={selectedGenre === genre ? styles.fullRow : styles.row}>
                                        {genreMap[genre].map(show => (
                                            <ShowCard
                                                key={show.id}
                                                showId={show.id}
                                                title={show.name}
                                                imgUrl={show.image?.medium}
                                                network={show.network?.name}
                                                username={user ? `${user.name}_${user.surname}_${user.subscription}` : undefined}
                                                showStatus={false}
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
