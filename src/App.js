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
      mapURL: '',
      error: false,
      errorMsg: ''
    };
  }

  handleCitySubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_CITY_KEY}&q=${this.state.city}&format=json`);
      console.log(response.data[0]);

      this.setState({
        /*
          reset the state of the error to false to toggle the page from one state (show map) to the other (show error)
          */
        error: false,
        cityData: response.data[0],
        mapURL: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_CITY_KEY}&center=${response.data[0].lat},${response.data[0].lon}&zoom=12`
      })
    } catch (error) {
      console.log(error);
      console.log(this.state.errorMsg);
      this.setState({
        error: true,
        errorMsg: `an error occurred ${error.response.status}`,
      })
    }
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
          // <>
          //   <img src={this.state.mapURL} alt='city map' />
          //   <p>{this.state.cityData.lat}</p>
          //   <p>{this.state.cityData.lon}</p>
          // </>


          this.state.cityData.lat && !this.state.error
            ?
            <>
              <img src={this.state.mapURL} alt='city map' />
              <p>{this.state.cityData.lat}</p>
              <p>{this.state.cityData.lon}</p>
            </>
            :
            <>
              <p>{this.state.errorMsg}</p>
            </>
        }
        {/* {
          this.state.error
            ?
            <p>{this.state.errorMsg}</p>
            :
            <p>
              {this.state.mapURL}
            </p>
        } */}
      </>
    )
  }
};

export default App;
