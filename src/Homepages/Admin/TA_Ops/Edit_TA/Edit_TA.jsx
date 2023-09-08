import React from 'react'
import Header from '../../../../Header/header.jsx'
import './Edit_TA.css'
import DataTable from 'react-data-table-component'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CSVLink } from 'react-csv'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css' 
import { useContext } from 'react';
import {userContext} from '../../../../App.jsx'

const Edit_TA = (props) => {
  
  const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   

  const [students,set_students] = useState([])
  const [selected_data,set_selected_data] = useState([])
  const [filtered_students,set_filtered_students] = useState([])
  const [search,set_search] = useState("")
  const [updation_flag,set_updation_flag] = useState(0)
  const [popup1,set_popup1] = useState(false)
  const [popup2,set_popup2] = useState(false)
  const [inner_popup1,set_inner_popup1] = useState(false)
  const [inner_popup1_message,set_inner_popup1_message] = useState("")
  const [inner_popup2,set_inner_popup2] = useState(false)
  const [inner_popup2_message,set_inner_popup2_message] = useState("")

  const get_students = async() =>
  {
    try 
    {
      const response = await axiosJWT.get("http://localhost:9000/fetch_students", {headers:{'authorization':"Bearer "+userAccessToken}})
      set_students(response.data)
      set_filtered_students(response.data)
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
      for(var i=0;i<students.length;i++)
      {
        const email = {email : students[i].Faculty_Email}
        const faculty = await axiosJWT.post("http://localhost:9000/fetch_faculty_by_email",email, {headers:{'authorization':"Bearer "+userAccessToken}}) 
        students[i].faculty_name = faculty.data.name; 
      }
      set_updation_flag(0)
  }
  

  useEffect(() => 
  {
    get_students();   
  }, [])

  useEffect(() => 
  {
    const result = students.filter( (student) => {

      return student.name.toLowerCase().match(search.toLowerCase())

    })
    set_filtered_students(result)

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
      label:"Course Choice 1",
      key : "course1"
    },
    {
      label:"Course Choice 2",
      key : "course2"
    },
    {
      label:"Course Choice 3",
      key : "course3"
    },
    {
      label:"Application Status",
      key : "Application_Status"
    },
    {
      label:"Assigned Faculty Name",
      key : "faculty_name"
    },
    {
      label:"Assigned Faculty Email",
      key : "Faculty_Email"
    },
    {
      label:"Assigned Coruse",
      key : "Final_Course_Code"
    }
  ]

  //DATA TO BE EXPORTED
  const csvLink = {
    filename: "TA_Data.CSV",
    headers: headers,
    data: selected_data
  }

  //DELETION
  const delete_records = () =>
  {
    const TA_Details = {
      emails:[],
      ids:[],
      Faculty_Emails:[]
    }
    for(var i=0;i<selected_data.length;i++)
    {
      TA_Details.ids.push(selected_data[i]._id)
      TA_Details.Faculty_Emails.push(selected_data[i].Faculty_Email)
      TA_Details.emails.push(selected_data[i].email)
    }
    
    axiosJWT.post("http://localhost:9000/Delete_TAs", TA_Details, {headers:{'authorization':"Bearer "+userAccessToken}}).then( (res) =>
    {

      set_inner_popup1_message(res.data)
      set_popup1(false)
      set_inner_popup1(true)
      get_students()
    })
  }

   //Reset TA-Ship
   const reset_records = () =>
   {
     const TA_Details = {
       ids:[],
       Faculty_Emails:[],
       emails:[]
     }
     for(var i=0;i<selected_data.length;i++)
     {
       TA_Details.ids.push(selected_data[i]._id)
       TA_Details.Faculty_Emails.push(selected_data[i].Faculty_Email)
       TA_Details.emails.push(selected_data[i].email)
     }
     
     axiosJWT.post("http://localhost:9000/Reset_TA-Ship_TAs", TA_Details, {headers:{'authorization':"Bearer "+userAccessToken}}).then( (res) =>
     {
       set_inner_popup2_message(res.data)
       set_popup2(false)
       set_inner_popup2(true)
       get_students()
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
      name:"Application Status",
      selector: (row) => row.Application_Status,
      sortable : true
    },
    {
      name:"Faculty",
      selector: (row) => row.faculty_name,
      sortable : true
    },
    {
      name:"Course Code",
      selector: (row) => row.Final_Course_Code,
      sortable : true
    },
    {
      name:"Edit",
      cell: (row) => <Link to="/Edit_TA_Details" className='small_btn' state={{TA:row}}>EDIT</Link>
    }
  ]


  return (
    <div>
      <Header login_state={props} type={"Admin"}/>
      <div className='item_box'>
          <center>
          <h1>STUDENT LIST</h1>
          <br/>
          <DataTable 
            columns={columns} 
            data={filtered_students} 
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
              <p><center>{selected_data.length==0 ? "Please select at least one record" : selected_data.length==1? "Are you sure you want to reset TA-Ship for 1 student ?" : "Are you sure you want to reset TA-Ship for "+selected_data.length+" students ?" }</center></p>
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

export default Edit_TA