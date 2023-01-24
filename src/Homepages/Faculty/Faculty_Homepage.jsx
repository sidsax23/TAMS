import React,{useState} from 'react'
import './Faculty_Homepage.css'
import Header from '../../Header/header.jsx'
import Course_Card from './Course_Card/Course_Card.jsx'
import { Link } from 'react-router-dom'

const Faculty_homepage = (props) => 
{

    return(
        <div>
            <Header login_state={props} type={"FACULTY"}/>
                <div className='lander'>
                    <center>
                    <h1>FACULTY DASHBOARD</h1>
                    <br/>
                    <br/>
                    <h2>COURSES</h2>
                    <br/>
                    </center>
                    <div className='Course_details'>
                            <div className='courses'>
                            {
                                
                                props.courses && props.courses.filter(course=>course!="").map((course) => 
                                (
                                    <Course_Card code={course} />
                                ))
                            }   
                        </div>
                    </div>
                    <br/>
                </div>
        </div>
    )
}

export default Faculty_homepage