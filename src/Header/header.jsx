import react from 'react'
import '../Header/header.css'
import Logo from './Assets/Transparent_Logo.png'
import {CgProfile} from 'react-icons/cg'
import {Link} from 'react-router-dom'

const Header = (props) => 
{
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
                <div className="logout_btn" onClick={() => props.login_state.setloginuser({})}>Logout</div>
            </header>
        </div>

    )
}

export default Header