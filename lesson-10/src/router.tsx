import { createBrowserRouter } from "react-router-dom";
import Users from "./pages/Users/Users";
import CreateUser from "./pages/CreateUser/CreateUser";
import UserDetails from "./pages/UserDetails/UserDetails";
import Layout from "./components/Layout";
import TaskCreate from "./pages/TaskCreate/TaskCreate";
import TaskDetails from "./pages/TaskDetails/TaskDetails";
import KanbanBoard from "./pages/KanbanBoard/KanbanBoard";
import Posts from "./pages/Posts/Posts";
import PostCreate from "./pages/PostCreate/PostCreate";
import PostDetails from "./pages/PostDetails/PostDetails";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <KanbanBoard />,
            },
            {
                path: "board",
                element: <KanbanBoard />,
            },
            {
                path: "board/create",
                element: <TaskCreate />,
            },
            {
                path: "board/:id",
                element: <TaskDetails />
            },
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
                path: "posts",
                element: <Posts />,
            },
            {
                path: "posts/create",
                element: <PostCreate />,
            },
            {
                path: "posts/:id",
                element: <PostDetails />
            }
        ]
    },
]);

export default router;