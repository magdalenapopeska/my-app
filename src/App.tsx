import {createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom";
import Home from "./pages/Home";
import ShowDetails from "./pages/ShowDetails";
import WatchList from "./pages/WatchList";
import Account from "./pages/Account";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route
                index
                element={<Home key={sessionStorage.getItem("user") ? "logged" : "no-user"} />}
            />
            <Route path="watch-list" element={<WatchList />} />
            <Route path="show-details" element={<ShowDetails />} />
            <Route
                path="account"
                element={<Account  />}
            />
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;



