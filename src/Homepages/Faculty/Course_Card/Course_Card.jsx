import React from 'react'
import './Course_Card.css'
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Course_Card = ({code}) => 
{
    
    const course_code = {course_code:code}
    
    const [course,set_course]=useState("")
    useEffect(() => 
    {
        const fetch_course = async () =>
        {
            const result = await axios.post("http://localhost:9000/fetch_course",course_code)
            set_course(result.data)  
        }
        fetch_course();
        

    },[])

    return (
        <div className='container'>
            <Link to="/Course_Page" state= {{course:course}}>
                <div className='image'>
                    <center><img src="https://drive.google.com/uc?export=view&id=1t5_0dABTBIsX1-79erOvLmCUcEYwffsI" height="240" max-width="250"/></center>
                </div>
                <p><center>{course.name+" ("+code+")"}</center></p>
            </Link>
        </div>
    )
}

export default Course_Card