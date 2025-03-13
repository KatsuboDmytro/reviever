import { SignIn } from "@clerk/clerk-react";

import "./signIn.scss";

export const SignInPage = () => {
  return (
    <div className="signIn">
      <SignIn />
    </div>
  );
};
