import './App.css';
import React from 'react';
import BoardGameList from './components/BoardGameList';

const App = () => {
return (
    <div className="App">
        <header className="App-header">
            <BoardGameList/>
        </header>
    </div>
);}

export default App;
