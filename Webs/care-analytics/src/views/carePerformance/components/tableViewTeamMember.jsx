import React,{useState} from 'react'
import { Stack,Table,Dropdown } from 'react-bootstrap'
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
const tableViewTeamMember = ({data,columns}) => {
  console.log('Data comming from the parent for the tabular form is : ',data);
  console.log('Columns comming from the parent for the tabular form is : ',columns);
  const [activeIndex,setactiveIndex] = useState(1);
  const [totalPageCount,settotalPageCount] = useState([1,2,3,4,5]);
  const handlePageChange = (pageNo) =>{
    // page number is ....... 
    // send the page number to the nextPage api to get the next page data for the table
    setactiveIndex(pageNo);
    console.log('Page no : ',pageNo);
  }
  return (
    <div className='container-fluid m-0 p-0'>

       <div className='row mt-3 m-0 p-2 rounded bg-white'>
             <div className='col-12 col-md-6'>
                <p className='fw-bold'>Team Member</p>
             </div>
             <div className='col-12 col-md-6 d-flex align-items-center justify-content-end border border-0 border-success'>
              <Stack className='border border-0 rounded' direction="horizontal" gap={0}>
                <div className="px-2 p-1 border border-1" style={{backgroundColor:'transparent',borderTopLeftRadius:'.25rem',borderBottomLeftRadius:'.25rem'}}>
                 <small className='text-dark'>Last 3 Years</small>
                 </div>
                <div className="px-2 p-1 border border-1 text-dark" style={{backgroundColor:'transparent'}}>
                <small>Year to Date</small>
                </div>
                <div className="px-2 p-1 text-light" style={{backgroundColor:'#494bbb',borderTopRightRadius:'.25rem',borderBottomRightRadius:'.25rem'}}>
                <small>Last 12 months</small>
                </div>
              </Stack>
             </div>
             <div className='col-12 mt-5 m-0 p-0'>
             <DataTable value={data} removableSort paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
               {columns.map((column) => (
                   <Column key={column.field} field={column.field} header={column.header} sortable />
                ))}
              </DataTable>
             </div>
       </div>
    </div>
  )
}

export default tableViewTeamMember
