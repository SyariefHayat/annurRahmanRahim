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
import Program from './pages/program/Index'
import SlugProgram from './pages/program/Slug'
import Contact from './pages/contact/Index'
import About from './pages/about/Index'
import Profile from './pages/profile/Index'
import User from './pages/profile/User'
import EditArticle from './pages/article/Edit'
import Users from './pages/dashboard/Users'
import Articles from './pages/dashboard/Articles'
import Campaigns from './pages/dashboard/Campaigns'
import ProtectedPmRoute from './components/modules/auth/ProtectedPmRoute'
import EditCampaign from './pages/campaign/Edit'
import Comments from './pages/dashboard/Comments'
import Setting from './pages/dashboard/Setting'
import NewArticle from './pages/dashboard/NewArticle'
import UpdateArticle from './pages/dashboard/UpdateArticle'
import { ErrorBoundary, NotFound } from './pages/error/Index'
import Donors from './pages/dashboard/Donors'
import Programs from './pages/dashboard/Programs'
import CreateProgram from './pages/program/Create'
import EditProgram from './pages/program/Edit'

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
        path: "/program/sosial",
        element: <Campaign />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/program/sosial/:id",
        element: <SlugCampaign />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/program/sosial/create/:id",
        element: (
            <ProtectedRoute>
                <CreateCampaign />
            </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/program/receipt",
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
        path: "/program/bisnis",
        element: <Program />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/program/bisnis/:id",
        element: <SlugProgram />,
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
            <ProtectedPmRoute>
                <Dashboard />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/user",
        element: (
            <ProtectedPmRoute>
                <Users />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/article",
        element: (
            <ProtectedPmRoute>
                <Articles />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/article/create/:userId",
        element: (
            <ProtectedPmRoute>
                <NewArticle />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/article/edit/:articleId",
        element: (
            <ProtectedPmRoute>
                <UpdateArticle />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/program/sosial",
        element: (
            <ProtectedPmRoute>
                <Campaigns />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/program/sosial/create/:userId",
        element: (
            <ProtectedPmRoute>
                <CreateCampaign />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/program/sosial/edit/:campaignId",
        element: (
            <ProtectedPmRoute>
                <EditCampaign />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/program/bisnis",
        element: (
            <ProtectedPmRoute>
                <Programs />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/program/bisnis/create/:userId",
        element: (
            <ProtectedPmRoute>
                <CreateProgram />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/program/bisnis/edit/:programId",
        element: (
            <ProtectedPmRoute>
                <EditProgram />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/comment",
        element: (
            <ProtectedPmRoute>
                <Comments />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/donor",
        element: (
            <ProtectedPmRoute>
                <Donors />
            </ProtectedPmRoute>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: "/dashboard/setting",
        element: (
            <ProtectedPmRoute>
                <Setting />
            </ProtectedPmRoute>
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