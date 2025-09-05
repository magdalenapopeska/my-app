import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from './Account.module.css';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import ReactCountryFlag from "react-country-flag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

type UserData = {
    name: string;
    surname: string;
    subscription: "Monthly" | "Yearly";
    watchList: any[];
};
export default function Account() {
    const navigate = useNavigate();
    const storedUser = sessionStorage.getItem('user');
    const initialUser: UserData | null = storedUser ? JSON.parse(storedUser) : null;
    const [user, setUser] = useState<UserData | null>(initialUser);

    const { t } = useTranslation();

    if (!user) return <p>No user logged in</p>;
    function logout() {
        sessionStorage.removeItem('user');
        navigate("/");
    }
    function handleSubmit(data: { name: string; surname: string; subscription: "Monthly" | "Yearly" }) {
        if (!user) return;
        const oldKey = `user_${user.name}_${user.subscription}`;
        const storedOldUser = localStorage.getItem(oldKey);
        const oldUserData = storedOldUser
            ? JSON.parse(storedOldUser)
            : { watchList: [], episodesPlanned: [], episodesWatched: [] };
        const newKey = `user_${data.name}_${data.subscription}`;
        const updatedUser = {
            ...oldUserData,
            ...data,
        };
        localStorage.setItem(newKey, JSON.stringify(updatedUser));
        if (oldKey !== newKey) {
            localStorage.removeItem(oldKey);
        }
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        navigate("/");
    }
    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("yourName") as string;
        const surname = formData.get("yourSurname") as string;
        const subscription = formData.get("subscription") as "Monthly" | "Yearly";
        if (!name || !surname || !subscription) return;
        handleSubmit({ name, surname, subscription });
    }

    function toggleLanguage() {
        const newLang = i18n.language === "en" ? "de" : "en";
        i18n.changeLanguage(newLang);
    }

    return (
        <>
            <div className={classes.header}>

            <div className={classes.navbar}>

            <div className={classes.buttons}>
                <div className={classes.backHome}>
                    <a href="/">{t("backToHome")}</a>
                </div>
                <div className={classes.logout}>
                    <button onClick={logout}>{t("logout")}</button>
                </div>
            </div>

            </div>

            <div
                onClick={toggleLanguage}
                style={{ cursor: "pointer", marginLeft: "10px", fontSize: "22px", gap: "10px" }}
            >
                {i18n.language === "en" ? (
                    <ReactCountryFlag countryCode="DE" svg style={{ width: "1em", height: "0.5em", marginBottom: "7px" }} />
                ) : (
                    <ReactCountryFlag countryCode="GB" svg style={{ width: "1em", height: "0.5em", marginBottom: "7px" }} />
                )}
            </div>

            </div>

            <div className={classes.container}>
                <h1>{t("editYourProfile")}</h1>
                <div className={classes.image}>
                    <FontAwesomeIcon
                        icon={faUser}
                        className={classes.userIcon}
                    />

                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className={classes.form}>
                        <p>
                            <label htmlFor="name">{t("yourName")}</label>
                            <input
                                type="text"
                                id="name"
                                name="yourName"
                                defaultValue={user.name}
                                required
                            />
                        </p>
                        <p>
                            <label htmlFor="surname">{t("yourSurname")}</label>
                            <input
                                type="text"
                                id="surname"
                                name="yourSurname"
                                defaultValue={user.surname}
                                required
                            />
                        </p>
                        <p>
                            <label htmlFor="subscription">{t("yourSubscription")}</label><br />
                            <select
                                className={classes.subscriptions}
                                id="subscription"
                                name="subscription"
                                defaultValue={user.subscription}
                                required
                            >
                                <option value="Monthly">{t("monthly")}</option>
                                <option value="Yearly">{t("yearly")}</option>
                            </select>
                        </p>
                        <div className={classes.logout}>
                            <button>{t("save")}</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}