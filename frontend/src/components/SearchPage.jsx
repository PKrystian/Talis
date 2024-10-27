import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import TableItem from './TableItem';
import './SearchPage.css';
import { CATEGORY_LIST, MECHANIC_LIST } from '../messages/search';

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
  });
  const [expandedFilter, setExpandedFilter] = useState({
    category: false,
    mechanic: false,
    players: false,
    age: false,
    playtime: false,
    publisher: false,
    year: false,
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters((prevFilters) => {
      if (
        name === 'minPlayers' ||
        name === 'maxPlayers' ||
        name === 'publisher' ||
        name === 'year'
      ) {
        return { ...prevFilters, [name]: value };
      } else {
        const updatedFilters = checked
          ? [...prevFilters[name], value]
          : prevFilters[name].filter((item) => item !== value);

        return { ...prevFilters, [name]: updatedFilters };
      }
    });
  };

  const toggleFilterSection = (section) => {
    setExpandedFilter((prevExpandedFilter) => ({
      ...prevExpandedFilter,
      [section]: !prevExpandedFilter[section],
    }));
  };

  const applyFilters = () => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);

    ['category', 'mechanic', 'age', 'playtime'].forEach((filterType) => {
      filters[filterType].forEach((filterValue) => {
        searchParams.append('filters', `${filterType}|${filterValue}`);
      });
    });

    if (filters.minPlayers || filters.maxPlayers) {
      searchParams.append(
        'filters',
        `players|${filters.minPlayers}-${filters.maxPlayers}`,
      );
    }

    if (filters.publisher) {
      searchParams.append('filters', `publisher|${filters.publisher}`);
    }

    if (filters.year) {
      searchParams.append('filters', `year|${filters.year}`);
    }

    setCurrentPage(1);
    navigate(`?${searchParams.toString()}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query') || '';
    const filters = searchParams.getAll('filters');

    setIsLoading(true);
    axios
      .get(apiPrefix + 'search/', {
        params: {
          query,
          limit: 48,
          page: currentPage,
          filters,
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
        setHasMore(response.data.results.length === 48);
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
    };

    searchParams.getAll('filters').forEach((filter) => {
      const [filterType, filterValue] = filter.split('|');
      if (filterType && filterValue) {
        if (
          filterType === 'category' ||
          filterType === 'mechanic' ||
          filterType === 'age' ||
          filterType === 'playtime'
        ) {
          newFilters[filterType].push(filterValue);
        } else if (filterType === 'players') {
          const [minPlayers, maxPlayers] = filterValue.split('-');
          newFilters.minPlayers = minPlayers;
          newFilters.maxPlayers = maxPlayers;
        } else if (filterType === 'publisher') {
          newFilters.publisher = filterValue;
        } else if (filterType === 'year') {
          newFilters.year = filterValue;
        }
      }
    });

    setFilters(newFilters);
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="text-center vh-100 align-content-center">
        <div className="spinner-border">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      {query && (
        <h3 className="text-light">Search Results for &quot;{query}&quot;</h3>
      )}
      <div className="row">
        <div className="col-md-2">
          <h4>Filters</h4>
          <button onClick={applyFilters} className="btn btn-outline-light my-2">
            Apply Filters
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
                    value={filters.publisher}
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
                      id={`category-${category}`}
                      name="category"
                      value={category}
                      checked={filters.category.includes(category)}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="form-check-label text-light"
                    >
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
                      id={`mechanic-${mechanic}`}
                      name="mechanic"
                      value={mechanic}
                      checked={filters.mechanic.includes(mechanic)}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label
                      htmlFor={`mechanic-${mechanic}`}
                      className="form-check-label text-light"
                    >
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
                    value={filters.minPlayers}
                    onChange={handleInputChange}
                    placeholder="Min"
                    className="form-control me-2"
                  />
                  <input
                    type="number"
                    id="maxPlayers"
                    name="maxPlayers"
                    value={filters.maxPlayers}
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
                    value={filters.year}
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
                      id={`age-${age}`}
                      name="age"
                      value={age}
                      checked={filters.age.includes(age)}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label
                      htmlFor={`age-${age}`}
                      className="form-check-label text-light"
                    >
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
                        id={`playtime-${playtime}`}
                        name="playtime"
                        value={playtime}
                        checked={filters.playtime.includes(playtime)}
                        onChange={handleInputChange}
                        className="form-check-input"
                      />
                      <label
                        htmlFor={`playtime-${playtime}`}
                        className="form-check-label text-light"
                      >
                        {playtime}
                      </label>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
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
      </div>
    </div>
  );
};

SearchPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
};

export default SearchPage;
