const LoginButton = ({ buttonClass, buttonText, ButtonTag }) => {
  return (
    <ButtonTag className={ buttonClass } data-bs-toggle="modal" data-bs-target="#staticBackdrop">
      { buttonText }
    </ButtonTag>
  )
}

export default LoginButton