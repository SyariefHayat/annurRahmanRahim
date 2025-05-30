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
import { ErrorBoundary, NotFound } from './pages/error/Index'
import Donors from './pages/dashboard/Donors'
import Program from './pages/program/Index'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/sign-in",
        element: <SignIn />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/sign-up",
        element: <SignUp />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/campaign",
        element: <Campaign />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/campaign/:id",
        element: <SlugCampaign />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/campaign/create/:id",
        element: (
            <ProtectedRoute>
                <CreateCampaign />
            </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/campaign/receipt",
        element: <Receipt />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/article",
        element: <Article />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/article/:id",
        element: <SlugArticle />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/article/edit/:articleId",
        element: (
            <ProtectedRoute>
                <EditArticle />
            </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/article/create/:userId",
        element: (
            <ProtectedRoute>
                <CreateArticle />
            </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/program",
        element: <Program />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/contact",
        element: <Contact />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/about-us",
        element: <About />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/user/:id",
        element: <User />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/profile/:id",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedAdminRoute>
                <Dashboard />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/user",
        element: (
            <ProtectedAdminRoute>
                <Users />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/article",
        element: (
            <ProtectedAdminRoute>
                <Articles />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/article/create/:userId",
        element: (
            <ProtectedAdminRoute>
                <NewArticle />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/article/edit/:articleId",
        element: (
            <ProtectedAdminRoute>
                <UpdateArticle />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/campaign",
        element: (
            <ProtectedAdminRoute>
                <Campaigns />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/campaign/create/:userId",
        element: (
            <ProtectedAdminRoute>
                <CreateCampaign />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/campaign/edit/:campaignId",
        element: (
            <ProtectedAdminRoute>
                <EditCampaign />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/comment",
        element: (
            <ProtectedAdminRoute>
                <Comments />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/donor",
        element: (
            <ProtectedAdminRoute>
                <Donors />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/notification",
        element: (
            <ProtectedAdminRoute>
                <Notifications />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/setting",
        element: (
            <ProtectedAdminRoute>
                <Setting />
            </ProtectedAdminRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "*",
        element: <NotFound />,
    },
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>,
)