import React, { useEffect, useState } from 'react';

import defaultCat from './img/defaultCat.png';
import fedCat from './img/fedCat.png';
import hungryCat from './img/hungryCat.png';

import './App.css';

const IS_FED = true;

function App() {
  const [catImage, setCatImage] = useState(defaultCat);

  useEffect(() => {
    const intervalId = setInterval(() => setCatImage((currentCat) => {
      if (currentCat !== defaultCat) {
        return defaultCat;
      } else {
        return IS_FED ? fedCat : hungryCat;
      }
    }), 2000);

    return () => clearInterval(intervalId);
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={catImage} className="cat" alt="cat" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
