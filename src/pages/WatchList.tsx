import {Link} from 'react-router-dom'
import classes from "./WatchList.module.css";
export default function WatchList(){
    return (
        <div className={classes.backHome}>
            <Link to={'/'}>Back to Home</Link>
        </div>
    )

};
