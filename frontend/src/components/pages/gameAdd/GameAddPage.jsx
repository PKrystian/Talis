import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './GameAddPage.css';
import MetaComponent from '../../meta/MetaComponent';
import {
  CATEGORY_LIST,
  MECHANIC_LIST,
} from '../../../constValues/SearchConstants';
import { toast } from 'react-toastify';

const GameAddPage = ({ apiPrefix, user }) => {
  const [name, setName] = useState('');
  const [yearPublished, setYearPublished] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [minPlaytime, setMinPlaytime] = useState('');
  const [maxPlaytime, setMaxPlaytime] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publisher, setPublisher] = useState('');
  const [categories, setCategories] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [expansions, setExpansions] = useState('');

  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [nameErrorStyle, setNameErrorStyle] = useState('');
  const [descriptionErrorStyle, setDescriptionErrorStyle] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const navigate = useNavigate();

  const validateName = () => {
    if (name.length < 1) {
      setNameError('Name is required');
      setNameErrorStyle('is-invalid');
      return false;
    }
    setNameError('');
    setNameErrorStyle('');
    return true;
  };

  const validateDescription = () => {
    if (description.length < 1) {
      setDescriptionError('Description is required');
      setDescriptionErrorStyle('is-invalid');
      return false;
    }
    setDescriptionError('');
    setDescriptionErrorStyle('');
    return true;
  };

  const validateForm = () => {
    const isNameValid = validateName();
    const isDescriptionValid = validateDescription();
    setIsFormValid(isNameValid && isDescriptionValid);
    return isNameValid && isDescriptionValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const gameData = {
      name,
      year_published: yearPublished,
      min_players: minPlayers,
      max_players: maxPlayers,
      min_playtime: minPlaytime,
      max_playtime: maxPlaytime,
      age,
      description,
      image_url: imageUrl || null,
      publisher,
      categories: categories.map((c) => c.value).join(', '),
      mechanics: mechanics.map((m) => m.value).join(', '),
      expansions,
    };
    axios
      .post(
        `${apiPrefix}game-add/`,
        {
          user_id: user.user_id,
          game_data: gameData,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => {
        navigate(`/game/${response.data.game_id}`);
      })
      .catch((error) => {
        toast(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  const categoryOptions = CATEGORY_LIST.map((category) => ({
    value: category,
    label: category,
  }));

  const mechanicOptions = MECHANIC_LIST.map((mechanic) => ({
    value: mechanic,
    label: mechanic,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'var(--background-color-dark-heavy)',
      color: 'var(--text-color-dark)',
      border: '1px solid var(--border-color-light)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--background-color-dark-light)',
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: 'var(--background-color-dark-light)',
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'var(--background-color-dark-light)',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'var(--text-color-light)',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'var(--hover-background-color)',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? 'var(--hover-background-color)'
        : 'var(--background-color-dark-heavy)',
      color: 'var(--text-color-light)',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'var(--background-color-dark-medium)',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'var(--text-color-light)',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'var(--text-color-light)',
      ':hover': {
        backgroundColor: 'var(--hover-background-color)',
        color: 'var(--text-color-dark)',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--text-color-light-medium)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-color-light)',
    }),
  };

  return (
    <div className="add-game-page container">
      <MetaComponent
        title="Add Game"
        description="Add a new game to the database"
      />
      <h2 className="text-center mb-4">Add Game</h2>
      <div className="text-center game-add-additional-info mb-5">
        If your game is missing here, you can add it here.
        <br></br>
        <span className="game-add-note">Note:</span> The game will wait for
        verification after it is created.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="name" className="game-add-form-label">
                Name (required)
              </label>
              <input
                type="text"
                className={`game-add-form-control ${nameErrorStyle}`}
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName}
                placeholder="Enter game name, e.g. Talis"
              />
              <div className="invalid-feedback">{nameError}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="yearPublished" className="game-add-form-label">
                Year Published
              </label>
              <input
                type="text"
                className="game-add-form-control"
                id="yearPublished"
                value={yearPublished}
                onChange={(e) => setYearPublished(e.target.value)}
                placeholder="Enter game year published, e.g. 2021"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="minPlayers" className="game-add-form-label">
                Minimum Players
              </label>
              <input
                type="text"
                className="game-add-form-control"
                id="minPlayers"
                value={minPlayers}
                onChange={(e) => setMinPlayers(e.target.value)}
                placeholder="Enter game minimum players, e.g. 2"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="maxPlayers" className="game-add-form-label">
                Maximum Players
              </label>
              <input
                type="text"
                className="game-add-form-control"
                id="maxPlayers"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                placeholder="Enter game maximum players, e.g. 4"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="minPlaytime" className="game-add-form-label">
                Minimum Playtime
              </label>
              <input
                type="text"
                className="game-add-form-control"
                id="minPlaytime"
                value={minPlaytime}
                onChange={(e) => setMinPlaytime(e.target.value)}
                placeholder="Enter game minimum playtime, e.g. 20"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="maxPlaytime" className="game-add-form-label">
                Maximum Playtime
              </label>
              <input
                type="text"
                className="game-add-form-control"
                id="maxPlaytime"
                value={maxPlaytime}
                onChange={(e) => setMaxPlaytime(e.target.value)}
                placeholder="Enter game maximum playtime, e.g. 60"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="age" className="game-add-form-label">
                Age
              </label>
              <input
                type="text"
                className="game-add-form-control"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter game age, e.g. 12"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="game-add-form-label">
                Description (required)
              </label>
              <textarea
                className={`game-add-form-control overflow-hidden game-add-description-form-control ${descriptionErrorStyle}`}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={validateDescription}
                placeholder="Enter game description, e.g. A fun game for the whole family, you can use html elements like <b>bold</b> and <i>italic</i>"
                rows={3}
              />
              <div className="invalid-feedback">{descriptionError}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <label htmlFor="imageUrl" className="game-add-form-label">
                Image URL
              </label>
            </div>
            <img
              src={imageUrl || '/static/logo512.png'}
              alt="Game Preview"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/static/logo512.png';
              }}
              className="avatar-preview mb-3"
              width="100"
              height="100"
            />
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <input
                  type="text"
                  className="game-add-form-control"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="publisher" className="game-add-form-label">
                Publisher
              </label>
              <input
                type="text"
                className="game-add-form-control"
                id="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Enter publisher name, e.g. Talis"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="categories" className="game-add-form-label">
                Categories
              </label>
              <Select
                isMulti
                options={categoryOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                value={categories}
                onChange={setCategories}
                placeholder="Select categories"
                styles={customStyles}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mechanics" className="game-add-form-label">
                Mechanics
              </label>
              <Select
                isMulti
                options={mechanicOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                value={mechanics}
                onChange={setMechanics}
                placeholder="Select mechanics"
                styles={customStyles}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="expansions" className="game-add-form-label">
                Expansions (IDs separated by commas)
              </label>
              <input
                type="text"
                className="game-add-form-control"
                id="expansions"
                value={expansions}
                onChange={(e) => setExpansions(e.target.value)}
                placeholder="24235, 1463, 234"
              />
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="btn form-control game-add-create-button"
            disabled={!isFormValid}
          >
            Add Game
          </button>
        </div>
      </form>
    </div>
  );
};

GameAddPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default GameAddPage;
