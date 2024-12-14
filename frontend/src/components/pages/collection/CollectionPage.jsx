import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './CollectionPage.css';
import TableItem from '../../utils/table/TableItem';
import MetaComponent from '../../meta/MetaComponent';
import { toast } from 'react-toastify';
import { MagnifyingGlass, CaretDown, Equals } from '@phosphor-icons/react';

const CollectionPage = ({ user }) => {
  const [collectionData, setCollectionData] = useState(null);
  const [filteredWishlist, setFilteredWishlist] = useState(null);
  const [filteredLibrary, setFilteredLibrary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistSearchTerm, setWishlistSearchTerm] = useState('');
  const [librarySearchTerm, setLibrarySearchTerm] = useState('');
  const [wishlistSortOption, setWishlistSortOption] = useState('newest');
  const [librarySortOption, setLibrarySortOption] = useState('newest');
  const [activeTab, setActiveTab] = useState('wishlist');
  const apiPrefix =
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000/api/'
      : '/api/';
  const collectionUrl = apiPrefix + 'user-collection/';

  const fetchCollectionData = useCallback(async () => {
    if (!user || !user.user_id) {
      toast.error('User ID is not available', {
        theme: 'dark',
        position: 'top-center',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        collectionUrl,
        { user_id: user.user_id },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      setCollectionData(response.data);
      setFilteredWishlist(response.data.wishlist);
      setFilteredLibrary(response.data.library);
    } catch (error) {
      toast.error(error, {
        theme: 'dark',
        position: 'top-center',
      });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [user, collectionUrl]);

  useEffect(() => {
    if (user && user.user_id) {
      fetchCollectionData();
    }
  }, [user, fetchCollectionData]);

  const handleWishlistSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setWishlistSearchTerm(term);

    if (collectionData) {
      const filtered = collectionData.wishlist.filter((game) =>
        game.name.toLowerCase().includes(term),
      );
      setFilteredWishlist(filtered);
    }
  };

  const handleLibrarySearch = (event) => {
    const term = event.target.value.toLowerCase();
    setLibrarySearchTerm(term);

    if (collectionData) {
      const filtered = collectionData.library.filter((game) =>
        game.name.toLowerCase().includes(term),
      );
      setFilteredLibrary(filtered);
    }
  };

  const sortGames = (games, option) => {
    switch (option) {
      case 'oldest':
        return [...games].sort(
          (a, b) =>
            new Date(a.collection_created_at) -
            new Date(b.collection_created_at),
        );
      case 'newest':
        return [...games].sort(
          (a, b) =>
            new Date(b.collection_created_at) -
            new Date(a.collection_created_at),
        );
      case 'rating_asc':
        return [...games].sort((a, b) => a.rating - b.rating);
      case 'rating_desc':
        return [...games].sort((a, b) => b.rating - a.rating);
      case 'name_asc':
        return [...games].sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return [...games].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return games;
    }
  };

  useEffect(() => {
    if (collectionData) {
      setFilteredWishlist(
        sortGames(collectionData.wishlist, wishlistSortOption),
      );
      setFilteredLibrary(sortGames(collectionData.library, librarySortOption));
    }
  }, [wishlistSortOption, librarySortOption, collectionData]);

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
    <div className="container collection-container mt-4">
      <MetaComponent
        title="My Collection"
        description="Display your wishlisted and library saved games"
        canonical="collection"
      />
      <div className="d-flex align-items-center mb-4">
        <Equals size={24} className="me-2" />
        <h1 className="text-left">Your {activeTab}</h1>
      </div>
      <ul className="nav nav-tabs border-bottom-0">
        <li>
          <button
            className={`nav-link collection-tab ${activeTab === 'wishlist' ? 'wishlist-active' : 'wishlist-inactive'}`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist
          </button>
        </li>
        <li>
          <button
            className={`nav-link collection-tab ${activeTab === 'library' ? 'library-active' : 'library-inactive'}`}
            onClick={() => setActiveTab('library')}
          >
            Library
          </button>
        </li>
      </ul>
      <div className="tab-content">
        {activeTab === 'wishlist' && (
          <div className="tab-pane active">
            <div className="collection-search-tab p-4 col-md-6 mb-4">
              <div className="d-flex mb-4">
                <input
                  type="text"
                  className="collection-form-control wishlist"
                  placeholder="Search for a game in wishlist..."
                  value={wishlistSearchTerm}
                  onChange={handleWishlistSearch}
                />
                <button
                  className="collection-search-submit wishlist"
                  type="submit"
                  aria-label="Search"
                >
                  <MagnifyingGlass size={20} />
                </button>
              </div>
              <select
                className="collection-form-select mb-4"
                value={wishlistSortOption}
                onChange={(e) => setWishlistSortOption(e.target.value)}
              >
                <option value="oldest">Oldest</option>
                <option value="newest">Newest</option>
                <option value="rating_asc">Rating &#x2191;</option>
                <option value="rating_desc">Rating &#x2193;</option>
                <option value="name_asc">Name &#x2191;</option>
                <option value="name_desc">Name &#x2193;</option>
              </select>
              <CaretDown size={20} className="dropdown-arrow"></CaretDown>
            </div>
            <div className="row g-2">
              {filteredWishlist && filteredWishlist.length > 0 ? (
                filteredWishlist.map((boardGame) => (
                  <div key={boardGame.id} className="col col-md-4 col-lg-2">
                    <TableItem boardGame={boardGame} />
                    <p className="collection-date">
                      Added on:{' '}
                      {new Date(
                        boardGame.collection_created_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No games found in wishlist.</p>
              )}
            </div>
          </div>
        )}
        {activeTab === 'library' && (
          <div className="tab-pane active">
            <div className="collection-search-tab p-4 col-md-6 mb-4">
              <div className="d-flex mb-4">
                <input
                  type="text"
                  className="collection-form-control library"
                  placeholder="Search for a game in library..."
                  value={librarySearchTerm}
                  onChange={handleLibrarySearch}
                />
                <button
                  className="collection-search-submit library"
                  type="submit"
                  aria-label="Search"
                >
                  <MagnifyingGlass size={20} />
                </button>
              </div>
              <select
                className="collection-form-select mb-4"
                value={librarySortOption}
                onChange={(e) => setLibrarySortOption(e.target.value)}
              >
                <option value="oldest">Oldest</option>
                <option value="newest">Newest</option>
                <option value="rating_asc">Rating &#x2191;</option>
                <option value="rating_desc">Rating &#x2193;</option>
                <option value="name_asc">Name &#x2191;</option>
                <option value="name_desc">Name &#x2193;</option>
              </select>
              <CaretDown size={20} className="dropdown-arrow"></CaretDown>
            </div>
            <div className="row g-2">
              {filteredLibrary && filteredLibrary.length > 0 ? (
                filteredLibrary.map((boardGame) => (
                  <div key={boardGame.id} className="col col-md-4 col-lg-2">
                    <TableItem boardGame={boardGame} />
                    <p className="collection-date">
                      Added on:{' '}
                      {new Date(
                        boardGame.collection_created_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No games found in wishlist.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CollectionPage.propTypes = {
  user: PropTypes.shape({
    user_id: PropTypes.number,
  }).isRequired,
};

export default CollectionPage;
