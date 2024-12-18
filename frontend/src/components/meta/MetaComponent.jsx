import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import './MetaComponent.css';

const MetaComponent = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

MetaComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default MetaComponent;
