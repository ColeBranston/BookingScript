import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom' 
import LoginForm from './Pages/LoginForm'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<LoginForm/>}/>
    </Routes>
    </BrowserRouter>

)
