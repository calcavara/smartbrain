import React, { Component, Fragment } from 'react';
import './App.css';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import FaceRecognition from './components/faceregonition/FaceRecognition';
import Rank from './components/rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'fa59a147ee404521b2e623ee84da3c2d'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonSubmit = this.onButtonSubmit.bind(this);
    this.calculateFaceLocation = this.calculateFaceLocation.bind(this);
    this.displayFaceBox = this.displayFaceBox.bind(this);
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  calculateFaceLocation(theData) {
    const clarifaiFace = theData.outputs[0].data.regions[0]['region_info']['bounding_box'];
    const image = document.getElementById('inputimage');
    const imageWidth = Number(image.width);
    const imageHeight = Number(image.height);
    console.log(imageWidth, imageHeight);
    return {
      leftCol: clarifaiFace['left_col'] * imageWidth,
      topRow: clarifaiFace['top_row'] * imageHeight,
      rightCol: imageWidth - (clarifaiFace['right_col'] * imageWidth),
      bottomRow: imageHeight - (clarifaiFace['bottom_row'] * imageHeight)
    }
  }

  displayFaceBox(box) {
    this.setState({
      box
    })
  }

  onInputChange(event) {
    this.setState({
      input: event.target.value
    });
  }

  onButtonSubmit() {
    this.setState(state => ({
      imageUrl: state.input
    }));
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then( response => {
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch( err => console.log(err));
  }

  onRouteChange(route) {
    this.setState({
      route
    })
    route === 'home' ?
    this.setState({
      isSignedIn: true
    }) :
    this.setState({
      isSignedIn: false
    })
  }

  render() {
    return (
      <div className="App">
        {/*<Particles className='particles' params={particlesOptions}/>*/}
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' ? 
          <Fragment>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </Fragment> : 
          this.state.route === 'signin' ?
          <SignIn onRouteChange={this.onRouteChange}/> : <Register onRouteChange={this.onRouteChange}/>
        }
      </div>
    );
  }
}

export default App;
