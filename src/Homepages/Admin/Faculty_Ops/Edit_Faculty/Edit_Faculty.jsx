import React from 'react'
import Header from '../../../../Header/header.jsx'
import './Edit_Faculty.css'
import DataTable from 'react-data-table-component'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CSVLink } from 'react-csv'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css' 
import { useContext } from 'react';
import {userContext} from '../../../../App.jsx'

const Edit_Faculty = (props) => {

  const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   

  const [faculties,set_faculties] = useState([])
  const [selected_data,set_selected_data] = useState([])
  const [filtered_faculties,set_filtered_faculties] = useState([])
  const [search,set_search] = useState("")
  const [updation_flag,set_updation_flag] = useState(0)
  const [popup1,set_popup1] = useState(false)
  const [popup2,set_popup2] = useState(false)
  const [inner_popup1,set_inner_popup1] = useState(false)
  const [inner_popup1_message,set_inner_popup1_message] = useState("")
  const [inner_popup2,set_inner_popup2] = useState(false)
  const [inner_popup2_message,set_inner_popup2_message] = useState("")


  const get_faculties = async() =>
  {
    try 
    {
      const response = await axiosJWT.get("http://localhost:9000/fetch_faculties", {headers:{'authorization':"Bearer "+userAccessToken}})
      set_faculties(response.data)
      set_filtered_faculties(response.data)
      set_updation_flag(1)
    } 
    catch (error) 
    {
      console.log(error)      
    }

  }

  if(updation_flag==1)
  {
     set_faculty_names()
  }

  async function set_faculty_names()
  {
      for(var i=0;i<faculties.length;i++)
      {
        const email = {email : faculties[i].Faculty_Email}
        const faculty = await axiosJWT.post("http://localhost:9000/fetch_faculty_by_email",email, {headers:{'authorization':"Bearer "+userAccessToken}}) 
        faculties[i].faculty_name = faculty.data.name; 
      }
      set_updation_flag(0)
  }
  

  useEffect(() => 
  {
    get_faculties();
      
  }, [])

  useEffect(() => 
  {
    const result = faculties.filter( (faculty) => {

      return faculty.name.toLowerCase().match(search.toLowerCase())

    })
    set_filtered_faculties(result)

  },[search])

  

  //HEADERS FOR EXPORTING DATA
  const headers = [
    {
      label:"Name",
      key : "name"
    },
    {
      label:"BITS Email ID",
      key : "email"
    },
    {
      label:"Password",
      key : "pass"
    },
    {
      label:"Department",
      key : "dept"
    },
    {
      label:"Phone Number",
      key : "phone_num"
    },
    {
      label:"Course 1",
      key : "courses[0]"
    },
    {
      label:"Course 2",
      key : "courses[1]"
    },
    {
      label:"Course 3",
      key : "courses[2]"
    },
    {
      label:"Course 4",
      key : "courses[3]"
    },
    {
      label:"Course 5",
      key : "courses[4]"
    },
    {
      label:"Image URL",
      key : "image_url"
    },
    {
      label:"TA 1",
      key : "TA_Emails[0]"
    },
    {
      label:"TA 2",
      key : "TA_Emails[1]"
    },
    {
      label:"TA 3",
      key : "TA_Emails[2]"
    },
    {
      label:"TA 4",
      key : "TA_Emails[3]"
    },
    {
      label:"TA 5",
      key : "TA_Emails[4]"
    }
  ]

  //DATA TO BE EXPORTED
  const csvLink = {
    filename: "Faculty_Data.CSV",
    headers: headers,
    data: selected_data
  }

  //DELETION
  const delete_records = () =>
  {
    const Faculty_Details = {
      emails:[],
      ids:[],
      TA_Emails:[]
    }
    for(var i=0;i<selected_data.length;i++)
    {
      Faculty_Details.ids.push(selected_data[i]._id)
      Faculty_Details.emails.push(selected_data[i].email)
      for(var j=0;j<selected_data[i].TA_Emails.length;j++)
      {
        Faculty_Details.TA_Emails.push(selected_data[i].TA_Emails[j])
      }
      
    }
    
    axiosJWT.post("http://localhost:9000/Delete_Faculties", Faculty_Details, {headers:{'authorization':"Bearer "+userAccessToken}}).then( (res) =>
    {

      set_inner_popup1_message(res.data)
      set_popup1(false)
      set_inner_popup1(true)
      get_faculties()
    })
  }

   //Reset TA-Ship
   const reset_records = () =>
   {
     const Faculty_Details = {
       ids:[],
       TA_Emails:[],
       emails:[]
     }
     for(var i=0;i<selected_data.length;i++)
     {
       Faculty_Details.ids.push(selected_data[i]._id)
       Faculty_Details.emails.push(selected_data[i].email)
       for(var j=0;j<selected_data[i].TA_Emails.length;j++)
       {
         Faculty_Details.TA_Emails.push(selected_data[i].TA_Emails[j])
       }
     }
     
     axiosJWT.post("http://localhost:9000/Reset_TA-Ship_Faculties", Faculty_Details, {headers:{'authorization':"Bearer "+userAccessToken}}).then( (res) =>
     {
       set_inner_popup2_message(res.data)
       set_popup2(false)
       set_inner_popup2(true)
       get_faculties()
     })
   }



  //TABLE HEADERS
  const columns =[
    {
      name:"Name",
      selector: (row) => row.name,
      sortable : true
    },
    {
      name:"BITS Email",
      selector: (row) => row.email,
      sortable : true
    },
    {
      name:"Department",
      selector: (row) => row.dept,
      sortable : true
    },
    {
      name:"TAs",
      selector: (row) => row.TA_Emails.length,
      sortable : true
    },
    {
      name:"Courses Offered",
      selector: (row) => row.courses.filter(course => course!="")+" ",
      sortable : true
    },
    {
      name:"Edit",
      cell: (row) => <Link to="/Edit_Faculty_Details" className='small_btn' state={{Faculty:row}}>EDIT</Link>
    }
  ]


  return (
    <div>
      <Header login_state={props} type={"Admin"}/>
      <div className='item_box'>
          <center>
          <h1>FACULTY LIST</h1>
          <br/>
          <DataTable 
            columns={columns} 
            data={filtered_faculties} 
            fixedHeader 
            selectableRows
            selectableRowsHighlight
            onSelectedRowsChange={(e) => set_selected_data(e.selectedRows)}
            highlightOnHover
            pagination
            subHeader
            subHeaderComponent = 
            {
              <div>
              <p>Search by name : &emsp; <input type="text" placeholder='Search...' className='search_bar' value={search} onChange={(e) => set_search(e.target.value)}/></p>
              </div>
            }
            subHeaderAlign="left"
          />
          <br/>
          <CSVLink className='export_btn' {...csvLink}>Export</CSVLink>
          <div className='export_btn' onClick={()=>{set_popup1(o => !o)}}> Delete </div>
          <div className='export_btn' onClick={()=>{set_popup2(o => !o)}}> Reset TA-Ship </div>
          <Popup open={popup1} modal closeOnDocumentClick onClose={()=>{set_popup1(false)}}>
            <center> 
              <br/>
              <p><center>{selected_data.length==0 ? "Please select at least one record" : selected_data.length==1? "Are you sure you want to delete 1 record ?" : "Are you sure you want to delete "+selected_data.length+" records ?" }</center></p>
              <br/>
              {selected_data.length==0 ? <div><div className='export_btn' onClick={()=>{set_popup1(false)}}>Ok</div><br/></div> : <div><div className='export_btn' onClick={delete_records}>Yes</div><div className='export_btn' onClick={()=>{set_popup1(false)}} >No</div></div>}
              <br/>
            </center>
          </Popup>
          <Popup open = {inner_popup1} closeOnDocumentClick  onClose={()=>{set_inner_popup1(false)}}>
          <center> 
              <br/>
              <center><div className={inner_popup1_message=='Deletion Successfull!' ? 'SuccessMsg' : 'ErrorMsg'}>{inner_popup1_message}</div></center>
              <br/>
              <div className='export_btn' onClick={()=>{set_inner_popup1(false)}}>Ok</div>
              <br/>
              <br/>
            </center>
          </Popup>
          <Popup open={popup2} modal closeOnDocumentClick onClose={()=>{set_popup2(false)}}>
            <center> 
              <br/>
              <p><center>{selected_data.length==0 ? "Please select at least one record" : selected_data.length==1? "Are you sure you want to reset TA-Ship for 1 faculty ?" : "Are you sure you want to reset TA-Ship for "+selected_data.length+" faculties ?" }</center></p>
              <br/>
              {selected_data.length==0 ? <div><div className='export_btn' onClick={()=>{set_popup2(false)}}>Ok</div><br/></div> : <div><div className='export_btn' onClick={reset_records}>Yes</div><div className='export_btn' onClick={()=>{set_popup2(false)}}>No</div></div>}
              <br/>
            </center>
          </Popup>
          <Popup open = {inner_popup2} closeOnDocumentClick onClose={()=>{set_inner_popup2(false)}}>
          <center> 
              <br/>
              <center><div className={inner_popup2_message=='TA-Ship Reset Successfull!' ? 'SuccessMsg' : 'ErrorMsg'}>{inner_popup2_message}</div></center>
              <br/>
              <div className='export_btn' onClick={()=>{set_inner_popup2(false)}}>Ok</div>
              <br/>
              <br/>
            </center>
          </Popup>
          </center>
          <br/>
      </div>
    </div>
  )
}

export default Edit_Faculty