import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom' 
import LoginForm from './Pages/LoginForm'
import Dashboard from './Pages/Dashboard'
import ProtectedRoute from './JWT/ProtectedRoute';



createRoot(document.getElementById('root')).render(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginForm/>}/>
                <Route
                path="/Dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
                />
            </Routes>
        </BrowserRouter>
)
