import React, { Component } from "react";
import {GrFormNext,GrFormPrevious} from 'react-icons/gr'
import { Link } from "react-router-dom";
import {HiMiniArrowUpRight} from 'react-icons/hi2'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default class cardViewTeamMember extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }
  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows:false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
        <div className="container testCon border border-0 border-dark" style={{minWidth:'100%'}}>

        
     <div className="position-relative border border-0 border-success mt-3 m-0 p-0" style={{width:'100%'}}>

        <Slider ref={c => (this.slider = c)} {...settings}>
            {
                this.props?.data.map((item,index)=>{
                    return(
                        <div className="p-2 d-flex border border-0 border-danger"> 
                        {/* Above div is for putting spacing  */}
                           <div className="m-0 d-flex flex-column w-100 border border-1 bg-white p-3" style={{borderRadius:'.5rem',maxWidth:'22.5rem'}}>
                             {/* Name and designation Column */}
                             <div className="d-flex justify-content-start align-items-center flex-wrap w-100 border border-0 border-danger">
                               <div className="p-3 d-flex align-items-center justify-content-center" style={{borderRadius:'1rem',backgroundColor:'#D2CEFE'}}>
                                    <p className="m-0 p-0" style={{fontSize:'1.5rem',color:'#573BFF'}}>
                                        VD
                                    </p>
                               </div>
                               <div className="mx-3 d-flex flex-column align-items-start justify-content-start border border-0 border-success">
                               <p className="m-0 mb-1 p-0 fw-bold" style={{fontSize:'1rem'}} > 
                                  {item?.memberName}
                               </p>
                               <p className="text-muted m-0 p-0" style={{fontSize:'.85rem'}}> 
                                  {item?.memberDesignation}
                               </p>

                               </div>
                             </div>
                             {/* Member Data Column*/}
                             <div className="d-flex flex-column my-2 m-0 p-0 border border-0 border-success">
                              {
                                Object.entries(item?.memberProfileData).map(([key,value])=>{
                                    return(
                               <p className="d-flex align-items-center justify-content-between border border-0 border-success my-2 p-0" > 
                                {console.log('Key is : ',key,'Value : ',value)}
                                 <span className="text-muted fw-light" style={{fontSIze:'.75rem'}}>
                                    {/* {item?.memberName} */}
                                    {key}
                                 </span> 
                                 <span className="text-dark fw-bold" style={{fontSIze:'1rem'}}>
                                    {/* {item?.memberName} */}
                                    {value}
                                 </span> 
                               </p>
                                    )
                                })
                              }
                             </div>
                             <div className="d-flex align-items-center justify-content-end m-0 px-2 p-0 ">
                                  <Link className="d-flex align-items-center text-decoration-none" to={'/user-profile'}>
                                     <small className="mx-3" style={{color:'#585CE5'}}>View Profile</small>
                                     <HiMiniArrowUpRight className="p-2" style={{backgroundColor:'#585CE5',borderRadius:'.5rem'}} fill="#ffffff" size={35}/>
                                  </Link>
                             </div>
                           </div>
                        </div>
                    )
                })
            }   
        </Slider>
        <div className="d-flex justify-content-end mb-2 border border-0 border-danger position-absolute" style={{ right:50,top:-48}}>
          <button className="btn border-none outline-none box-shadow-none ghost m-0 p-0" onClick={this.previous}>
            <GrFormPrevious className='border border-1 bg-white rounded-pill p-1' size={27}/>
          </button>
          <button className="btn ghost m-0 p-0"  onClick={this.next}>
            <GrFormNext className='border border-1 bg-white rounded-pill p-0 mx-2'  size={27}/>
          </button>
        </div>
     </div>
     </div>  
      
    );
  }
}
