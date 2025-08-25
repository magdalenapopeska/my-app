import Credentials from "../components/Credentials";
import classes from './Account.module.css';
export default function Account() {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) return <p>No user logged in</p>;

    function logout() {
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    return (
        <>
            <div className={classes.buttons}>
                <div className={classes.backHome}>
                    <a href="/">Back to Home</a>
                </div>
                <div className={classes.backHome}>
                    <a href={"/"}>Log Out</a>
                </div>
            </div>

            <div className={classes.container}>
                <div className={classes.image}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSez5Hhwz8qtjcctv1WFL6Td8NVdHUtSw12hw&s" />
                </div>
                <Credentials
                    id="1"
                    name={user.name}
                    surname={user.surname}
                    subscription={user.subscription}
                />
            </div>
        </>
    );
}
