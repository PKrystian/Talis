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
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row align-items-bottom">
          <div className="col-md-4 d-flex flex-column justify-content-between">
            <div>
              <Link className="navbar-brand d-flex align-items-center" to="/">
                <span className="site-name text-light me-2">Talis</span>
                <img
                  src="/static/logo512.png"
                  alt="Logo"
                  className="navbar-logo me-2"
                />
              </Link>
              <p>Board Game Helper</p>
            </div>
            <Link to="/policy" className="align-self-start text-light">
              Privacy Policy
            </Link>
          </div>
          <div className="col-md-4 d-flex justify-content-center align-items-end">
            <p className="mb-0 text-light">
              Powered by{' '}
              <a
                href="https://boardgamegeek.com/wiki/page/BGG_XML_API2"
                target="_blank"
                rel="noopener noreferrer"
              >
                BoardGameGeek
              </a>
            </p>
          </div>
          <div className="col-md-4 d-flex flex-column justify-content-between align-items-end">
            <p className="mb-2">This project is part of engineering thesis.</p>
            <p className="mb-0 text-light">
              &copy; 2024 - {currentYear} Talis.{' '}
              <Link to="/license">MIT License</Link>
            </p>
          </div>
        </div>
      </div>
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="btn-top jump-to-top"
          aria-label="Move to top"
        >
          <GoMoveToTop />
        </button>
      )}
    </footer>
  );
};

export default Footer;
