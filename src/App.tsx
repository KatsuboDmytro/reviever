import { Navigate, Outlet } from "react-router";
import { Footer, Header } from "./modules";
import { useAppSelector } from "./app/hooks";

export const App = () => {
  const { authors } = useAppSelector((state) => state.authors);

  if (authors === null) {
    return <Navigate to="/auth/sign-in" />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
