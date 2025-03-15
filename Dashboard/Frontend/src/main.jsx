import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom' 
import LoginForm from './Pages/LoginForm'
import Dashboard from './Pages/Dashboard'
import {LoginProvider} from './contexts/isLoggedIn'


createRoot(document.getElementById('root')).render(
    <LoginProvider>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginForm/>}/>
                <Route path='/Dashboard' element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    </LoginProvider>
)