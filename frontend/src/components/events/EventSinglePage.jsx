import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventItem from './EventItem';
import PropTypes from 'prop-types';

const EventSinglePage = ({ apiPrefix, user }) => {
  const navigate = useNavigate();

  if (!user || !user.user_id) {
    navigate('/');
  }

  const { event_id } = useParams();

  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiPrefix}event/get-one/${event_id}`)
      .then((response) => {
        if (response.data.detail) {
          navigate('/');
        }
        setEventData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching exist:', error);
      });
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-center mb-4">
        {eventData && <EventItem chosenEvent={eventData} />}
      </div>
    </div>
  );
};

EventSinglePage.propTypes = {
  eventData: PropTypes.object.isRequired,
}.isRequired;

export default EventSinglePage;
