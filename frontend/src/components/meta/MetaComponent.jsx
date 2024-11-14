import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const MetaComponent = ({ title, description, canonical = '' }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`http://talis.live/${canonical}`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`http://talis.live/${canonical}`} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

MetaComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  canonical: PropTypes.string,
};

export default MetaComponent;
