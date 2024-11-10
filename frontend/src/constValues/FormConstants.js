const FormConstants = {
  REGISTRATION_FIRST_NAME_FIELD: 'firstName',
  REGISTRATION_LAST_NAME_FIELD: 'lastName',
  REGISTRATION_BIRTH_DATE_FIELD: 'birthDate',
  REGISTRATION_EMAIL_FIELD: 'email',
  REGISTRATION_PASSWORD_FIELD: 'password',
  REGISTRATION_REPEAT_PASSWORD_FIELD: 'repeatPassword',
  REGISTRATION_TERMS_AND_CONDITIONS_CHECKBOX: 'termsAndConditions',
  LOGIN_EMAIL_FIELD: 'loginEmail',
  LOGIN_PASSWORD_FIELD: 'loginPassword',
  EMAIL_PATTERN: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  PASSWORD_PATTERN:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9 ])(?=.*[ -/:-@[-`{-~]).{6,64}$/,
  EVENT_TITLE_FIELD: 'title',
  EVENT_HOST_FIELD: 'host',
  EVENT_CITY_FIELD: 'city',
  EVENT_ZIP_CODE_FIELD: 'zip_code',
  EVENT_STREET_FIELD: 'street',
  EVENT_BOARD_GAMES_FIELD: 'board_games',
  EVENT_TAGS_FIELD: 'tags',
  EVENT_DESCRIPTION_FIELD: 'description',
  EVENT_MAX_PLAYERS_FIELD: 'max_players',
  EVENT_EVENT_START_DATE_FIELD: 'event_start_date',
  EVENT_COORDINATES_FIELD: 'coordinates',
  INVITE_INVITED_FRIENDS: 'invited_friends',
};

export default FormConstants;
