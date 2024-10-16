import PropTypes from 'prop-types';

const LoginContainer = ({ buttonClass, ButtonTag, children }) => {
  return (
    <ButtonTag
      className={buttonClass}
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
    >
      {children}
    </ButtonTag>
  );
};

LoginContainer.propTypes = {
  buttonClass: PropTypes.string.isRequired,
  ButtonTag: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}.isRequired;

export default LoginContainer;
