import {Outlet} from 'react-router-dom';
import Account from "./Account";
function User() {
    return (
        <>
            <Outlet/>
            <main>
                <Account />
            </main>
        </>);
}

export default User;

