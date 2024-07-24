import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import TableItem from './TableItem';
import './SearchPage.css';
import { TOP_MECHANIC_LIST } from "../messages/suggestions";
import { CATEGORY_LIST, MECHANIC_LIST } from "../messages/search";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query') || '';
  const filterType = new URLSearchParams(location.search).get('filterType') || '';
  const filter = new URLSearchParams(location.search).get('filter') || '';

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: filterType === 'Category' ? filter.split(',') : [],
    mechanic: filterType === 'Mechanic' ? filter.split(',') : [],
    publisher: ''
  });
  const [expandedFilter, setExpandedFilter] = useState({
    category: false,
    mechanic: false
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = checked
        ? [...prevFilters[name], value]
        : prevFilters[name].filter((item) => item !== value);

      return { ...prevFilters, [name]: updatedFilters };
    });
  };

  const toggleFilterSection = (section) => {
    setExpandedFilter((prevExpandedFilter) => ({
      ...prevExpandedFilter,
      [section]: !prevExpandedFilter[section]
    }));
  };

  const applyFilters = () => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    if (filters.category.length > 0) {
      searchParams.append('filterType', 'Category');
      searchParams.append('filter', filters.category.join(','));
    }
    if (filters.mechanic.length > 0) {
      searchParams.append('filterType', 'Mechanic');
      searchParams.append('filter', filters.mechanic.join(','));
    }
    navigate(`?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (query || filter) {
      setIsLoading(true);
      axios.get('/api/search/', { params: { query, limit: 48, filterType, filter } })
        .then(response => {
          setSearchResults(response.data.results);
          setIsLoading(false);
        })
        .catch(error => {
          setError(error);
          setIsLoading(false);
        });
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [query, filterType, filter]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setFilters({
      category: searchParams.get('filterType') === 'Category' ? searchParams.get('filter').split(',') : [],
      mechanic: searchParams.get('filterType') === 'Mechanic' ? searchParams.get('filter').split(',') : [],
      publisher: ''
    });
  }, [location.search]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      {query && <h3 className="text-light">Search Results for "{query}"</h3>}
      <div className="row">
        <div className="col-md-2">
          <h4>Filters</h4>
          <button onClick={applyFilters} className="btn btn-outline-light my-2">Apply Filters</button>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggleFilterSection('category')}>
              <h5>Category {expandedFilter.category ? <FaChevronUp /> : <FaChevronDown />}</h5>
            </div>
            {expandedFilter.category && (
              <div className="filter-options">
                {CATEGORY_LIST.map(category => (
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
                    <label htmlFor={`category-${category}`} className="form-check-label text-light">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggleFilterSection('mechanic')}>
              <h5>Mechanic {expandedFilter.mechanic ? <FaChevronUp /> : <FaChevronDown />}</h5>
            </div>
            {expandedFilter.mechanic && (
              <div className="filter-options">
                {MECHANIC_LIST.map(mechanic => (
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
                    <label htmlFor={`mechanic-${mechanic}`} className="form-check-label text-light">
                      {mechanic}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-10">
          <div className="d-flex flex-wrap">
            {searchResults.length > 0 ? (
              searchResults.map(boardGame => (
                <TableItem key={boardGame.id} boardGame={boardGame} />
              ))
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
