import MetaComponent from './meta/MetaComponent';
import './PolicyPage.css';

const PolicyPage = () => {
  return (
    <div>
      <div className="policy-container">
        <MetaComponent
          title="Talis Policy"
          description="View our website policy"
          canonical="policy"
        />
        <h2 id="policy-content" className="policy-header">
          Policy Rules
        </h2>
        <p className="policy-paragraph">
          We are committed to protecting your privacy. This policy outlines the
          types of personal information we collect, how we use it, and the steps
          we take to ensure it is protected.
        </p>
        <p className="policy-paragraph">
          <strong>Information Collection:</strong> We collect information you
          provide directly to us, such as when you create an account, update
          your profile, or use our services. This may include your name, email
          address, and other contact information.
        </p>
        <p className="policy-paragraph">
          <strong>Use of Information:</strong> We use the information we collect
          to provide, maintain, and improve our services, to communicate with
          you, and to personalize your experience.
        </p>
        <p className="policy-paragraph">
          <strong>Information Sharing:</strong> We do not share your personal
          information with third parties except as necessary to provide our
          services, comply with the law, or protect our rights.
        </p>
        <p className="policy-paragraph">
          <strong>Data Security:</strong> We implement a variety of security
          measures to maintain the safety of your personal information. However,
          no method of transmission over the Internet or electronic storage is
          100% secure.
        </p>
        <p className="policy-paragraph">
          <strong>Changes to This Policy:</strong> We may update this policy
          from time to time. We will notify you of any changes by posting the
          new policy on our website.
        </p>
        <p className="policy-paragraph">
          <strong>Contact Us:</strong> If you have any questions about this
          policy, please contact us at talis.noreply@gmail.com.
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
