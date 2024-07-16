import { Link } from 'react-router-dom';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from 'react';
import "./RegistrationPage.css"

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [termsAndConditions, setTermsAndConditions] = useState(false)

  const [isFormValid, setIsFormValid] = useState(false)

  const [submitButtonStyle, setSubmitButtonStyle] = useState("btn-outline-secondary")

  const FIRST_NAME_FIELD = "firstName"
  const LAST_NAME_FIELD = "lastName"
  const BIRTH_DATE_FIELD = "birthDate"
  const EMAIL_FIELD = "email"
  const PASSWORD_FIELD = "password"
  const REPEAT_PASSWORD_FIELD = "repeatPassword"
  const TERMS_AND_CONDITIONS_CHECKBOX = "termsAndConditions"

  const setterMap = {
    [FIRST_NAME_FIELD]: setFirstName,
    [LAST_NAME_FIELD]: setLastName,
    [BIRTH_DATE_FIELD]: setBirthDate,
    [EMAIL_FIELD]: setEmail,
    [PASSWORD_FIELD]: setPassword,
    [REPEAT_PASSWORD_FIELD]: setRepeatPassword,
    [TERMS_AND_CONDITIONS_CHECKBOX]: setTermsAndConditions,
  }

  function validateForm() {
    if (password !== repeatPassword) {
      setIsFormValid(false)
      setSubmitButtonStyle('btn-outline-secondary')
      return false
    }

    if (firstName && birthDate && email && password && repeatPassword && termsAndConditions) {
      setIsFormValid(true)
      setSubmitButtonStyle('btn-secondary')
      return true
    }

    setIsFormValid(false)
    setSubmitButtonStyle('btn-outline-secondary')
    return false
  }

  function handleFormOnChange(e) {
    let key = e.target.id
    let value = e.target.value

    if (e.target.id === TERMS_AND_CONDITIONS_CHECKBOX) {
      value = e.target.checked
    }

    setterMap[key](value)

    validateForm()
  }

  function register(e) {
    e.preventDefault()

    if (validateForm()) {
      alert("Registered!")
    }
  }

  useEffect(() => {
    validateForm()
  }, [firstName, lastName, birthDate, email, password, repeatPassword, termsAndConditions])

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="backplate">
        <div className="mt-4 mb-4 mx-5">
          <h2>Sign up</h2>
          <hr></hr>
          <form>
            <div className="form-group row mt-2">
              <div className="col">
                <label htmlFor={ FIRST_NAME_FIELD } className="form-label">First Name</label>
                <input id={ FIRST_NAME_FIELD } className="form-control" type="text" value={ firstName } onChange={ handleFormOnChange } placeholder="name" required />
              </div>

              <div className="col">
                <label htmlFor={ LAST_NAME_FIELD } className="form-label" data-bs-toggle="tooltip" data-bs-placement="top" title="optional field" >
                    Last Name *
                  </label>
                <input id={ LAST_NAME_FIELD } className="form-control" type="text" value={ lastName } onChange={ handleFormOnChange } placeholder="surname"
                  />
              </div>
            </div>

            <div className="form-group mt-2">
              <label htmlFor={ BIRTH_DATE_FIELD } className="form-label">Date of birth</label>
              <input id={ BIRTH_DATE_FIELD } className="form-control" type="date" onChange={ handleFormOnChange } required />
            </div>

            <div className="form-group mt-2">
              <label htmlFor={ EMAIL_FIELD } className="form-label">Email</label>
              <input id={ EMAIL_FIELD } className="form-control" type="email" value={ email } onChange={ handleFormOnChange } placeholder="example@mail.com" required />
            </div>

            <div className="form-group mt-2">
              <label htmlFor={ PASSWORD_FIELD } className="form-label">Password</label>
              <input id={ PASSWORD_FIELD } className="form-control" type="password" value={ password } onChange={ handleFormOnChange } placeholder="your password" required />
            </div>

            <div className="form-group mt-2">
              <label htmlFor={ REPEAT_PASSWORD_FIELD } className="form-label">Repeat Password</label>
              <input id={ REPEAT_PASSWORD_FIELD } className="form-control" value={ repeatPassword } onChange={ handleFormOnChange } type="password" required />
            </div>

            <div className="form-group form-check mt-3 d-flex justify-content-between">
              <div>
                <input id={ TERMS_AND_CONDITIONS_CHECKBOX } className="form-check-input"  onChange={ handleFormOnChange } type="checkbox" required />
                <label className="form-check-label" htmlFor={ TERMS_AND_CONDITIONS_CHECKBOX }>I Accept the terms and conditions</label>
              </div>
              <div className="info-icon-container">
                <FontAwesomeIcon
                  icon={ faInfoCircle }
                  className="info-icon"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Our terms and conditions - Do not steal our games please"
                  />
              </div>
            </div>

            <button type="submit" className={ `btn ${submitButtonStyle} form-control mt-2` } onClick={ register } disabled={ ! isFormValid }>
              Sign up
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="login-tooltip">Already have an account?
              <Link to="/" className="mx-2 text-decoration-none">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage
