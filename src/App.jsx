import React, { useState } from 'react'
import Login_page from './Login_Page/Login_page.jsx'
import Recover_pass from './Login_Page/Recover_pass/Recover_pass.jsx'
import Admin_homepage from './Homepages/Admin/admin_homepage.jsx'
import Admin_Profile from './Homepages/Admin/Profile_Page/admin_profile_page.jsx'
import TA_homepage from './Homepages/TA/TA_Homepage.jsx'
import Add_TAs from './Homepages/Admin/TA_Ops/Add_TA/Add_TA.jsx'
import Add_Faculty from './Homepages/Admin/Faculty_Ops/Add_Faculty/Add_Faculty.jsx'
import Add_Course from './Homepages/Admin/Course_Ops/Add_Course/Add_Course.jsx'
import Apply from './Homepages/TA/Apply/Apply.jsx'
import Mapping from './Homepages/Admin/Map_TA_Faculty/Map_TA_Faculty.jsx'
import Faculty_Page from './Homepages/Admin/Map_TA_Faculty/Faculty_Page/Faculty_Page.jsx'
import Faculty_homepage from './Homepages/Faculty/Faculty_Homepage.jsx'
import Faculty_Profile from './Homepages/Profile_Page/Faculty_Profile_Page.jsx'
import Task_Assignment from './Homepages/Faculty/Task_Assignment/Task_Assignment.jsx'
import Course_Page from './Homepages/Faculty/Course_Page/Course_Page.jsx'
import View_Tasks from './Homepages/Faculty/View_Tasks/View_Tasks.jsx'
import Ops from './Homepages/Admin/Ops.jsx'
import Edit_TA from './Homepages/Admin/TA_Ops/Edit_TA/Edit_TA.jsx'
import Edit_TA_Details from './Homepages/Admin/TA_Ops/Edit_TA/Edit_TA_Details/Edit_TA_Details.jsx'
import TA_Profile_Page from './Homepages/TA/Profile_Page/TA_Profile_Page.jsx'
import Edit_Faculty from './Homepages/Admin/Faculty_Ops/Edit_Faculty/Edit_Faculty.jsx'
import Edit_Faculty_Details from './Homepages/Admin/Faculty_Ops/Edit_Faculty/Edit_Faculty_Details/Edit_Faculty_Details.jsx'
import Edit_Course from './Homepages/Admin/Course_Ops/Edit_Course/Edit_Course.jsx'
import Edit_Course_Details from './Homepages/Admin/Course_Ops/Edit_Course/Edit_Course_Details/Edit_Course_Details.jsx'
import {Routes, BrowserRouter as Router, Route} from 'react-router-dom' /*Routes = Switch-case from C++*/


function App() 
{
  const [user,setloginuser] = useState({})
  return (
    <> 
    <Router>
      <Routes>
		    <Route exact path="/" element =
          {
            user && user._id ? (user.type=="TA" ? <TA_homepage setloginuser={setloginuser} email={user.email}/> : user.type=="Faculty" ? <Faculty_homepage setloginuser={setloginuser} courses={user.courses}/> : user.type=="Admin" ? <Admin_homepage setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/> ) : <Login_page setloginuser={setloginuser}/>
          }
        />
        <Route exact path="/Login" element =
          {
            <Login_page setloginuser={setloginuser}/>
          }
        /> 
        <Route exact path="/Recover_pass" element =
        {
          <Recover_pass setloginuser={setloginuser}/>
        }
        />   
        <Route exact path="/Add_TA" element =
          {
            user && user._id && user.type=="Admin" ? <Add_TAs setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/>
          }
        />
        <Route exact path="/Add_Faculty" element =
          {
            user && user._id && user.type=="Admin"? <Add_Faculty setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/>
          }
        />
        <Route exact path="/Add_Course" element =
          {
            user && user._id && user.type=="Admin" ? <Add_Course setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/>
          }
        />
        <Route exact path="/Apply" element =
          {
            user && user._id && user.type=="TA" ? <Apply setloginuser={setloginuser} user_email={user.email}/> : <Login_page setloginuser={setloginuser}/>
          }
        />
        <Route exact path="/Map" element =
          {
            user && user._id && user.type=="Admin" ? <Mapping setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/>
          }
        />
        <Route exact path="/Faculty_Page" element =
          {
            user && user._id && user.type=="Admin" ? <Faculty_Page setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/>
          }
        />
        <Route exact path="/faculty_profile" element =
        {
          user && user._id && user.type=="Faculty" ? <Faculty_Profile setloginuser={setloginuser} email={user.email} TA_Emails={user.TA_Emails}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/Course_Page" element =
        {
          user && user._id && user.type=="Faculty" ? <Course_Page setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/Assign_Task_Page" element =
        {
          user && user._id && user.type=="Faculty" ? <Task_Assignment setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/View_Tasks_Page" element =
        {
          user && user._id && user.type=="Faculty" ? <View_Tasks setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/Ops" element =
        {
          user && user._id && user.type=="Admin" ? <Ops setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/admin_profile" element =
        {
          user && user._id && user.type=="Admin" ? <Admin_Profile setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/Edit_TA" element =
        {
          user && user._id && user.type=="Admin" ? <Edit_TA setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/Edit_TA_Details" element =
        {
          user && user._id && user.type=="Admin" ? <Edit_TA_Details setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/ta_profile" element =
        {
          user && user._id && user.type=="TA" ? <TA_Profile_Page setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route path="/Edit_Faculty" element =
        {
          user && user._id && user.type=="Admin" ? <Edit_Faculty setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/Edit_Faculty_Details" element =
        {
          user && user._id && user.type=="Admin" ? <Edit_Faculty_Details setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
         <Route path="/Edit_Course" element =
        {
          user && user._id && user.type=="Admin" ? <Edit_Course setloginuser={setloginuser} email={user.email}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        <Route exact path="/Edit_Course_Details" element =
        {
          user && user._id && user.type=="Admin" ? <Edit_Course_Details setloginuser={setloginuser}/> : <Login_page setloginuser={setloginuser}/>
        }
        />
        
	    </Routes>
    </Router>
    </>
  );
}

export default App