import "./footer.scss";

export const Footer = () => {
  return (
    <>
      <footer className="footer">
        <img
          src="/img/bg/footer.svg"
          alt="Reviever's footer logo"
          className="footer__logo"
        />
        <h4>@{new Date().getFullYear()} Reviever. All rights reserved.</h4>
      </footer>
    </>
  );
};
