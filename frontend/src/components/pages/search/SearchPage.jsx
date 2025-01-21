import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TableItem from '../../utils/table/TableItem';
import './SearchPage.css';
import MetaComponent from '../../meta/MetaComponent';
import { CaretDown, Plus } from '@phosphor-icons/react';
import CategoriesModal from './categoriesModal/CategoriesModal';
import MechanicsModal from './mechanicsModal/MechanicsModal';
import AgeModal from './ageModal/AgeModal';
import PlaytimeModal from './playtimeModal/PlaytimeModal';
import ExcludedModal from './excludedModal/ExcludedModal';

const EXCLUDED_LIST = [
  'no_expansions',
  'no_rating',
  'no_image',
  'no_age',
  'no_playtime',
  'no_categories',
  'no_mechanics',
  'no_year',
];

const EXCLUDED_DISPLAY_NAMES = {
  no_expansions: 'No Expansions',
  no_rating: 'No Rating',
  no_image: 'No Image',
  no_age: 'No Age',
  no_playtime: 'No Playtime',
  no_categories: 'No Categories',
  no_mechanics: 'No Mechanics',
  no_year: 'No Year',
};

const SearchPage = ({ apiPrefix }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query') || '';
  const filterType =
    new URLSearchParams(location.search).get('filterType') || '';
  const filter = new URLSearchParams(location.search).get('filter') || '';

  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isGameCategoriesModalOpen, setIsGameCategoriesModalOpen] =
    useState(false);
  const [isGameMechanicsModalOpen, setIsGameMechanicsModalOpen] =
    useState(false);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [isPlaytimeModalOpen, setIsPlaytimeModalOpen] = useState(false);
  const [isExcludedModalOpen, setIsExcludedModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: filterType === 'Category' ? filter.split(',') : [],
    mechanic: filterType === 'Mechanic' ? filter.split(',') : [],
    minPlayers: '',
    maxPlayers: '',
    age: [],
    playtime: [],
    publisher: '',
    year: '',
    excluded: [],
  });
  const [sort, setSort] = useState('rating_desc');
  const [inputValues, setInputValues] = useState({
    minPlayers: '',
    maxPlayers: '',
    publisher: '',
    year: '',
  });

  const loadingSpinner = () => {
    return (
      <div className="col-md-10 text-center align-content-center">
        <div className="spinner-border">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setFilters((prevFilters) => {
        const currentFilter = Array.isArray(prevFilters[name])
          ? prevFilters[name]
          : [];

        const updatedFilters = checked
          ? [...currentFilter, value]
          : currentFilter.filter((item) => item !== value);

        return { ...prevFilters, [name]: updatedFilters };
      });
    } else {
      setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const applyInputFilters = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...inputValues,
    }));

    const searchParams = new URLSearchParams();
    searchParams.append('query', query);

    ['category', 'mechanic', 'age', 'playtime', 'excluded'].forEach(
      (filterType) => {
        filters[filterType].forEach((filterValue) => {
          searchParams.append(
            'filters',
            `${filterType}|${encodeURIComponent(filterValue)}`,
          );
        });
      },
    );

    if (filters.minPlayers || filters.maxPlayers) {
      searchParams.append(
        'filters',
        `players|${encodeURIComponent(filters.minPlayers)}-${encodeURIComponent(filters.maxPlayers)}`,
      );
    }

    if (filters.publisher) {
      searchParams.append(
        'filters',
        `publisher|${encodeURIComponent(filters.publisher)}`,
      );
    }

    if (filters.year) {
      searchParams.append(
        'filters',
        `year|${encodeURIComponent(filters.year)}`,
      );
    }

    searchParams.append('sort', sort);

    setCurrentPage(1);
    navigate(`?${searchParams.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      category: [],
      mechanic: [],
      minPlayers: '',
      maxPlayers: '',
      age: [],
      playtime: [],
      publisher: '',
      year: '',
      excluded: [],
    });
    setInputValues({
      minPlayers: '',
      maxPlayers: '',
      publisher: '',
      year: '',
    });
    setSort('rating_desc');
    navigate(`?query=${encodeURIComponent(query)}`);
  };

  const toggleCategoriesModal = () => {
    setIsGameCategoriesModalOpen((prev) => !prev);
  };

  const toggleMechanicsModal = () => {
    setIsGameMechanicsModalOpen((prev) => !prev);
  };

  const toggleAgeModal = () => {
    setIsAgeModalOpen((prev) => !prev);
  };

  const togglePlaytimeModal = () => {
    setIsPlaytimeModalOpen((prev) => !prev);
  };

  const toggleExcludedModal = () => {
    setIsExcludedModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query') || '';
    const filters = searchParams.getAll('filters');
    const sort = searchParams.get('sort') || 'rating_desc';

    setIsLoading(true);
    axios
      .get(apiPrefix + 'search/', {
        params: {
          query,
          limit: 50,
          page: currentPage,
          filters,
          sort,
        },
      })
      .then((response) => {
        if (currentPage === 1) {
          setSearchResults(response.data.results);
        } else {
          setSearchResults((prevResults) => [
            ...prevResults,
            ...response.data.results,
          ]);
        }
        setHasMore(response.data.results.length === 50);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [location.search, apiPrefix, currentPage]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = {
      category: [],
      mechanic: [],
      minPlayers: '',
      maxPlayers: '',
      age: [],
      playtime: [],
      publisher: '',
      year: '',
      excluded: [],
    };
    searchParams.getAll('filters').forEach((filter) => {
      const [filterType, filterValue] = filter.split('|');
      if (filterType && filterValue) {
        const decodedFilterValue = decodeURIComponent(filterValue);
        if (
          filterType === 'category' ||
          filterType === 'mechanic' ||
          filterType === 'age' ||
          filterType === 'playtime' ||
          filterType === 'excluded'
        ) {
          newFilters[filterType].push(decodedFilterValue);
        } else if (filterType === 'players') {
          const [minPlayers, maxPlayers] = decodedFilterValue.split('-');
          newFilters.minPlayers = minPlayers;
          newFilters.maxPlayers = maxPlayers;
        } else if (filterType === 'publisher') {
          newFilters.publisher = decodedFilterValue;
        } else if (filterType === 'year') {
          newFilters.year = decodedFilterValue;
        }
      }
    });

    setFilters(newFilters);
    setSort(searchParams.get('sort') || 'rating_desc');
  }, [location.search]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      <MetaComponent
        title="Search Page"
        description="Search for your favourite board games here"
      />
      {query && (
        <h3 className="text-light">Search Results for &quot;{query}&quot;</h3>
      )}
      <div className="row mt-3 mb-3 text-center" id="meetingsFilter">
        <div className="col-sm pb-2">
          Publisher
          <div>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={inputValues.publisher}
              onChange={handleInputChange}
              placeholder="Publisher"
              className="search-page-form-control filter-input mt-2"
            />
          </div>
        </div>
        <div className="col-sm mb-2">
          Categories
          <div>
            <button
              className="btn event-page-tags-button mt-1"
              data-testid="event-page-tags-button"
              onClick={toggleCategoriesModal}
            >
              <Plus size={25}></Plus>
            </button>
          </div>
        </div>
        {isGameCategoriesModalOpen && (
          <CategoriesModal
            toggleCategoriesModal={toggleCategoriesModal}
            handleInputChange={handleInputChange}
            filters={filters}
          />
        )}
        <div className="col-sm mb-2">
          Mechanic
          <div>
            <button
              className="btn event-page-tags-button mt-1"
              data-testid="event-page-tags-button"
              onClick={toggleMechanicsModal}
            >
              <Plus size={25}></Plus>
            </button>
          </div>
        </div>
        {isGameMechanicsModalOpen && (
          <MechanicsModal
            toggleMechanicsModal={toggleMechanicsModal}
            handleInputChange={handleInputChange}
            filters={filters}
          />
        )}
        <div className="col-sm">
          No. of Players
          <div className="row mt-2 justify-content-center">
            <input
              type="number"
              id="minPlayers"
              name="minPlayers"
              value={inputValues.minPlayers}
              onChange={handleInputChange}
              placeholder="Min"
              className="search-page-form-control filter-number-input col me-2"
            />
            <input
              type="number"
              id="maxPlayers"
              name="maxPlayers"
              value={inputValues.maxPlayers}
              onChange={handleInputChange}
              placeholder="Max"
              className="search-page-form-control filter-number-input col"
            />
          </div>
        </div>
        <div className="col-sm">
          Year
          <div>
            <input
              type="text"
              id="year"
              name="year"
              value={inputValues.year}
              onChange={handleInputChange}
              placeholder="20xx"
              className="search-page-form-control filter-input mt-2"
            />
          </div>
        </div>
        <div className="col-sm mb-2">
          Age
          <div>
            <button
              className="btn event-page-tags-button mt-1"
              data-testid="event-page-tags-button"
              onClick={toggleAgeModal}
            >
              <Plus size={25}></Plus>
            </button>
          </div>
        </div>
        {isAgeModalOpen && (
          <AgeModal
            toggleAgeModal={toggleAgeModal}
            handleInputChange={handleInputChange}
            filters={filters}
          />
        )}
        <div className="col-sm mb-2">
          Playtime
          <div>
            <button
              className="btn event-page-tags-button mt-1"
              data-testid="event-page-tags-button"
              onClick={togglePlaytimeModal}
            >
              <Plus size={25}></Plus>
            </button>
          </div>
        </div>
        {isPlaytimeModalOpen && (
          <PlaytimeModal
            togglePlaytimeModal={togglePlaytimeModal}
            handleInputChange={handleInputChange}
            filters={filters}
          />
        )}
        <div className="col-sm mb-2">
          Excluded
          <div>
            <button
              className="btn event-page-tags-button mt-1"
              data-testid="event-page-tags-button"
              onClick={toggleExcludedModal}
            >
              <Plus size={25}></Plus>
            </button>
          </div>
        </div>
        {isExcludedModalOpen && (
          <ExcludedModal
            toggleExcludedModal={toggleExcludedModal}
            handleInputChange={handleInputChange}
            filters={filters}
            EXCLUDED_LIST={EXCLUDED_LIST}
            EXCLUDED_DISPLAY_NAMES={EXCLUDED_DISPLAY_NAMES}
          />
        )}
      </div>
      <div className="d-flex justify-content-between">
        <div className="filter-group">
          <div className="filter-header">
            <h5>Sort By</h5>
          </div>
          <div className="filter-options">
            <select
              className="search-page-form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="rating_desc">Rating &#x2193;</option>
              <option value="rating_asc">Rating &#x2191;</option>
              <option value="name_asc">Name &#x2191;</option>
              <option value="name_desc">Name &#x2193;</option>
              <option value="year_desc">Year Published &#x2193;</option>
              <option value="year_asc">Year Published &#x2191;</option>
            </select>
            <CaretDown size={20} className="dropdown-arrow"></CaretDown>
          </div>
        </div>
        <div>
          <button
            onClick={resetFilters}
            className="btn search-page-reset-button mt-4 me-3"
          >
            Reset Filters
          </button>
          <button
            className="btn search-page-filter-button mt-4"
            onClick={() => applyInputFilters()}
          >
            Apply Filters
          </button>
        </div>
      </div>
      <div className="row">
        {isLoading ? (
          loadingSpinner()
        ) : (
          <div className="col">
            <div className="d-flex flex-wrap justify-content-start">
              {searchResults.length > 0 ? (
                searchResults.map((boardGame) => (
                  <TableItem key={boardGame.id} boardGame={boardGame} />
                ))
              ) : (
                <div>No results found.</div>
              )}
            </div>
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="btn btn-primary my-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SearchPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
};

export default SearchPage;
