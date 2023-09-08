import { useContext } from 'react'
import '../Header/header.css'
import Logo from './Assets/Transparent_Logo.png'
import {CgProfile} from 'react-icons/cg'
import {Link} from 'react-router-dom'
import {userContext} from '../App.jsx'

const Header = (props) => 
{
    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
    return(
        <div>
            <header>
                <Link to='/'><img src={Logo} alt='Logo' className='logo_mini'/></Link>
                <Link to='/' className='Name'>Teaching Assistantship Management System</Link>
                <div className='Profile_Page_Button'>
                    <Link to={'/'+props.type.toLowerCase()+'_profile'}><CgProfile className='icon' size={50} /></Link>
                </div>
                <div className='UserType'>
                    <center>{props.type}</center>
                </div>
                <div className="logout_btn" 
                    onClick={async () => 
                                {
                                    setUserEmail(null)
                                    setUserType(null)
                                    const token={
                                        token:userRefreshToken
                                    }
                                    await axiosJWT.post("http://localhost:9000/Logout",token, {headers:{'authorization':"Bearer "+userAccessToken}})
                                }}>
                    Logout
                </div>
            </header>
        </div>

    )
}

export default Header