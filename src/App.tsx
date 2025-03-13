import { Navigate, Outlet } from "react-router";

import { useUser } from "@clerk/clerk-react";

import { Header } from "./modules";

export const App = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isSignedIn && isLoaded) {
    return <Navigate to="/auth/sign-in" />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
