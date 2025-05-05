import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom' 
import LoginForm from './Pages/LoginForm'
import Dashboard from './Pages/Dashboard'
import ProtectedRoute from './JWT/ProtectedRoute';
import { AuthProvider } from './contexts/isLoggedIn'; // Ensure this path is correct



createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginForm/>}/>
                <Route path='/Dashboard' element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
)