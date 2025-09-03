import React from "react";
import classes from './EnteringName.module.css';

type UserForm = {
    name: string;
    surname: string;
    subscription: "Monthly" | "Yearly";
};

type EnteringNameProps = {
    onSubmitName: (data: UserForm) => void;
};

export default function EnteringName({ onSubmitName }: EnteringNameProps) {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const name = formData.get("yourName") as string;
        const surname = formData.get("yourSurname") as string;
        const subscription = formData.get("subscription") as "Monthly" | "Yearly";

        if (!name || !surname || !subscription) return;

        onSubmitName({ name, surname, subscription });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={classes.form}>
                <p>
                    <label htmlFor="name">Your name</label>
                    <input type="text" id="name" name="yourName" required />
                </p>
                <p>
                    <label htmlFor="surname">Your surname</label>
                    <input type="text" id="surname" name="yourSurname" required />
                </p>
                <p>
                    <label htmlFor="subscription">Your subscription</label><br />
                    <select className={classes.subscription} id="subscription" name="subscription" required>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </p>
                <div className={classes.actions}>
                    <button type="submit">Save</button>
                </div>
            </div>
        </form>
    );
}
