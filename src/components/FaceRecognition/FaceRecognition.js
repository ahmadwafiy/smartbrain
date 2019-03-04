 import React from 'react';
 import './FaceRecognition.css';

//pastikan paramaeter yang diterima exactly sama dengan props/state yang dihantar dari parents
 const FaceRecognition = ({ imageurl, box }) => {
  return (

  		<div className='center ma'>
        <div className='absolute mt2'>
          <img alt='' id='inputimage' src={imageurl} width='500px' height='auto' />
          <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left:box.leftCol}} ></div>
        </div>
  		</div>

 	);
 }

 export default FaceRecognition; 