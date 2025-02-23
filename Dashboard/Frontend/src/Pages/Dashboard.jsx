import React from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { checkLogin } from '../contexts/isLoggedIn'

const Dashboard = () => {
    const {isLoggedIn, setIsLoggedIn} = useContext(checkLogin)
    return (
        <>
        {isLoggedIn?
            null
            :
            <Navigate to = "/"/>
        }
        Dashboard
        </>
    )
}

export default Dashboard