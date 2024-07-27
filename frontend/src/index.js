import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import {BrowserRouter}from 'react-router-dom'


import configureStore from './store/configureStore';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'


const store = configureStore()
const root = ReactDOM.createRoot(document.getElementById('root'));
console.log(store.getState())
store.subscribe(() => {
  console.log('state updated', store.getState())
})

root.render(
  <BrowserRouter>
  <AuthProvider>

  <ToastContainer autoClose={3000} pauseOnHover={false} theme='light'
  />
  <Provider store={store}> 
    <App />
    </Provider>
  
    </AuthProvider>
  </BrowserRouter>
);

// provider component will have a value prop called as store takes the value of store
// reportWebVitals();
