import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
//import firebase from './service/firebaseConnection'
import AuthProvider from './contexts/auth';
import Routes from './routes'
import { ToastContainer } from 'react-toastify';

import './App.css';


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={3000} />
        <Routes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;