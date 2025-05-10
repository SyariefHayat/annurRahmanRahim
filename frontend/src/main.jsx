import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { 
    createBrowserRouter, 
    RouterProvider 
} from 'react-router-dom'

import './index.css'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import Dashboard from './pages/dashboard/Index'
import { AuthProvider } from './context/AuthContext'
import ForgotPassword from './pages/auth/ForgotPassword'
import ProtectedRoute from './components/modules/auth/ProtectedRoute'
import Home from './pages/landing/Home'
import Campaign from './pages/campaign/Index'
import SlugCampaign from './pages/campaign/Slug'
import CreateCampaign from './pages/campaign/Create'
import Receipt from './pages/campaign/Receipt'
import Article from './pages/article/Index'
import SlugArticle from './pages/article/Slug'
import CreateArticle from './pages/article/Create'
import Contact from './pages/contact/Index'
import About from './pages/about/Index'
import Profile from './pages/profile/Index'
import User from './pages/profile/User'
import EditArticle from './pages/article/Edit'
import Users from './pages/dashboard/Users'
import Articles from './pages/dashboard/Articles'
import Campaigns from './pages/dashboard/Campaigns'
import ProtectedAdminRoute from './components/modules/auth/ProtectedAdminRoute'
import EditCampaign from './pages/campaign/Edit'
import Comments from './pages/dashboard/Comments'
import Notifications from './pages/dashboard/Notifications'
import Setting from './pages/dashboard/Setting'
import NewArticle from './pages/dashboard/NewArticle'
import UpdateArticle from './pages/dashboard/UpdateArticle'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/sign-in",
        element: <SignIn />
    },
    {
        path: "/sign-up",
        element: <SignUp />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/campaign",
        element: <Campaign />
    },
    {
        path: "/campaign/:id",
        element: <SlugCampaign />
    },
    {
        path: "/campaign/create/:id",
        element: (
            <ProtectedRoute>
                <CreateCampaign />
            </ProtectedRoute>
        )
    },
    {
        path: "/campaign/receipt",
        element: <Receipt />
    },
    {
        path: "/article",
        element: <Article />
    },
    {
        path: "/article/:id",
        element: <SlugArticle />
    },
    {
        path: "/article/edit/:articleId",
        element: (
            <ProtectedRoute>
                <EditArticle />
            </ProtectedRoute>
        )
    },
    {
        path: "/article/create/:userId",
        element: (
            <ProtectedRoute>
                <CreateArticle />
            </ProtectedRoute>
        )
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "/about-us",
        element: <About />
    },
    {
        path: "/user/:id",
        element: <User />
    },
    {
        path: "/profile/:id",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedAdminRoute>
                <Dashboard />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/user",
        element: (
            <ProtectedAdminRoute>
                <Users />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/article",
        element: (
            <ProtectedAdminRoute>
                <Articles />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/article/create/:userId",
        element: (
            <ProtectedAdminRoute>
                <NewArticle />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/article/edit/:articleId",
        element: (
            <ProtectedAdminRoute>
                <UpdateArticle />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/campaign",
        element: (
            <ProtectedAdminRoute>
                <Campaigns />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/campaign/create/:userId",
        element: (
            <ProtectedAdminRoute>
                <CreateCampaign />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/campaign/edit/:campaignId",
        element: (
            <ProtectedAdminRoute>
                <EditCampaign />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/comment",
        element: (
            <ProtectedAdminRoute>
                <Comments />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/notification",
        element: (
            <ProtectedAdminRoute>
                <Notifications />
            </ProtectedAdminRoute>
        )
    },
    {
        path: "/dashboard/setting",
        element: (
            <ProtectedAdminRoute>
                <Setting />
            </ProtectedAdminRoute>
        )
    },
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>,
)