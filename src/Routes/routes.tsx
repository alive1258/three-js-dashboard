import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main";
import Animationloop from "../components/Dashboard/Animationloop/Animationloop";
import Dashboard from "../components/Dashboard/Dashboard/Dashboard";
import Geometries from "../components/Dashboard/Geometries/Geometries";
import Camera from "../components/Dashboard/Camera/Camera";
import Materials from "../components/Dashboard/Materials/Materials";
import CommonMaterials from "../components/Dashboard/CommonMaterials/CommonMaterials";
import Lights from "../components/Dashboard/Lights/Lights";
import Object3D from "../components/Dashboard/Object3D/Object3D";
import Renderer from "../components/Dashboard/Renderer/Renderer";
import Shadows from "../components/Dashboard/Shadows/Shadows";
import EnvironmentMaps from "../components/Dashboard/EnvironmentMaps/EnvironmentMaps";

const router = createBrowserRouter([
  // admin

  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/dashboard/animationloop",
        element: <Animationloop />,
      },
      {
        path: "/dashboard/geometries",
        element: <Geometries />,
      },
      {
        path: "/dashboard/camera",
        element: <Camera />,
      },
      {
        path: "/dashboard/materials",
        element: <Materials />,
      },
      {
        path: "/dashboard/common-materials",
        element: <CommonMaterials />,
      },
      {
        path: "/dashboard/lights",
        element: <Lights />,
      },
      {
        path: "/dashboard/object-3d",
        element: <Object3D />,
      },
      {
        path: "/dashboard/object-3d-hierarchy",
        element: <Object3D />,
      },
      {
        path: "/dashboard/renderer",
        element: <Renderer />,
      },
      {
        path: "/dashboard/shadows",
        element: <Shadows />,
      },
      {
        path: "/dashboard/environment-maps",
        element: <EnvironmentMaps />,
      },
    ],
  },
]);

export default router;
