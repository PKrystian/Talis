import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import useFetch from './hooks/useFetch'
import LandingPage from './components/LandingPage'
import MeetingsPage from './components/MeetingsPage'
import MarketplacePage from './components/MarketplacePage'
import Navbar from './components/Navbar'
import GamePage from './components/GamePage'
import UserPage from './components/user/UserPage'
import RegistrationPage from './components/user/RegistrationPage'
import SearchPage from './components/SearchPage'
import CollectionPage from "./components/CollectionPage"
import Footer from "./components/Footer"
import PolicyPage from "./components/PolicyPage"
import LicensePage from "./components/LicensePage"
import axios from "axios"
import LoginModal from './components/utils/LoginModal'

const App = () => {
  const apiPrefix = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/' : '/api/';
  const apiUrl = apiPrefix + 'board-games/'
  const { data: boardGames, isLoading, error } = useFetch(apiUrl);

  const [userState, setUserState] = useState(false)
  const [user, setUser] = useState({})

  const updateUserState = (userStateData) => {
    setUserState(userStateData)
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
      console.error(error)
    })
  }

  return (
    <Router>
      <div className="page-content">
        <Navbar apiPrefix={ apiPrefix } userState={ userState } setUserState={ updateUserState } user={ user } setUserData={ updateUser } />
        { !userState && <LoginModal apiPrefix={ apiPrefix } userState={ userState } setUserState={ updateUserState } setUserData={ updateUser } /> }
        <Routes apiPrefix={ apiPrefix } >
          <Route path="/" element={ <LandingPage boardGames={ boardGames } userState={ userState } /> } />
          <Route path="/collection" element={ <CollectionPage /> } />
          <Route path="/meetings" element={ <MeetingsPage /> } />
          <Route path="/marketplace" element={ <MarketplacePage /> } />
          <Route path="/user" element={ <UserPage user={ user } /> } />
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
