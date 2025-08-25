import classes from "./Credentials.module.css"
import {Link} from 'react-router-dom';
type CredentialProps = {
    id: string;
    name: string;
    surname: string;
    subscription: 'Monthly' | 'Yearly';
}
function Credentials ({id, name, surname, subscription}: CredentialProps){
    return (
        <div className={classes.credential}>
            <Link to={id}>
                <p className={classes.name}>Name: {name}</p>
                <p className={classes.name}>Surname: {surname}</p>
                <p className={classes.text}>Subscription: {subscription}</p>
            </Link>
        </div>
    )
}

export default Credentials;