import { Outlet } from "react-router-dom";
import { Fragment } from "react";
import { Header } from "./Header";

export const MainLayout = () => {
  return (
    <Fragment>
      <Header />
      <Outlet />
    </Fragment>
  );
};
