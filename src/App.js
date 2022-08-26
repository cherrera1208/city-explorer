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
      movieData: [],
      mapURL: '',
      weatherInfo: '',
      error: false,
      errorMsg: '',
      displayWeather: '',
      displayMovies: ''
    };
  }
  handleCitySubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_CITY_KEY}&q=${this.state.city}&format=json`);
      console.log(response.data[0]);

      let weatherQ = response.data[0];
      let weatherData = await axios.get(`${process.env.REACT_APP_SERVER}/weather?lat=${weatherQ.lat}&lon=${weatherQ.lon}`);
      console.log(weatherData.data);

      let movieData = await axios.get(`${process.env.REACT_APP_SERVER}/movies?city=${this.state.city}`)

      let displayWeather = weatherData.data.map((data, idx) => {
        return (
          <div>
            {data.description},
            {data.date},
            {data.temp}
          </div>
        )
      });

      let displayMovies = movieData.data.map((data, idx) => {
        return (
          <>
            <div id="movie">
              <img src={data.imgPath} alt="movie posters" />,
              {data.title},
              {data.overview},
              {data.id}
            </div>
          </>
        )
      });


      this.setState({
        error: false,
        cityData: response.data[0],
        weatherData: weatherData.data,
        movieData: movieData.data,
        displayWeather: displayWeather,
        displayMovies: displayMovies,
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
  }
  handleCityInput = (e) => {
    let city = e.target.value;
    this.setState({
      city: city,
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
            <Button type="submit" variant="primary">Explore</Button>
          </label>
        </form>
        {this.state.error ? (
          <p>{this.state.errorMsg}</p>
        ) :

          this.state.cityData.lat && !this.state.error
            ?
            <>
              <img id="map" src={this.state.mapURL} alt='city map' />
              <p>Latitude: {this.state.cityData.lat}</p>
              <p>Longitude: {this.state.cityData.lon}</p>
              {this.state.displayWeather}
              {this.state.displayMovies}
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
