import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "../App";
import FormationsList from "../pages/public/FormationsList";
import FormationsDetail from "../pages/public/FormationDetail";
import FormationInscription from "../pages/public/FormationInscription";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import Notifications from "../pages/dashboard/Notifications";

import RequireAuth from "../auth/RequireAuth";
import RequireAdmin from "../auth/RequireAdmin";
import DepotBesoin from "../pages/public/DepotBesoin";
import Blogs from "../pages/dashboard/Blogs";
import FormationInscriptionList from "../pages/dashboard/FormationInscriptionList";
import Documents from "../pages/dashboard/Documents";
import Candidatures from "../pages/dashboard/Candidatures";
import Alertes from "../pages/dashboard/Alertes";
import ManageBlog from "../pages/dashboard/ManageBlog";
import Users from "../pages/dashboard/Users";
import ManageUsers from "../pages/dashboard/ManageUsers";
import Offres from "../pages/dashboard/Offres";
import ManageOffre from "../pages/dashboard/ManageOffre";
import Formations from "../pages/dashboard/Formations";
import ManageFormation from "../pages/dashboard/ManageFormation";
import Paiement from "../pages/dashboard/Paiement";
import Profile from "../pages/dashboard/Profile";
import Blog from "../pages/public/Blog";
import BlogDetail from "../pages/public/BlogDetail";
import Contact from "../pages/public/Contact";
import OffreDetail from "../pages/public/OffreDetail";
import OffresList from "../pages/public/OffresList";
import Presentation from "../pages/public/presentation";
import PublicLayout from "../layouts/PublicLayout";
import Besoin from "../pages/dashboard/Besoin";
import IsUserLogged from "../auth/IsUserLogged";
import FormationDetail from "../pages/dashboard/FormationDetail";
import ManageCategorie from "../pages/dashboard/ManageCategorie";
import DetailOffre from "../pages/dashboard/DetailOffre";
import ManageBesoin from "../pages/dashboard/ManageBesoin";
import BesoinDetail from "../pages/dashboard/BesoinDetail";
import DetailBlog from "../pages/dashboard/DetailBlog";
import DetailUsers from "../pages/dashboard/DetailUsers";

export const router = createBrowserRouter([
  
   // -------- Public -------- 
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },

      {
        path: "/formation-list",
        element: <FormationsList />,
      },
      {
        path: "/formation-detail/:id",
        element: <FormationsDetail />,
      },
      {
        path: "/formations/:id/inscription",
        element: <FormationInscription />,
      },

      {
        path: "/presentation",
        element: (<Presentation />),
      },
      {
        path: "/blog",
        element: (<Blog />),
      },
      {
        path: "/blog-detail/:id",
        element: (<BlogDetail />),
      },
      {
        path: "/contact",
        element: (<Contact />),
      },
      {
        path: "/depot-besoin",
        element: (<DepotBesoin />),
      },
      {
        path: "/offre-detail/:id",
        element: (<OffreDetail />),
      },
      {
        path: "/offres-list",
        element: (<OffresList />),
      },
    ],
  },

  // -------- AUTH --------
  {
    path: "/login",
    element: <IsUserLogged><Login /></IsUserLogged> ,
  },
  {
    path: "/register",
    element: <IsUserLogged><Register /></IsUserLogged> ,
  },

  // -------- DASHBOARD --------
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children:[
      {path: 'home', element:<Dashboard/>},
      {
      path: "/dashboard/alertes",
      element: 
          <Alertes />
      },
      {
        path: "/dashboard/candidatures",
        element: 
            <Candidatures />
      },
      {
        path: "/dashboard/documents",
        element: 
            <Documents />
      },
      {
        path: "/dashboard/formation-inscription-list",
        element: 
          <RequireAdmin>
            <FormationInscriptionList />
          </RequireAdmin>
        
      },
      {
        path: "/dashboard/blogs",
        element: 
          <RequireAdmin>
            <Blogs />
          </RequireAdmin>
        
      },
      {
        path: "/dashboard/blogs/new",
        element: 
          <RequireAdmin>
            <ManageBlog key="blogCreate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/blogs/:id/edit",
        element: 
          <RequireAdmin>
            <ManageBlog key="blogUpdate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/blogs/:id",
        element: 
          <RequireAdmin>
            <DetailBlog />
          </RequireAdmin>
      },
      {
        path: "/dashboard/users",
        element: 
          <RequireAdmin>
            <Users />
          </RequireAdmin>
      },
      {
        path: "/dashboard/users/new",
        element:
          <RequireAdmin>
            <ManageUsers key="userCreate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/users/:id/edit",
        element: 
          <RequireAdmin>
            <ManageUsers key="userUpdate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/users/:id",
        element: 
          <RequireAdmin>
            <DetailUsers key="userUpdate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/offres",
        element: 
          <RequireAdmin>
            <Offres />
          </RequireAdmin>
      },
      {
        path: "/dashboard/offres/new",
        element:
          <RequireAdmin>
            <ManageOffre key="offreCreate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/offres/:id",
        element: 
          <RequireAdmin>
            <ManageOffre key="offreUpdate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/offre/:id",
        element: 
          <RequireAdmin>
            <DetailOffre />
          </RequireAdmin>
      },
      {
        path: "/dashboard/categories/new",
        element:
          <RequireAdmin>
            <ManageCategorie key="categorieCreate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/categories/:id",
        element: 
          <RequireAdmin>
            <ManageCategorie key="categorieUpdate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/formations",
        element: 
            <Formations />

      },
      {
        path: "/dashboard/formations/new",
        element: 
          <RequireAdmin>
            <ManageFormation key="formationCreate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/formations/:id",
        element: 
          <RequireAdmin>
            <ManageFormation key="formationUpdate" />
          </RequireAdmin>
      },
      {
        path: "/dashboard/formation/:id",
        element: 
          <RequireAdmin>
            <FormationDetail />
          </RequireAdmin>
      },
      {
        path: "/dashboard/paiement",
        element: 
          <RequireAdmin>
            <Paiement />
          </RequireAdmin>
      },
      {
        path: "/dashboard/besoins",
        element: 
          <RequireAdmin>
            <Besoin />
          </RequireAdmin>
      },

      {
        path: "/dashboard/besoins/new",
        element: 
          <RequireAdmin>
            <ManageBesoin key={"createBesoin"} />
          </RequireAdmin>
      },

      {
        path: "/dashboard/besoins/:id/edit",
        element: 
          <RequireAdmin>
            <ManageBesoin key={"updateBesoin"}/>
          </RequireAdmin>
      },

      {
        path: "/dashboard/besoins/:id",
        element: 
          <RequireAdmin>
            <BesoinDetail />
          </RequireAdmin>
      },

      {
        path: "/dashboard/notifications",
        element:
          <RequireAuth>
            <Notifications />
          </RequireAuth>
      },
      {
        path: "/dashboard/profile",
        element:
          <RequireAuth>
            <Profile />
          </RequireAuth>
      },
      // -------- FALLBACK --------
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ]
  }
]);
