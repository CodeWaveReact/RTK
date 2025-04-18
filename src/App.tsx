import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { MainLayout } from "./layout/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { Crud } from "./pages/crud";
import InfiniteScroll from "./pages/infinite-scroll";
import ButtonClickGetData from "./pages/button-click-getData";
import SinglePagination from "./pages/single-pagination";
import DynamicPaginate from "./pages/dynamic-paginate";
import { store } from "./redux/store";
import LoginPage from './pages/login-page';
import ProtectedRoute from './components/ProtectedRoute';

// Create a router
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/crud",
            element: <Crud />,
          },
          {
            path: "/infinite-scroll",
            element: <InfiniteScroll />,
          },
          {
            path: "/button-click-get-data",
            element: <ButtonClickGetData />,
          },
          {
            path: "/single-pagination",
            element: <SinglePagination />,
          },
          {
            path: "/dynamic-paginate",
            element: <DynamicPaginate />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 5,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
