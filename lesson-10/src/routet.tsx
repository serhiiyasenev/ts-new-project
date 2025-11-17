import { createBrowserRouter } from "react-router-dom";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import UserDetails from "./pages/UserDetails";
import Layout from "./components/Layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "users",
                element: <Users />,
            },
            {
                path: "users/create",
                element: <CreateUser />,
            },
            {
                path: "users/:id",
                element: <UserDetails />
            }
        ]
    },
]);

export default router;