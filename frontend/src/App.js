// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [forecastData, setForecastData] = useState([]);

  // Получение данных с бэкенда
  useEffect(() => {
    axios.get('http://localhost:8000/api/forecast')
      .then(response => {
        setForecastData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the forecast data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Прогнозы</h1>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Прогноз</th>
          </tr>
        </thead>
        <tbody>
          {forecastData.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;