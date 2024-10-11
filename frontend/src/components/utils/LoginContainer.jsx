const LoginContainer = ({ buttonClass, ButtonTag, children }) => {
  return (
    <ButtonTag className={ buttonClass } data-bs-toggle="modal" data-bs-target="#staticBackdrop">
      { children }
    </ButtonTag>
  )
}

export default LoginContainer