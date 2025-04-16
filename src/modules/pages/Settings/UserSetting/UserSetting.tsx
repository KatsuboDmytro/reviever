import { UserAccount } from "./components/UserAccount";
import { UserInfo } from "./components/UserInfo";
import "./userSetting.scss";

export const UserSetting = () => {

  return (
    <section className="user">
      <UserInfo />
      <UserAccount />
    </section>
  );
};
