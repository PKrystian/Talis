const FormConstants = {
  REGISTRATION_FIRST_NAME_FIELD: "firstName",
  REGISTRATION_LAST_NAME_FIELD: "lastName",
  REGISTRATION_BIRTH_DATE_FIELD: "birthDate",
  REGISTRATION_EMAIL_FIELD: "email",
  REGISTRATION_PASSWORD_FIELD: "password",
  REGISTRATION_REPEAT_PASSWORD_FIELD: "repeatPassword",
  REGISTRATION_TERMS_AND_CONDITIONS_CHECKBOX: "termsAndConditions",
  LOGIN_EMAIL_FIELD: "loginEmail",
  LOGIN_PASSWORD_FIELD: "loginPassword",
  EMAIL_PATTERN: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9 ])(?=.*[ -/:-@[-`{-~]).{6,64}$/,
}

export default FormConstants