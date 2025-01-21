import React from 'react';
import { useNavigate } from 'react-router-dom';
import homeImage from '../assets/home .png';  
import './HomePage.css';


const HomePage = () => {
  const navigate = useNavigate();

  const goToStore = () => {
    navigate('/sales');
  };
  return (
    <div className="home-box">
      {}
      <div className="content">
        <h1 className="text">
         <span className="highlight">Welcome to</span> Store
         </h1>
         <h6><p className="para">
            Discover an all-in-one store offering a diverse range of high-quality products, <br />
             from everyday essentials to premium selections, tailored to meet your every need. <br />
             Shop with confidence and enjoy a seamless experience under one roof!
          </p></h6>

        <button onClick={goToStore} className="go-to-store-btn">Go to Store</button>
       </div>

  
      {}
      <div className="image-section" style={{ backgroundImage: `url(${homeImage})` }}></div>
    </div>
  );
  
  
  
};

export default HomePage;
