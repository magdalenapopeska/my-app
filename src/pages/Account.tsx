import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from './Account.module.css';
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

    return (
        <>
            <div className={classes.buttons}>
                <div className={classes.backHome}>
                    <a href="/">Back to Home</a>
                </div>
                <div className={classes.logout}>
                    <button onClick={logout}>Log Out</button>
                </div>
            </div>
            <div className={classes.container}>
                <h1>Edit your profile</h1>
                <div className={classes.image}>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSez5Hhwz8qtjcctv1WFL6Td8NVdHUtSw12hw&s"
                        alt="Profile"
                    />
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className={classes.form}>
                        <p>
                            <label htmlFor="name">Your name</label>
                            <input
                                type="text"
                                id="name"
                                name="yourName"
                                defaultValue={user.name}
                                required
                            />
                        </p>
                        <p>
                            <label htmlFor="surname">Your surname</label>
                            <input
                                type="text"
                                id="surname"
                                name="yourSurname"
                                defaultValue={user.surname}
                                required
                            />
                        </p>
                        <p>
                            <label htmlFor="subscription">Your subscription</label><br />
                            <select
                                className={classes.subscriptions}
                                id="subscription"
                                name="subscription"
                                defaultValue={user.subscription}
                                required
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </p>
                        <div className={classes.logout}>
                            <button>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}