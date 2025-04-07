import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';  // Importando o Router
import App from './App';  // Componente principal (App.jsx)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* Envolvendo o App.jsx com Router aqui */}
      <App />
    </Router>
  </React.StrictMode>
);
