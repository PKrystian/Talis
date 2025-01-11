import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import TableItem from '../../utils/table/TableItem';
import './SearchPage.css';
import {
  CATEGORY_LIST,
  MECHANIC_LIST,
} from '../../../constValues/SearchConstants';
import MetaComponent from '../../meta/MetaComponent';

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
  const [expandedFilter, setExpandedFilter] = useState({
    category: false,
    mechanic: false,
    players: false,
    age: false,
    playtime: false,
    publisher: false,
    year: false,
    excluded: false,
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
    searchParams.append('query', encodeURIComponent(query));

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

  const toggleFilterSection = (section) => {
    setExpandedFilter((prevExpandedFilter) => ({
      ...prevExpandedFilter,
      [section]: !prevExpandedFilter[section],
    }));
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
      <div className="row">
        <div className="col-md-2">
          <h4>Filters</h4>
          <button
            onClick={applyInputFilters}
            className="btn btn-outline-light my-2"
          >
            Apply Filters
          </button>
          <button onClick={resetFilters} className="btn btn-outline-light my-2">
            Reset Filters
          </button>
          <div className="filter-group">
            <div
              className="filter-header"
              onClick={() => toggleFilterSection('publisher')}
            >
              <h5>
                Publisher{' '}
                {expandedFilter.publisher ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
            </div>
            {expandedFilter.publisher && (
              <div className="filter-options">
                <div className="d-flex">
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={inputValues.publisher}
                    onChange={handleInputChange}
                    placeholder="Enter publisher name"
                    className="form-control"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="filter-group">
            <div
              className="filter-header"
              onClick={() => toggleFilterSection('category')}
            >
              <h5>
                Category{' '}
                {expandedFilter.category ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
            </div>
            {expandedFilter.category && (
              <div className="filter-options">
                {CATEGORY_LIST.map((category) => (
                  <div key={category} className="form-check">
                    <input
                      type="checkbox"
                      id={category}
                      name="category"
                      value={category}
                      checked={filters.category.includes(category)}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label htmlFor={category} className="form-check-label">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-group">
            <div
              className="filter-header"
              onClick={() => toggleFilterSection('mechanic')}
            >
              <h5>
                Mechanic{' '}
                {expandedFilter.mechanic ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
            </div>
            {expandedFilter.mechanic && (
              <div className="filter-options">
                {MECHANIC_LIST.map((mechanic) => (
                  <div key={mechanic} className="form-check">
                    <input
                      type="checkbox"
                      id={mechanic}
                      name="mechanic"
                      value={mechanic}
                      checked={filters.mechanic.includes(mechanic)}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label htmlFor={mechanic} className="form-check-label">
                      {mechanic}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-group">
            <div
              className="filter-header"
              onClick={() => toggleFilterSection('players')}
            >
              <h5>
                Number of Players{' '}
                {expandedFilter.players ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
            </div>
            {expandedFilter.players && (
              <div className="filter-options">
                <div className="d-flex">
                  <input
                    type="number"
                    id="minPlayers"
                    name="minPlayers"
                    value={inputValues.minPlayers}
                    onChange={handleInputChange}
                    placeholder="Min"
                    className="form-control me-2"
                  />
                  <input
                    type="number"
                    id="maxPlayers"
                    name="maxPlayers"
                    value={inputValues.maxPlayers}
                    onChange={handleInputChange}
                    placeholder="Max"
                    className="form-control"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="filter-group">
            <div
              className="filter-header"
              onClick={() => toggleFilterSection('year')}
            >
              <h5>
                Year Published{' '}
                {expandedFilter.year ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
            </div>
            {expandedFilter.year && (
              <div className="filter-options">
                <div className="d-flex">
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={inputValues.year}
                    onChange={handleInputChange}
                    placeholder="20xx"
                    className="form-control"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="filter-group">
            <div
              className="filter-header"
              onClick={() => toggleFilterSection('age')}
            >
              <h5>
                Age {expandedFilter.age ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
            </div>
            {expandedFilter.age && (
              <div className="filter-options">
                {[
                  'up to 3 years',
                  '3-4 years',
                  '5-7 years',
                  '8-11 years',
                  '12-14 years',
                  '15-17 years',
                  '18+ years',
                ].map((age) => (
                  <div key={age} className="form-check">
                    <input
                      type="checkbox"
                      id={age}
                      name="age"
                      value={age}
                      checked={filters.age.includes(age)}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label htmlFor={age} className="form-check-label">
                      {age}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-group">
            <div
              className="filter-header"
              onClick={() => toggleFilterSection('playtime')}
            >
              <h5>
                Playtime{' '}
                {expandedFilter.playtime ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
            </div>
            {expandedFilter.playtime && (
              <div className="filter-options">
                {['< 15 min', '< 30 min', '< 1h', '< 2h', '2h+'].map(
                  (playtime) => (
                    <div key={playtime} className="form-check">
                      <input
                        type="checkbox"
                        id={playtime}
                        name="playtime"
                        value={playtime}
                        checked={filters.playtime.includes(playtime)}
                        onChange={handleInputChange}
                        className="form-check-input"
                      />
                      <label htmlFor={playtime} className="form-check-label">
                        {playtime}
                      </label>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
          <div className="filter-group">
            <div
              className="filter-header"
              onClick={() => toggleFilterSection('excluded')}
            >
              <h5>
                Excluded{' '}
                {expandedFilter.excluded ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
            </div>
            {expandedFilter.excluded && (
              <div className="filter-options">
                {EXCLUDED_LIST.map((excluded) => (
                  <div key={excluded} className="form-check">
                    <input
                      type="checkbox"
                      id={excluded}
                      name="excluded"
                      value={excluded}
                      checked={filters.excluded.includes(excluded)}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label htmlFor={excluded} className="form-check-label">
                      {EXCLUDED_DISPLAY_NAMES[excluded]}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-group">
            <div className="filter-header">
              <h5>Sort By</h5>
            </div>
            <div className="filter-options">
              <select
                className="form-select"
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
            </div>
          </div>
        </div>
        {isLoading ? (
          loadingSpinner()
        ) : (
          <div className="col-md-10">
            <div className="d-flex flex-wrap">
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
