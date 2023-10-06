import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [price, setPrice] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [pastPrices, setPastPrices] = useState([]);

  useEffect(() => {
    // Open an SSE connection
    const eventSource = new EventSource('/sse');

    eventSource.onmessage = (event) => {
      const { price } = JSON.parse(event.data);
      setPrice(price.toFixed(4)); 

      setPastPrices((prevPrices) => {
        const updatedPrices = [price.toFixed(4), ...prevPrices.slice(0, 9)];
        return updatedPrices;
      });
    };

    eventSource.onerror = (error) => {
      setConnectionStatus('Connection Error');
      eventSource.close();
    };

    axios
      .get('/api/coin-price', { params: { symbol: 'BTCUSDT' } })
      .then((response) => {
        const initialPrice = response.data.price.toFixed(4);
        setPrice(initialPrice); 
        setConnectionStatus('Connected');
      })
      .catch((error) => {
        setConnectionStatus('Error fetching data');
      });

    const priceInterval = setInterval(() => {
      axios
        .get('/api/coin-price', { params: { symbol: 'BTCUSDT' } })
        .then((response) => {
          const newPrice = response.data.price.toFixed(4);
          setPastPrices((prevPrices) => {
            const updatedPrices = [newPrice, ...prevPrices.slice(0, 9)];
            return updatedPrices;
          });
        })
        .catch((error) => {
          console.error('Error fetching past prices:', error);
        });
    }, 5000); 

    return () => clearInterval(priceInterval);
  }, []);

  return (
    <div className="App">
      <h1>Connection Status: {connectionStatus}</h1>
      <h2>Latest price of BTC: {price}</h2>
      <h3>Past Prices:</h3>
      <ul>
        {pastPrices.map((pastPrice, index) => (
          <li key={index}>{pastPrice}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;