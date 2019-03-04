import React, { Component } from 'react'; 
import Logo from './components/Logo/Logo.js';
import Navigation from './components/Navigation/Navigation.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import './App.css';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Particles from 'react-particles-js';
//const Clarifai = require('clarifai'); cara tulis dgn react adalah dibawah ni cara js biasa
//import Clarifai from 'clarifai'; //dipindah ke backend dlm image.js utk tujuan keselamatan
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';




const particesOption={
  particles:{
    number: {
      value: 50,
      density:{
        enable: true,
        value_area: 800
      }
    }
  }
}


const initialState = {

  input:'',
      imageurl:'',
      box:{},
      route: 'Signin',
      isSignedIn: false,
      user: {      // utk load newly register user , password xyzh return ke frontend
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }

}






//creatr state constructor tu
// super untk membolehkan this. digunakan
class App extends Component {
  constructor() {
    super();
    this.state= initialState;
  } 

//load user baru register, data adalah respond dari server
loadUser = (data) =>{
  this.setState({user : {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
  }})
}


//diremove kerna tidak diperlukan lg
// //datang dgn react
//  componentDidMount(){
//   fetch('http://localhost:3000')
//     .then(response => response.json())
//     .then(console.log)
//  }



  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box: box});
  }


calculateFaceLocation = (data) =>{

  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

  //buat DOM manipulation
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  //console.log(width, height);
 
 //return object yang menentukan 4  border ,ini akan isi box state{}
  return {
    leftCol: clarifaiFace.left_col * width, //clarifaiFace yg direturn adalah percentage
    topRow: clarifaiFace.top_row * height, //top_row adalah props kepada response, bleh rujuk doc clarifai
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow:height - (clarifaiFace.bottom_row * height)
  }
}

//masukkan event (eventlistener) 

//onsububmit disini menggunakan api Clarifai,, please refer to index dalm github utk lihat opt MODEL
 onInputChange = (event) => {
  console.log( event.target.value); 
  this.setState({input: event.target.value}); 
 }
 

 //xleh guna this.state.imageurl disni utk parse data walapun dh diset, kerana........itu cara setState works
//dapat error bad request
 onButtonSubmit=()=>{
// pas image url ke sebagai state(geng properties) ke component facerecognition
  this.setState({imageurl: this.state.input});
  console.log('click');
  fetch('http://localhost:3000/imageurl',{//ambik alamat ni
           method: 'post',                  //hantar ni
           headers: {'COntent-Type': 'application/json'},
           body: JSON.stringify({
           input: this.state.input 
          })
      })
   .then(response => response.json()) //kena buat response.json kerana ia fetch?? kena hantar dlm bentuk json over network jgn lupa
   .then(response => {
    if(response){
      fetch('http://localhost:3000/image',{
           method: 'put',
           headers: {'COntent-Type': 'application/json'},
           body: JSON.stringify({
           id: this.state.user.id
          })
      })
       .then(response => response.json())
           .then(count =>{
            //guna object.assign supaya setState x mengubah seluruh object user:john,,ni adalah js punya funcion
            this.setState(Object.assign(this.state.user, {entries: count}))
           })
           .catch(console.log)

    }
    this.displayFaceBox(this.calculateFaceLocation(response))
  }) //response masuk calcluateFacelocation pastu masuk displayFaceBox
      // acces response yn diberi API utk buat box kecik, boleh di dilhat dkt console
      //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
       //use this. kerana ini adalah class 
  .catch(err => console.log(err));
 }  

onRouteChange = (route) => {

   if(route === 'signout'){

    this.setState(initialState)//set state to asal 

  }else if (route === 'home'){

    this.setState({isSignedIn: true})
  }
  this.setState({route: route});

}



//gunakan this utk access property app 
  render() {

  const {isSignedIn, imageurl, route, box} = this.state;

    return (
      <div className="App">
        <Particles className='particles'
                params={particesOption} 
        />

          
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          
         { route === 'home' //conditional statements 
            ? <div>

                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition box={box} imageurl={imageurl} />  
             </div>

          : (

              route === 'Signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
         }
      </div>
    );
  }
}

export default App;

//kadang2 dapat error
// Line 53: 'input'is not defined no-undef
// adalah dsebabkan xguna this.state.input