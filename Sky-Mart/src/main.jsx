import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from "react-router"
import { ContextProvider } from './context/ContextProvider.jsx'

createRoot(document.getElementById('root')).render(
    <Router>
        <ContextProvider>
            <App />
        </ContextProvider>

    </Router>

)
