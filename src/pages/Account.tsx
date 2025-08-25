import Credentials from "../components/Credentials";
import classes from './Account.module.css';
import {useNavigate} from "react-router-dom";
export default function Account() {
    const navigate = useNavigate();
    const storedUser = sessionStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) return <p>No user logged in</p>;

    function logout() {
        sessionStorage.removeItem('user');
        navigate("/");
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
