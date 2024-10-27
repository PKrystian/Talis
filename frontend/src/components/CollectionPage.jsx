import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './CollectionPage.css';
import TableItem from './TableItem';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      console.error('User ID is not available');
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
      console.error('Error fetching data:', error);
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
    <div className="container mt-4">
      <h1 className="text-center">Your Collection</h1>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            Library
          </button>
        </li>
      </ul>
      <div className="tab-content">
        {activeTab === 'wishlist' && (
          <div className="tab-pane active">
            <input
              type="text"
              className="form-control mb-4"
              placeholder="Search for a game in wishlist..."
              value={wishlistSearchTerm}
              onChange={handleWishlistSearch}
            />
            <select
              className="form-select mb-4"
              value={wishlistSortOption}
              onChange={(e) => setWishlistSortOption(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
              <option value="rating_asc">Rating &#x2191;</option>
              <option value="rating_desc">Rating &#x2193;</option>
              <option value="name_asc">Name &#x2191;</option>
              <option value="name_desc">Name &#x2193;</option>
            </select>
            <div className="row g-2">
              {filteredWishlist && filteredWishlist.length > 0 ? (
                filteredWishlist.map((boardGame) => (
                  <div key={boardGame.id} className="col-12 col-sm-5 col-lg-2">
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
            <input
              type="text"
              className="form-control mb-4"
              placeholder="Search for a game in library..."
              value={librarySearchTerm}
              onChange={handleLibrarySearch}
            />
            <select
              className="form-select mb-4"
              value={librarySortOption}
              onChange={(e) => setLibrarySortOption(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
              <option value="rating_asc">Rating &#x2191;</option>
              <option value="rating_desc">Rating &#x2193;</option>
              <option value="name_asc">Name &#x2191;</option>
              <option value="name_desc">Name &#x2193;</option>
            </select>
            <div className="row g-2">
              {filteredLibrary && filteredLibrary.length > 0 ? (
                filteredLibrary.map((boardGame) => (
                  <div key={boardGame.id} className="col-12 col-sm-5 col-lg-2">
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
                <p>No games found in library.</p>
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
    user_id: PropTypes.number.isRequired,
  }).isRequired,
};

export default CollectionPage;
