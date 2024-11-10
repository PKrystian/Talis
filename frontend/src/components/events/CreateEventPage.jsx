import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import './CreateEventPage.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import FormConstants from '../../constValues/FormConstants';

const CreateEventPage = ({ apiPrefix, user, userState }) => {
  const navigate = useNavigate();

  if (!userState) {
    navigate('/');
  }

  const [eventName, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [boardGames, setBoardGames] = useState([]);
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [startDate, setStartDate] = useState('');
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState('');
  const [tagsQuery, setTagsQuery] = useState('');
  const [friendsQuery, setFriendsQuery] = useState('');
  const [isBoardGameInputFocused, setIsBoardGameInputFocused] = useState(false);
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(false);
  const [isFriendsInputFocused, setIsFriendsInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [tagsSuggestions, setTagsSuggestions] = useState([]);
  const [friendsSuggestions, setFriendsSuggestions] = useState([]);
  const [uniqueTagsList, setUniqueTagsList] = useState([]);
  const [userFriendsList, setUserFriendsList] = useState([]);

  const [boardGamesError, setBoardGamesError] = useState('');
  const [tagsError, setTagsError] = useState('');
  const [friendsError, setFriendsError] = useState('');

  const cancelTokenSource = useRef(null);
  const createEventFormRef = useRef(null);

  const [submitClickedOnce, setSubmitClickedOnce] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const [submitButtonStyle, setSubmitButtonStyle] = useState(
    'btn-outline-secondary',
  );

  const fetchCollectionData = useCallback(async () => {
    if (!user || !user.user_id) {
      console.error('User ID is not available');
      return;
    }
    axios
      .post(
        `${apiPrefix}get_friends/`,
        {
          user_id: user.user_id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => setUserFriendsList(response.data))
      .catch((error) => console.error('Error fetching friends:', error));
  }, [user, apiPrefix]);

  useEffect(() => {
    if (user && user.user_id) {
      fetchCollectionData();
    }
  }, [user, fetchCollectionData]);

  const setterMap = {
    [FormConstants.EVENT_TITLE_FIELD]: setTitle,
    [FormConstants.EVENT_CITY_FIELD]: setCity,
    [FormConstants.EVENT_STREET_FIELD]: setStreet,
    [FormConstants.EVENT_ZIP_CODE_FIELD]: setZipCode,
    [FormConstants.EVENT_BOARD_GAMES_FIELD]: setBoardGames,
    [FormConstants.EVENT_TAGS_FIELD]: setTags,
    [FormConstants.EVENT_DESCRIPTION_FIELD]: setDescription,
    [FormConstants.EVENT_MAX_PLAYERS_FIELD]: setMaxPlayers,
    [FormConstants.EVENT_EVENT_START_DATE_FIELD]: setStartDate,
    [FormConstants.INVITE_INVITED_FRIENDS]: setFriends,
  };

  const validators = [validateForm];

  function validateForm() {
    if (
      eventName &&
      city &&
      street &&
      zipCode &&
      boardGames &&
      description &&
      maxPlayers &&
      startDate &&
      friends.length <= maxPlayers
    ) {
      setIsFormValid(true);
      setSubmitButtonStyle('btn-secondary');
      return true;
    }

    setIsFormValid(false);
    setSubmitButtonStyle('btn-outline-secondary');
    return false;
  }

  useEffect(() => {
    if (query.length >= 3 && isBoardGameInputFocused) {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel();
      }
      cancelTokenSource.current = axios.CancelToken.source();
      axios
        .get(apiPrefix + 'search/', {
          params: { query, limit: 5 },
          cancelToken: cancelTokenSource.current.token,
        })
        .then((response) => {
          setSuggestions(response.data.results);
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            console.error('Error fetching suggestions:', error);
          }
        });
    } else {
      setSuggestions([]);
    }
  }, [query, isBoardGameInputFocused, apiPrefix]);

  useEffect(() => {
    if (tagsQuery.length === 0) {
      setTagsSuggestions(uniqueTagsList);
      return;
    }
    const filteredTags = uniqueTagsList.filter((tag) =>
      tag.toLowerCase().includes(tagsQuery.toLowerCase()),
    );
    setTagsSuggestions(filteredTags);
  }, [tagsQuery, uniqueTagsList]);

  function handleFormOnChange(e) {
    let key = e.target.id;
    let value = e.target.value;

    setterMap[key](value);
  }

  useEffect(() => {
    if (friendsQuery.length === 0) {
      setFriendsSuggestions(userFriendsList);
    } else {
      const searchTerms = friendsQuery.toLowerCase().split(' ');
      const filteredFriends = userFriendsList.filter((friend) => {
        const firstNameMatch = friend.first_name
          .toLowerCase()
          .includes(searchTerms[0]);
        const lastNameMatch = searchTerms[1]
          ? friend.last_name.toLowerCase().includes(searchTerms[1])
          : friend.last_name.toLowerCase().includes(searchTerms[0]);

        return firstNameMatch || lastNameMatch;
      });
      setFriendsSuggestions(filteredFriends);
    }
  }, [friendsQuery, isFriendsInputFocused, apiPrefix]);

  function handleSubmit() {
    setSubmitClickedOnce(true);
    let validations = [];

    validators.forEach((validator) => {
      validations.push(validator());
    });

    if (validations.every((v) => v === true)) {
      const boardGameIds = boardGames.map((boardGame) => boardGame.id);
      const friendIds = friends.map((friend) => friend.id);
      var topTags = [];
      if (tags.length === 0) {
        const allCategories = boardGames
          .flatMap((game) => game.category.split(', '))
          .map((category) => category.trim());

        const categoryCounts = allCategories.reduce((acc, category) => {
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        topTags = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([category]) => category);
      } else {
        topTags = tags;
      }
      let newEvent = {
        [FormConstants.EVENT_TITLE_FIELD]: eventName,
        [FormConstants.EVENT_CITY_FIELD]: city,
        [FormConstants.EVENT_STREET_FIELD]: street,
        [FormConstants.EVENT_ZIP_CODE_FIELD]: zipCode,
        [FormConstants.EVENT_BOARD_GAMES_FIELD]: JSON.stringify(boardGameIds),
        [FormConstants.EVENT_TAGS_FIELD]: JSON.stringify(topTags),
        [FormConstants.EVENT_DESCRIPTION_FIELD]: description,
        [FormConstants.EVENT_MAX_PLAYERS_FIELD]: maxPlayers,
        [FormConstants.EVENT_EVENT_START_DATE_FIELD]: startDate,
        [FormConstants.EVENT_HOST_FIELD]: user.user_id,
        [FormConstants.INVITE_INVITED_FRIENDS]: JSON.stringify(friendIds),
      };

      let url = apiPrefix + 'event/new/';

      axios
        .post(url, newEvent, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((resp) => {
          if (resp.status === 200) {
            navigate('/');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function updateBoardGames(boardGame) {
    if (boardGames.find((b) => b.id === boardGame.id)) {
      setBoardGamesError('This boardGame is already on your list');
      return;
    }
    if (boardGames.length > 6) {
      setBoardGamesError('You can add maximum of 6 boardgames to your event');
      return;
    }
    setBoardGamesError('');
    const newBoardGame = {
      id: boardGame.id,
      name: boardGame.name,
      category: boardGame.category,
    };
    setBoardGames((prevBoardGames) => {
      const updatedBoardGames = [...prevBoardGames, newBoardGame];
      const uniqueTags = [
        ...new Set(
          updatedBoardGames.flatMap((game) =>
            game.category ? game.category.split(', ') : [],
          ),
        ),
      ];
      setUniqueTagsList(uniqueTags);
      return updatedBoardGames;
    });
    setIsBoardGameInputFocused(false);
  }

  function updateTags(tag) {
    if (tags.find((t) => t === tag)) {
      setTagsError('This tag is already on your list');
      return;
    }
    setTagsError('');
    setTags((prevTags) => [...prevTags, tag]);
    setIsTagsInputFocused(false);
  }

  function updateFriends(friend) {
    if (friends.find((f) => f.id === friend.id)) {
      setFriendsError('This friend is already on your list');
      return;
    }
    setFriendsError('');
    setFriends((prevFriends) => [...prevFriends, friend]);
    setIsFriendsInputFocused(false);
  }

  function removeBoardGame(id) {
    setBoardGames((prevBoardGames) =>
      prevBoardGames.filter((boardGame) => boardGame.id !== id),
    );
  }

  function removeTag(tag) {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  }

  function removeFriends(id) {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== id),
    );
  }

  useEffect(() => {
    if (submitClickedOnce) {
      validators.forEach((validator) => {
        validator();
      });
    }
    validateForm();
  });

  const handleClickOutsideSuggestions = (e) => {
    if (
      createEventFormRef.current &&
      !createEventFormRef.current.contains(e.target)
    ) {
      setSuggestions([]);
      setIsBoardGameInputFocused(false);
      setIsTagsInputFocused(false);
      setIsFriendsInputFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideSuggestions);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSuggestions);
    };
  }, []);

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="backplate fade-in-1s">
        <div className="mt-4 mb-4 mx-5">
          <h2>Create Event</h2>
          <hr></hr>
          <form
            id="create-event-form"
            ref={createEventFormRef}
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div className="form-group row mt-2">
              <div className="col fade-in-2s">
                <label
                  htmlFor={FormConstants.EVENT_TITLE_FIELD}
                  className="form-label"
                >
                  Event Title
                </label>
                <input
                  id={FormConstants.EVENT_TITLE_FIELD}
                  className="form-control"
                  type="text"
                  value={eventName}
                  onChange={handleFormOnChange}
                  placeholder="title"
                  required
                />
              </div>
            </div>

            <div className="form-group row mt-2">
              <div className="col fade-in-2s">
                <label
                  htmlFor={FormConstants.EVENT_CITY_FIELD}
                  className="form-label"
                >
                  City
                </label>
                <input
                  id={FormConstants.EVENT_CITY_FIELD}
                  className="form-control"
                  type="text"
                  value={city}
                  onChange={handleFormOnChange}
                  placeholder="city"
                  required
                />
              </div>
            </div>

            <div className="form-group row mt-2">
              <div className="col-8 fade-in-2s">
                <label
                  htmlFor={FormConstants.EVENT_STREET_FIELD}
                  className="form-label"
                >
                  Street
                </label>
                <input
                  id={FormConstants.EVENT_STREET_FIELD}
                  className="form-control"
                  type="text"
                  value={street}
                  onChange={handleFormOnChange}
                  placeholder="street"
                  required
                />
              </div>

              <div className="col fade-in-2s">
                <label
                  htmlFor={FormConstants.EVENT_ZIP_CODE_FIELD}
                  className="form-label"
                >
                  ZipCode
                </label>
                <input
                  id={FormConstants.EVENT_ZIP_CODE_FIELD}
                  className="form-control"
                  type="text"
                  pattern="[0-9]{5}"
                  value={zipCode}
                  onChange={handleFormOnChange}
                  placeholder="zipcode"
                  required
                />
              </div>
            </div>

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.EVENT_EVENT_START_DATE_FIELD}
                className="form-label"
              >
                Starting Date
              </label>
              <input
                id={FormConstants.EVENT_EVENT_START_DATE_FIELD}
                className="form-control"
                type="datetime-local"
                onChange={handleFormOnChange}
                required
              />
            </div>

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.EVENT_BOARD_GAMES_FIELD}
                className="form-label"
              >
                BoardGames
              </label>
              <input
                className="form-control flex-grow-1 mx-lg-1"
                type="search"
                placeholder="boardgames"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsBoardGameInputFocused(true)}
              />
            </div>
            {boardGamesError && <p className="mb-0">{boardGamesError}</p>}
            {suggestions.length > 0 && isBoardGameInputFocused && (
              <div className="search-suggestions bg-dark position-absolute">
                <ul className="list-group">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="list-group-item list-group-item-action list-group-item-dark"
                      onClick={() => updateBoardGames(suggestion)}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {boardGames.length > 0 && (
              <div className="create-event-boardgames-list d-flex flex-wrap">
                {boardGames.map((boardGame) => (
                  <div
                    className="d-inline-flex col-auto bg-black px-2 m-1"
                    key={boardGame.id}
                  >
                    <button
                      className="btn-close btn-close-white"
                      onClick={() => removeBoardGame(boardGame.id)}
                    ></button>
                    {boardGame.name}
                  </div>
                ))}
              </div>
            )}

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.EVENT_TAGS_FIELD}
                className="form-label"
              >
                Tags
              </label>
              <input
                className="form-control flex-grow-1 mx-lg-1"
                type="search"
                placeholder="tags"
                value={tagsQuery}
                onChange={(e) => setTagsQuery(e.target.value)}
                onFocus={() => setIsTagsInputFocused(true)}
              />
            </div>
            {tagsError && <p className="mb-0">{tagsError}</p>}
            {tagsSuggestions.length > 0 && isTagsInputFocused && (
              <div className="search-suggestions bg-dark position-absolute">
                <ul className="list-group">
                  {tagsSuggestions.map((tag) => (
                    <li
                      key={tag}
                      className="list-group-item list-group-item-action list-group-item-dark"
                      onClick={() => updateTags(tag)}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tags.length > 0 && (
              <div className="create-event-boardgames-list d-flex flex-wrap">
                {tags.map((tag) => (
                  <div
                    className="d-inline-flex col-auto bg-black px-2 m-1"
                    key={tag}
                  >
                    <button
                      className="btn-close btn-close-white"
                      onClick={() => removeTag(tag)}
                    ></button>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.INVITE_INVITED_FRIENDS}
                className="form-label"
              >
                Friends
              </label>
              <input
                className="form-control flex-grow-1 mx-lg-1"
                type="search"
                placeholder="friends"
                value={friendsQuery}
                onChange={(e) => setFriendsQuery(e.target.value)}
                onFocus={() => setIsFriendsInputFocused(true)}
              />
            </div>
            {friendsError && <p className="mb-0">{friendsError}</p>}
            {friendsSuggestions.length > 0 && isFriendsInputFocused && (
              <div className="search-suggestions bg-dark position-absolute">
                <ul className="list-group">
                  {friendsSuggestions.map((friend) => (
                    <li
                      key={friend.id}
                      className="list-group-item list-group-item-action list-group-item-dark"
                      onClick={() => updateFriends(friend)}
                    >
                      {friend.first_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {friends.length > 0 && (
              <div className="create-event-boardgames-list d-flex flex-wrap">
                {friends.map((friend) => (
                  <div
                    className="d-inline-flex col-auto bg-black px-2 m-1"
                    key={friend.id}
                  >
                    <button
                      className="btn-close btn-close-white"
                      onClick={() => removeFriends(friend.id)}
                    ></button>
                    {friend.first_name} {friend.last_name}
                  </div>
                ))}
              </div>
            )}

            <div className="form-group row mt-2">
              <div className="col fade-in-2s">
                <label
                  htmlFor={FormConstants.EVENT_MAX_PLAYERS_FIELD}
                  className="form-label"
                >
                  Max Players
                </label>
                <input
                  id={FormConstants.EVENT_MAX_PLAYERS_FIELD}
                  className="form-control"
                  type="number"
                  value={maxPlayers}
                  onChange={handleFormOnChange}
                  placeholder="max players"
                />
              </div>
            </div>

            <div className="form-group row mt-2">
              <div className="col fade-in-2s">
                <label
                  htmlFor={FormConstants.EVENT_DESCRIPTION_FIELD}
                  className="form-label"
                >
                  Description
                </label>
                <textarea
                  id={FormConstants.EVENT_DESCRIPTION_FIELD}
                  className="form-control"
                  type="text"
                  value={description}
                  onChange={handleFormOnChange}
                  placeholder="description"
                  rows={5}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn ${submitButtonStyle} form-control mt-2`}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

CreateEventPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  userState: PropTypes.bool.isRequired,
}.isRequired;

export default CreateEventPage;
