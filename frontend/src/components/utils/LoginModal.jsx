import { useEffect, useState } from "react"
import FormConstants from "../../FormConstants"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./LoginModal.css"

const LoginModal = ({ apiPrefix, setUserData, userState, setUserState }) => {
  const navigate = useNavigate()

  if (userState) {
    navigate('/')
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [emailErrorStyle, setEmailErrorStyle] = useState('')
  const [passwordErrorStyle, setPasswordErrorStyle] = useState('')

  const [submitClickedOnce, setSubmitClickedOnce] = useState(false)

  const validators = [
    validateEmail,
    validatePassword
  ]

  function validateEmail() {
    if (!FormConstants.EMAIL_PATTERN.test(email)) {
      setEmailError('Email has wrong format')
      setEmailErrorStyle(' wrong-input')
      return false
    }

    setEmailError('')
    setEmailErrorStyle('')
    return true
  }

  function validatePassword() {
    if (!FormConstants.PASSWORD_PATTERN.test(password)) {
      setPasswordError('Password has wrong format')
      setPasswordErrorStyle(' wrong-input')
      return false
    }

    setPasswordError('')
    setPasswordErrorStyle('')
    return true
  }

  function handleFormOnChange(e) {
    let key = e.target.id
    let value = e.target.value

    switch (key) {
      case FormConstants.LOGIN_EMAIL_FIELD:
        setEmail(value)
        break

      case FormConstants.LOGIN_PASSWORD_FIELD:
        setPassword(value)
        break
    }
  }

  function handleSubmit() {
    setSubmitClickedOnce(true)
    let validations = []

    validators.forEach(validator => {
      validations.push(validator())
    })

    if (validations.every(v => v === true)) {
      let userLoginData = {
        [FormConstants.REGISTRATION_EMAIL_FIELD]: email,
        [FormConstants.REGISTRATION_PASSWORD_FIELD]: password,
      }

      let url = apiPrefix + 'login/'

      axios.post(
        url,
        userLoginData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
      })
      .then(resp => {
        if (resp.status === 200) {
          setUserState(resp.data.is_authenticated)
          setUserData({ 'username': resp.data.username })

          document.getElementById('quitModal').click()
          
          alert('Logged in successfully')
          navigate("/")
        }
      }).catch((error) => {
        console.error(error)
      })
    }
  }

  useEffect(() => {
    if (submitClickedOnce) {
      validators.forEach(validator => {
        validator()
      })
    }
  })

  return (
    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content backplate">
          <div className="modal-header">
            <h1 className="modal-title fs-4" id="staticBackdropLabel">Login</h1>
            <button id="quitModal" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="login-form" className="mb-4" onSubmit={ e => e.preventDefault() } noValidate>
              <div className="form-group mt-2">
                <label htmlFor={ FormConstants.LOGIN_EMAIL_FIELD } className="form-label">Email</label>
                <input id={ FormConstants.LOGIN_EMAIL_FIELD } className={ `form-control${emailErrorStyle}` } type="email" value={ email } onChange={ handleFormOnChange } required />
                { emailError && <p className='mb-0'>{ emailError }</p> }
              </div>

              <div className="form-group mt-3">
                <label htmlFor={ FormConstants.LOGIN_PASSWORD_FIELD } className="form-label">Password</label>
                <input id={ FormConstants.LOGIN_PASSWORD_FIELD } className={ `form-control${passwordErrorStyle}` } type="password" value={ password } onChange={ handleFormOnChange } required />
                { passwordError && <p className='mb-0'>{ passwordError }</p> }
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={ handleSubmit }>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal
