import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoMoveToTop } from 'react-icons/go';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showTopBtn, setShowTopBtn] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <footer className="footer bg-dark text-light mt-auto">
      <div className="container d-flex align-items-center">
        <div className="row justify-content-center w-100">
          <div className="col-md-4 text-center text-md-left">
            <Link className="navbar-brand" to="/">
              <div className="align-items-center">
                <img
                  src="/static/favicon.ico"
                  alt="Logo"
                  className="navbar-logo me-2"
                />
                <span className="site-name">Talis</span>
                <span className="wip-badge ms-2">WIP</span>
              </div>
            </Link>
            <p className="mt-2">Board Game Helper</p>
          </div>
          <div className="col-md-4 text-center my-2 my-md-0">
            <Link to="/policy" className="text-light">
              Privacy Policy
            </Link>
            <p className="mt-2">
              Powered by{' '}
              <a
                href="https://boardgamegeek.com/wiki/page/BGG_XML_API2"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                BoardGameGeek
              </a>
            </p>
          </div>
          <div className="col-md-4 text-center text-md-right">
            <p>This project is part of engineering thesis.</p>
            <p>
              &copy; 2024 - {currentYear} Talis.{' '}
              <Link to="/license">MIT License</Link>
            </p>
          </div>
        </div>
      </div>
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="btn btn-light btn-sm jump-to-top"
        >
          <GoMoveToTop />
        </button>
      )}
    </footer>
  );
};

export default Footer;
