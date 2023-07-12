import React, { useState } from 'react';
import { Button, Input, Message, Segment } from 'semantic-ui-react';


const AirQualityComparisonTool = () => {
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city1AirQuality, setCity1AirQuality] = useState(null);
  const [city2AirQuality, setCity2AirQuality] = useState(null);
  
  const options = {method: 'GET', headers: {accept: 'application/json'}};

fetch('https://api.openaq.org/v2/cities?limit=100&page=1&offset=0&sort=asc&order_by=city', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

// ...

const fetchAirQuality = async () => {
    setLoading(true);
    setError('');
    setCity1AirQuality(null);
    setCity2AirQuality(null);
  
    try {
      const response1 = await fetch(
        `https://api.openaq.org/v1/latest?city=${city1}`
      );
      const data1 = await response1.json();
  
      const response2 = await fetch(
        `https://api.openaq.org/v1/latest?city=${city2}`
      );
      const data2 = await response2.json();
  
      if (data1.results.length === 0 || data2.results.length === 0) {
        throw new Error('Air quality data not found for one or both cities.');
      }
  
      setCity1AirQuality(data1.results[0]);
      setCity2AirQuality(data2.results[0]);
    } catch (error) {
      setError('Error fetching air quality data. Please try again.');
    }
  
    setLoading(false);
  };
  
  // ...
  

  return (
    <Segment>
      <h2>Air Quality Comparison Tool</h2>

      {error && <Message negative>{error}</Message>}

      <Input
        placeholder="Enter City 1"
        value={city1}
        onChange={(e) => setCity1(e.target.value)}
        fluid
      />

      <br />

      <Input
        placeholder="Enter City 2"
        value={city2}
        onChange={(e) => setCity2(e.target.value)}
        fluid
      />

      <br />

      <Button primary loading={loading} onClick={fetchAirQuality}>
        Compare Air Quality
      </Button>

      <br />

      {city1AirQuality && city2AirQuality && (
        <div>
          <h3>{city1AirQuality.city}</h3>
          <p>Air Quality Index (AQI): {city1AirQuality.measurements[0].value}</p>

          <h3>{city2AirQuality.city}</h3>
          <p>Air Quality Index (AQI): {city2AirQuality.measurements[0].value}</p>
        </div>
      )}
    </Segment>
  );
};

export default AirQualityComparisonTool;
