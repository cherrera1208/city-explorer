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
      mapURL: ''
    };
  }

  handleCitySubmit = async (e) => {
    e.preventDefault();
    let response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_CITY_KEY}&q=${this.state.city}&format=json`);
    console.log(response.data[0]);

    this.setState({
      cityData: response.data[0],
      mapURL: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_CITY_KEY}&center=${response.data[0].lat},${response.data[0].lon}&zoom=12`
    })
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

        {this.state.mapURL === '' ? <></> : (
          <>
            <img src={this.state.mapURL} alt='city' />
            <p>{this.state.cityData.lat}</p>
            <p>{this.state.cityData.lon}</p>
          </>)}
      </>
    )
  }
};

export default App;
