import { createBrowserRouter } from "react-router-dom";
import Users from "./pages/Users/Users";
import CreateUser from "./pages/CreateUser/CreateUser";
import UserDetails from "./pages/UserDetails/UserDetails";
import Layout from "./components/Layout";
import TasksList from "./pages/TasksList/TasksList";
import TaskCreate from "./pages/TaskCreate/TaskCreate";
import TaskDetails from "./pages/TaskDetails/TaskDetails";

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
            },
            {
                path: "tasks",
                element: <TasksList />,
            },
            {
                path: "tasks/create",
                element: <TaskCreate />,
            },
            {
                path: "tasks/:id",
                element: <TaskDetails />
            }
        ]
    },
]);

export default router;