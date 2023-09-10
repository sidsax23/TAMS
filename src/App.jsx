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
import View_Edit_Tasks from './Homepages/Faculty/View_Edit_Tasks/View_Edit_Tasks.jsx'
import Ops from './Homepages/Admin/Ops.jsx'
import Edit_TA from './Homepages/Admin/TA_Ops/Edit_TA/Edit_TA.jsx'
import Edit_TA_Details from './Homepages/Admin/TA_Ops/Edit_TA/Edit_TA_Details/Edit_TA_Details.jsx'
import TA_Profile_Page from './Homepages/TA/Profile_Page/TA_Profile_Page.jsx'
import Edit_Faculty from './Homepages/Admin/Faculty_Ops/Edit_Faculty/Edit_Faculty.jsx'
import Edit_Faculty_Details from './Homepages/Admin/Faculty_Ops/Edit_Faculty/Edit_Faculty_Details/Edit_Faculty_Details.jsx'
import Edit_Course from './Homepages/Admin/Course_Ops/Edit_Course/Edit_Course.jsx'
import Edit_Course_Details from './Homepages/Admin/Course_Ops/Edit_Course/Edit_Course_Details/Edit_Course_Details.jsx'
import Edit_Task_Details from './Homepages/Faculty/View_Edit_Tasks/Edit_Task_Details/Edit_Task_Details.jsx'
import {Routes, BrowserRouter as Router, Route} from 'react-router-dom' /*Routes = Switch-case from C++*/
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import {logout} from './login_functions.jsx'
import { useEffect } from 'react'


function App() 
{
  const [userEmail,setUserEmail] = useState(localStorage.getItem('userEmail')?localStorage.getItem('userEmail'):null)
  const [userType,setUserType] = useState(localStorage.getItem('userType')?localStorage.getItem('userType'):null)
  const [userAccessToken,setUserAccessToken] = useState(localStorage.getItem('userAccessToken')?localStorage.getItem('userAccessToken'):null)
  const [userRefreshToken,setUserRefreshToken] = useState(localStorage.getItem('userRefreshToken')?localStorage.getItem('userRefreshToken'):null)

  //Refreshing the access token once it expires
  const refreshToken = async() =>
  {
    var accessToken=null;
    try
    {
      const token ={
        token:userRefreshToken
      }
      await axios.post("http://localhost:9000/Refresh",token).then(async(res)=>{
        setUserAccessToken(res.data.accessToken);
        setUserRefreshToken(res.data.refreshToken);
        accessToken=res.data.accessToken;
      })
      return accessToken;
    }
    catch(err)
    {
      console.log(err);
    }
  }

  //To Refresh the token automatically, we can use axios interceptors
  /*
  Axios interceptors are functions that are called before a request is sent and after a response is received. 
  The official doc mentions that you can “intercept” requests and responses before they are handled.
  */
  const axiosJWT =axios.create()
  axiosJWT.interceptors.request.use( async (config) => 
  {
      let currentDate = new Date();
      //Decoding the token to see its expiry
      const decodedToken = jwt_decode(userAccessToken);
      //checking if it is expired
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        
        const data=await refreshToken()
        //Add new token to header of the axios call that was intercepted with the expired token
        config.headers["authorization"] = "Bearer "+data;
      }
      return config;
  },
  //Reject everything if there is an error
  (error) =>
  {
    return Promise.reject(error)
  })

  //Logging out the user across all tabs if the user logs out from any open tab.
  window.addEventListener("storage", () => {
    const email = window.localStorage.getItem("userEmail");
    if(email==null)
    {
      logout(setUserEmail,setUserType,userAccessToken,userRefreshToken,axiosJWT);
    }

  });

  
  return (
    //Context will be avaiable to all components inside this and since all components are called here, it may be considered global
    <userContext.Provider value={[userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT]}> 
    <Router>
      <Routes>
		    <Route exact path="/" element =
          {
            userEmail ? (userType=="TA" ? <TA_homepage email={userEmail}/>  : userType=="Faculty" ? <Faculty_homepage/> : userType=="Admin" ? <Admin_homepage/> : <Login_page/> ) : <Login_page/>
          }
        />
        <Route exact path="/Login" element =
          {
            <Login_page />
          }
        /> 
        <Route exact path="/Recover_pass" element =
        {
          <Recover_pass/>
        }
        />   
        <Route exact path="/Add_TA" element =
          {
            userEmail && userType=="Admin" ? <Add_TAs/> : <Login_page/>
          }
        />
        <Route exact path="/Add_Faculty" element =
          {
            userEmail && userType=="Admin"? <Add_Faculty/> : <Login_page/>
          }
        />
        <Route exact path="/Add_Course" element =
          {
            userEmail && userType=="Admin" ? <Add_Course/> : <Login_page/>
          }
        />
        <Route exact path="/Apply" element =
          {
            userEmail && userType=="TA" ? <Apply  user_email={userEmail} /> : <Login_page/>
          }
        />
        <Route exact path="/Map" element =
          {
            userEmail && userType=="Admin" ? <Mapping/> : <Login_page/>
          }
        />
        <Route exact path="/Faculty_Page" element =
          {
            userEmail && userType=="Admin" ? <Faculty_Page/> : <Login_page/>
          }
        />
        <Route exact path="/faculty_profile" element =
        {
          userEmail && userType=="Faculty" ? <Faculty_Profile  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/Course_Page" element =
        {
          userEmail && userType=="Faculty" ? <Course_Page  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/Assign_Task_Page" element =
        {
          userEmail && userType=="Faculty" ? <Task_Assignment  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/View_Edit_Tasks_Page" element =
        {
          userEmail && userType=="Faculty" ? <View_Edit_Tasks  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/Ops" element =
        {
          userEmail && userType=="Admin" ? <Ops  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/admin_profile" element =
        {
          userEmail && userType=="Admin" ? <Admin_Profile  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/Edit_TA" element =
        {
          userEmail && userType=="Admin" ? <Edit_TA  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/Edit_TA_Details" element =
        {
          userEmail && userType=="Admin" ? <Edit_TA_Details/> : <Login_page/>
        }
        />
        <Route exact path="/ta_profile" element =
        {
          userEmail && userType=="TA" ? <TA_Profile_Page  email={userEmail} /> : <Login_page/>
        }
        />
        <Route path="/Edit_Faculty" element =
        {
          userEmail && userType=="Admin" ? <Edit_Faculty  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/Edit_Faculty_Details" element =
        {
          userEmail && userType=="Admin" ? <Edit_Faculty_Details/> : <Login_page/>
        }
        />
         <Route path="/Edit_Course" element =
        {
          userEmail && userType=="Admin" ? <Edit_Course  email={userEmail} /> : <Login_page/>
        }
        />
        <Route exact path="/Edit_Course_Details" element =
        {
          userEmail && userType=="Admin" ? <Edit_Course_Details/> : <Login_page/>
        }
        />
        <Route exact path="/Edit_Task_Details" element =
        {
          userEmail && userType=="Faculty" ? <Edit_Task_Details  email={userEmail} /> : <Login_page/>
        }
        />
        
	    </Routes>
    </Router>
    </userContext.Provider>
  );
}

export default App
export const userContext = React.createContext()