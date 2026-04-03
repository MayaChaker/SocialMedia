import "./Footer.css";

function Footer() {
  return (
    <footer className="appFooter">
      <div className="appFooterInner">
        <div className="appFooterBrand">Taskora</div>
        <div className="appFooterCopy">
          © {new Date().getFullYear()} Taskora
        </div>
      </div>
    </footer>
  );
}

export default Footer;
