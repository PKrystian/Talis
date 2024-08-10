import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useFetch from './hooks/useFetch';
import LandingPage from './components/LandingPage';
import MeetingsPage from './components/MeetingsPage';
import MarketplacePage from './components/MarketplacePage';
import UserPage from './components/UserPage';
import Navbar from './components/Navbar';
import GamePage from './components/GamePage'
import RegistrationPage from './components/RegistrationPage';
import SearchPage from './components/SearchPage';
import CollectionPage from "./components/CollectionPage";
import Footer from "./components/Footer";
import PolicyPage from "./components/PolicyPage";
import LicensePage from "./components/LicensePage";
import axios from "axios"

const App = () => {
  const apiPrefix = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/' : '/api/';
  const apiUrl = apiPrefix + 'board-games/'
  const { data: boardGames, isLoading, error } = useFetch(apiUrl);

  const [userState, setUserState] = useState(false)
  const [user, setUser] = useState({})

  const updateUserState = (userStateData) => {
    setUser(userStateData)
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  useEffect(() => {
    getSession()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center vh-100 align-content-center">
        <div className='spinner-border'>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  function getSession() {
    console.log(user)
    console.log(userState)

    axios.get(
      apiPrefix + 'session/',
      { withCredentials: true }
    )
    .then((res) => (res.data))
    .then((data) => {
      if (data.isauthenticated) {
        setUserState(true)
        setUser({ 'username': data.username })
      } else {
        setUserState(false)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <Router>
      <div className="page-content">
        <Navbar userState={ userState } />
        <Routes apiPrefix={ apiPrefix } >
          <Route path="/" element={ <LandingPage boardGames={ boardGames } userState={ userState } /> } />
          <Route path="/collection" element={ <CollectionPage /> } />
          <Route path="/meetings" element={ <MeetingsPage /> } />
          <Route path="/marketplace" element={ <MarketplacePage /> } />
          <Route path="/user" element={ <UserPage /> } />
          <Route path="/register" element={ <RegistrationPage apiPrefix={ apiPrefix } userState={ userState } setUserData={ updateUser } setUserState={ updateUserState } /> } />
          <Route path="/game" element={ <GamePage /> } />
          <Route path="/search" element={ <SearchPage apiPrefix={ apiPrefix } /> } />
          <Route path="/policy" element={ <PolicyPage /> } />
          <Route path="/license" element={ <LicensePage /> } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
