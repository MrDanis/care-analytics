import React from 'react'
import { CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const allUserStats = ({userData}) => {
    console.log('User data comming from the parent screen is : ',userData);
  return (
    <div className="border border-1 bg-white p-2 rounded" style={{flex:1}}>
    <p className="fw-bold">
       All Stats
    </p>
    <div className='row mt-2 m-0 p-0 border border-0 border-success'>
      {
        userData.map((item,index)=>{
          return(
          <div className='col-sm-6 border border-0 border-danger d-flex flex-column align-items-center justify-content-center'>
               <p className='text-muted my-2 m-0'>{item.genralStatsText}</p>
               <div style={{width:'150px'}}>
                   <CircularProgressbarWithChildren styles={buildStyles({
                      pathColor:index===0?'rgb(0 198 249)':index===1?'rgb(166 166 255)':index===2?'rgb(220 189 92)':'rgb(88 92 229)',
                      trailColor:'rgb(245 247 254)'})}
                      value={parseInt(item?.genralStatsValPercent)}
                    >
                    <div className='m-0 p-0 border border-0 border-dark' style={{ marginTop: -5 }}>
                          <p className='m-0 p-0 text-center text-dark fw-bold fs-4'>
                            {item?.genralStatsValPercent}%
                          </p>
                          <p className='m-0 p-0 text-muted text-center'>
                          <span className='text-muted'>{item?.genralStatsAchiveVal}</span>/<span className='text-muted'>{item?.genralStatsTotalVal}</span>
                          </p>
                    </div>
                   </CircularProgressbarWithChildren>
               </div>
          </div>
          )
        })
      }

    </div>
 </div>
  )
}

export default allUserStats
