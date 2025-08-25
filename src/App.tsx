import {createBrowserRouter, createRoutesFromElements, RouterProvider, Route, redirect} from "react-router-dom";
import Home from "./pages/Home";
import ShowDetails from "./pages/ShowDetails";
import WatchList from "./pages/WatchList";
import Account from "./pages/Account";

async function homeAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const name = formData.get("yourName");
    const surname = formData.get("yourSurname");
    const subscription = formData.get("subscription");

    await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, subscription }),
    });

    return redirect("/account");
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<Home />} action={homeAction} />
            <Route path="watch-list" element={<WatchList />} />
            <Route path="show-details" element={<ShowDetails />} />
            <Route
                path="account"
                element={<Account id={"1"} name="John" surname="Johnnnn" subscription="Monthly" />}
            />

        </Route>
    )
);



function App() {
    return <RouterProvider router={router} />;
}

export default App;



