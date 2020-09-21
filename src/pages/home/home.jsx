import React, { Component } from 'react';
import Homescreen from '../../assets/homess.webp'
import TravelBook from '../../assets/travelbook.svg'
import Travelers from '../../assets/travelers.svg'
import Header from '../../components/Header'
import ButtonUi from '../../components/button'
import { Link } from "react-router-dom";
import './home.css'
class Home extends Component {
    state = {  }
    render() { 
        return (
            <div>
                <Header/>
                <div style={{width:'100%', height:'90vh'}}>
                    <img src={Homescreen} style={{objectFit:'cover'}} width='100%' height='100%'/>
                </div>
                <div className='text-white d-flex align-items-center px-5' style={{height:'8vh',backgroundColor:'#fe6b8b',justifyContent:"space-between"}}>
                    <div>
                       <b>Ada Promo</b>   
                    </div> 
                    <div>
                        <Link to='/products'>
                            <ButtonUi>
                                Lihat Promo
                            </ButtonUi>
                        </Link>
                    </div>
                </div>
                <div className='row p-0 m-0 mt-4'>
                    <div className="col-md-6 p-5 m-0 ">
                        <h2>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, nulla fuga iste debitis illum</h2>
                    </div>
                    <div className="col-md-6 pr-5 m-0" style={{height:'400px'}}>
                        <img src={TravelBook} alt="travelbook" width='100%'/>                        
                    </div>
                </div>
                <div className='row p-0 m-0 mt-2' >
                    <div className="col-md-6 pl-5 m-0" style={{height:'500px'}}>
                        <img src={Travelers} alt="travelers" width='100%' height='100%'/>                        
                    </div>
                    <div className="col-md-6 p-5 m-0">
                        <h2>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, nulla fuga iste debitis illum</h2>
                    </div>
                </div>
                <div className='text-white d-flex justify-content-center align-items-center' style={{height:'20vh',backgroundColor:'#fe6b8b'}}>
                    <h1>Gabung Yuk!</h1>
                </div>
            </div>
        );
    }
}
 
export default Home;