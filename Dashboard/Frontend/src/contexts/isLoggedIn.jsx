import { createContext, useState, useContext} from 'react'

export const checkLogin = createContext();

export const LoginProvider = ({children}) => {
    //Use state fields modified through the application
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    return (
        <checkLogin.Provider value={{isLoggedIn, setIsLoggedIn}}>
        {children}
        </checkLogin.Provider>
    )
}