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
export async function loader (){
    const response = await fetch('http://localhost:8080/posts');
    const restData = await response.json();
    return restData.posts;
}
