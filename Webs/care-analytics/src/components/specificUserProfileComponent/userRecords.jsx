import React from 'react'

const userRecords = ({recordData}) => {
  return (
    <div className="d-flex flex-wrap justify-content-between m-0 p-0 border border-0 border-success h-100" style={{flex:1}}>
    {
        recordData&&recordData.map((item,index)=>{
          return(
           <div className="d-flex flex-column m-0 py-0 p-2  w-50">
           <div className="d-flex flex-column justify-content-between border border-1 bg-white rounded h-100 mb-3" style={{padding:'1.5rem',boxShadow:'0px 3px 1px #EBECF0',opacity:1}}>
            <p className="text-muted text-wrap fw-light" style={{fontSize:'1rem'}}>
               {item?.genralCountText}
            </p>
            <p className="mb-1">
              <span className="text-dark fw-bold">
                   {item?.genralCountAchive}
              </span>/<small className="text-muted fw-light">
                   {item?.genralCountTotall}
              </small>
            </p> 
           </div>
          </div>
          )
      })
    }
  </div>
  )
}

export default userRecords
