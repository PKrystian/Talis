import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/animals/' : '/api/animals/';

    const fetchAnimals = async () => {
      try {
        const response = await axios.get(apiUrl);
        setAnimals(response.data);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };

    fetchAnimals().then();
  }, []);

  return (
    <div>
      <h2>Animal List</h2>
      <ul>
        {animals.map(animal => (
          <li key={animal.id}>{animal.name} - {animal.species} - {animal.age}</li>
        ))}
      </ul>
    </div>
  );
}

export default AnimalList;
