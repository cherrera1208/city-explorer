import React from 'react';
import axios from 'axios';
import Button from
  'react-bootstrap/Button';
import './CSS/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      cityData: {},
      weatherData: [],
      mapURL: '',
      weatherInfo: '',
      error: false,
      errorMsg: '',
      displayForecast: '',
    };
  }
  handleCitySubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_CITY_KEY}&q=${this.state.city}&format=json`);
      console.log(response.data[0]);

      let forecast = await axios.get(`${process.env.REACT_APP_SERVER}/weather?city_name=${this.state.city}`)
      let displayForecast = this.state.weatherData.map((data, idx) => {
        return (
          <div>
            {data.description},
            {data.date},
          </div>
        )
      });
      console.log(forecast.data);
      console.log(this.state.weatherData);

      this.setState({
        error: false,
        cityData: response.data[0],
        weatherData: forecast.data.queriedCity,
        displayForecast: displayForecast[0],
        mapURL: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_CITY_KEY}&center=${response.data[0].lat},${response.data[0].lon}&zoom=12`
      })
    } catch (error) {
      console.log(error);
      console.log(this.state.errorMsg);
      this.setState({
        error: true,
        errorMsg: `An error occurred: ${error.message}`,
      })
    }
    console.log(this.state.displayForecast);
  }
  handleCityInput = (e) => {
    let city = e.target.value;
    this.setState({
      city: city
    });
  };

  render() {
    return (
      <>
        <h1>City Explorer</h1>
        <form onSubmit={this.handleCitySubmit}>
          <label>Pick a City
            <input
              type="text"
              onInput={this.handleCityInput}
              name="city"
            />
            <Button type="submit">Explore</Button>
          </label>
        </form>
        {this.state.error ? (
          <p>{this.state.errorMsg}</p>
        ) :

          this.state.cityData.lat && !this.state.error
            ?
            <>
              <img src={this.state.mapURL} alt='city map' />
              <p>Latitude: {this.state.cityData.lat}</p>
              <p>Longitude: {this.state.cityData.lon}</p>
              {this.state.displayForecast}
            </>
            :
            <>
              <p>{this.state.errorMsg}</p>
            </>
        }
      </>
    )
  }
};

export default App;
