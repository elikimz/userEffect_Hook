import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface TUphotos {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

function App() {
  const [fetchedData, setFetchedData] = useState<TUphotos[]>([]);
  const [searchId, setSearchId] = useState<string>(() => {
    const storedId = localStorage.getItem('searchId');
    return storedId || '';
  });
  const [savedPhotos, setSavedPhotos] = useState<TUphotos[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchId) {
          const res = await axios.get<TUphotos>(`https://jsonplaceholder.typicode.com/photos/${searchId}`);
          setFetchedData([res.data]);
        } else {
          const res = await axios.get<TUphotos[]>('https://jsonplaceholder.typicode.com/photos');
          setFetchedData(res.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();

    const savedPhotos = JSON.parse(localStorage.getItem('savedPhotos') || '[]');
    setSavedPhotos(savedPhotos);
  }, [searchId]);

  const savePhoto = (photo: TUphotos) => {
    const updatedPhotos = [...savedPhotos, photo];
    setSavedPhotos(updatedPhotos);
    localStorage.setItem('savedPhotos', JSON.stringify(updatedPhotos));
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      alert('Please enter a valid ID');
      return;
    }

    try {
      const res = await axios.get<TUphotos>(`https://jsonplaceholder.typicode.com/photos/${searchId}`);
      const photoData = res.data;
      setFetchedData([photoData]);
      savePhoto(photoData);
      localStorage.setItem('searchId', searchId);
    } catch (err) {
      console.error('Error fetching photo by ID:', err);
    }
  }

  const handleReset = () => {
    setSearchId('');
    localStorage.removeItem('searchId');
  }

  return (
    <>
      <h1>Photo Gallery</h1>
      <div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder='Search by ID'
          />
          <button type='submit'>Search</button>
          <button type='button' onClick={handleReset}>Reset</button>
        </form>
      </div>
      <div className='users'>
        {
          (fetchedData.length > 0) ? (
            fetchedData.map((photo: TUphotos) => {
              return (
                <div className='user' key={photo.id}>
                  <p>Album ID: {photo.albumId}</p>
                  <p>Photo ID: {photo.id}</p>
                  <p>Title: {photo.title}</p>
                  <img src={photo.url} alt={photo.title} />
                  <p>Thumbnail URL:</p>
                  <img src={photo.thumbnailUrl} alt={photo.title} />
                </div>
              )
            })
          ) : (
            <div>no data found !!!!</div>
          )
        }
      </div>
    </>
  );
}

export default App;
