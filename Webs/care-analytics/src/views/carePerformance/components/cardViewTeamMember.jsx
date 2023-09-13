// import React,{useState} from 'react'
// import Slider from "react-slick";
// const cardViewTeamMember = ({data}) => {
//   const [carosalSetting,setcarosalSetting] = useState({
//     dots: true,
//       infinite: true,
//       speed: 500,
//       slidesToShow: 4,
//       slidesToScroll: 1,
//       dots: false
//   });
// const handleNext = () => {
//     console.log('next button is clicked....')
//     slider.slickNext()
// }
// const handlePrevious = () => {
//     slider.slickPrev()
//     console.log('previous button is clicked....')
// }
// //   ref={c => (this.slider = c)} 
//     return (
//     <div className='container-fluid m-0 px-5 p-0'>
//         <div className='row w-75 m-0 p-0'>
//         <div>
//         <h2>Previous and Next methods</h2>
//         <Slider {...carosalSetting}>
//           <div key={1}>
//             <h3>1</h3>
//           </div>
//           <div key={2}>
//             <h3>2</h3>
//           </div>
//           <div key={3}>
//             <h3>3</h3>
//           </div>
//           <div key={4}>
//             <h3>4</h3>
//           </div>
//           <div key={5}>
//             <h3>5</h3>
//           </div>
//           <div key={6}>
//             <h3>6</h3>
//           </div>
//         </Slider>
//         <div style={{ textAlign: "center" }}>
//           <button className="button" onClick={handlePrevious}>
//             Previous
//           </button>
//           <button className="button" onClick={handleNext}>
//             Next
//           </button>
//         </div>
//       </div>
//         </div>     
        
      
//     </div>
//   )
// }

// export default cardViewTeamMember
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
      <div className="mt-3 container-fluid border border-0 border-success position-relative">
        <Slider ref={c => (this.slider = c)} {...settings}>
            {
                this.props?.data.map((item,index)=>{
                    return(
                        <div className="p-2 d-flex border border-0 border-danger">
                           <div className="m-0 d-flex flex-column w-100 rounded border border-1 bg-white p-2">
                             {/* Name and designation Column */}
                             <div className="d-flex flex-wrap w-100 border border-2 border-danger">
                               <p className=" m-0 p-0"> 
                                  {item?.memberName}
                               </p>
                             </div>
                             {/* Member Data Column*/}
                             <div className="d-flex flex-column m-0 p-0 border border-2 border-success">
                               <p className=" m-0 p-0"> 
                                  {item?.memberName}
                               </p>
                               <p className=" m-0 p-0"> 
                                  {item?.memberName}
                               </p>
                               <p className=" m-0 p-0"> 
                                  {item?.memberName}
                               </p>
                               <p className=" m-0 p-0"> 
                                  {item?.memberName}
                               </p>
                               <p className=" m-0 p-0"> 
                                  {item?.memberName}
                               </p>
                               <p className=" m-0 p-0"> 
                                  {item?.memberName}
                               </p>
                             </div>
                             <div className="d-flex align-items-center justify-content-end m-0 px-2 p-0 ">
                                  <Link className="d-flex text-decoration-none" to={'/user-profile'}>
                                     <small className="mx-3" style={{color:'#2196f3'}}>View Profile</small>
                                     <HiMiniArrowUpRight className="rounded-pill p-1 bg-dark" fill="#ffffff" size={20}/>
                                  </Link>
                             </div>
                           </div>
                        </div>
                    )
                })
            }   
        </Slider>
        <div className="mb-2 border border-0 border-danger position-absolute" style={{ right:25,top:-42}}>
          <button className="btn ghost m-0 p-0" onClick={this.previous}>
            <GrFormPrevious className='border border-1 bg-white rounded-pill p-1' size={27}/>
          </button>
          <button className="btn ghost m-0 p-0"  onClick={this.next}>
            <GrFormNext className='border border-1 bg-white rounded-pill p-0 mx-2'  size={27}/>
          </button>
        </div>
      </div>
    );
  }
}
