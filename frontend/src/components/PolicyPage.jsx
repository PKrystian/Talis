import './PolicyPage.css';

const PolicyPage = () => {
  return (
    <div>
      <div className="policy-container">
        <h2 id="policy-content" className="policy-header">
          Policy Rules
        </h2>
        <p className="policy-paragraph">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Sed ut
          perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
          inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
          ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Sed ut
          perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
          inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
          ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Sed ut
          perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
          inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo.
        </p>
      </div>
      <div className="policy-container">
        <h2 id="cookie-content" className="policy-header">
          Cookie Policy
        </h2>
        <p className="policy-paragraph">
          We use cookies solely to enhance your experience on our website. Our
          cookies are used for user authentication during login and registration
          processes, as well as for saving preferences related to board games.
        </p>
        <p className="policy-paragraph">
          Here are the types of cookies we use:
        </p>
        <ul className="policy-list">
          <li>
            <strong>Essential Cookies:</strong> Necessary for the website to
            function, such as cookies for user authentication and preferences.
          </li>
          <li>
            <strong>Session Cookies:</strong> Temporary cookies that are deleted
            when you close your browser. These help maintain your session while
            navigating the site.
          </li>
        </ul>
        <p className="policy-paragraph">
          You can manage your cookie preferences through your browser settings.
          However, please note that disabling cookies may affect your ability to
          use certain features of our website.
        </p>
      </div>
    </div>
  );
};

export default PolicyPage;
