import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Signup from './pages/Signup/Signup'
import ChangeUserDataPassword from './pages/ChangeUserData/Password/ChangeUserDataPassword'
import ChangeUserDataMail from './pages/ChangeUserData/Mail/ChangeUserDataMail'
import ChangeUserDataName from './pages/ChangeUserData/Name/ChangeUserDataName'
import ChangeUserDataSurname from './pages/ChangeUserData/Surname/ChangeUserDataSurname'
import ManageUsers from './pages/ManageUsers/ManageUsers'
import AddUser from './pages/ManageUsers/AddUser/AddUser'
import EditUser from './pages/ManageUsers/EditUser/EditUser'

import ManageItems from './pages/ManageStorage/ManageStorage'
import AddItem from './pages/ManageStorage/Items/AddItem/AddItem'
import EditItem from './pages/ManageStorage/Items/EditItem/EditItem'

import ManageRacks from './pages/ManageStorage/Racks/ManageRacks'
import AddRacks from './pages/ManageStorage/Racks/AddRack/AddItem'
import EditRacks from './pages/ManageStorage/Racks/EditRack/EditItem'

export default function App(){

	useEffect(()=>{
		if(sessionStorage.getItem("token") == "" && window.location.pathname != '/Login'){
			window.location.href = `${window.location.origin}/Login`;
		}
	}, []);

	return (
		<BrowserRouter>
		<Routes>
			<Route path='/Login' element={<Login/>}/>
			<Route path='/Dashboard' element={<Dashboard/>}/>
			<Route path='/Signup' element={<Signup/>}/>
			<Route path='/ChangeUserDataPassword' element={<ChangeUserDataPassword/>}/>
			<Route path='/ChangeUserDataMail' element={<ChangeUserDataMail/>}/>
			<Route path='/ChangeUserDataName' element={<ChangeUserDataName/>}/>
			<Route path='/ChangeUserDataSurname' element={<ChangeUserDataSurname/>}/>
			<Route path='/ManageUsers' element={<ManageUsers/>}/>
			<Route path='/AddUser' element={<AddUser/>}/>
			<Route path='/EditUser' element={<EditUser/>}/>	

			<Route path='/ManageItems' element={<ManageItems/>}/>
			<Route path='/AddItem' element={<AddItem/>}/>
			<Route path='/EditItem' element={<EditItem/>}/>

			<Route path='/ManageRacks' element={<ManageRacks/>}/>
			<Route path='/AddRack' element={<AddRacks/>}/>
			<Route path='/EditRacks' element={<EditRacks/>}/>
			
		</Routes>
		</BrowserRouter>
	)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
