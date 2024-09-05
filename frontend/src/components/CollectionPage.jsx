import { useEffect, useState } from 'react';
import axios from 'axios';
import TableItem from './TableItem';

const CollectionPage = ({ user }) => {
  const [collectionData, setCollectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiPrefix = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/' : '/api/';
  const collectionUrl = apiPrefix + 'user-collection/';

  const fetchCollectionData = async () => {
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
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      setCollectionData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.user_id) {
      fetchCollectionData();
    }
  }, [user]);

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
      {collectionData && (
        <>
          {collectionData.wishlist && collectionData.wishlist.length > 0 && (
            <div className="mb-5">
              <h3 className="text-light">Wishlist</h3>
              <div className="row g-2">
                {collectionData.wishlist.map(boardGame => (
                  <div key={boardGame.id} className="col-12 col-sm-5 col-lg-2">
                    <TableItem boardGame={boardGame} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {collectionData.library && collectionData.library.length > 0 && (
            <div className="mb-5">
              <h3 className="text-light">Library</h3>
              <div className="row g-2">
                {collectionData.library.map(boardGame => (
                  <div key={boardGame.id} className="col-12 col-sm-5 col-lg-2">
                    <TableItem boardGame={boardGame} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CollectionPage;
