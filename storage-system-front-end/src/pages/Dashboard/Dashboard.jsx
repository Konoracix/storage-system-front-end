import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
	
	const navigate = useNavigate();

	// const [decodedToken, setDecodedToken] = useState('');
	// const [formData, setFormData] = useState({email: '', password: ''});
	const [organization, setOrganization] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [mail, setMail] = useState('');
	const [password, setPassword] = useState('');
	// function handleChange(e) {
	// 	setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
	// }

	useEffect(()=>{
		if(sessionStorage.getItem("eventMessage") === 'logout'){
			setLoginMessage('Successfully logged out')
			sessionStorage.setItem("eventMessage", '')
		}if(sessionStorage.getItem("eventMessage") === 'changedPassword'){
			setLoginMessage('Successfully changed password')
			sessionStorage.setItem("eventMessage", '')
		}if(sessionStorage.getItem("eventMessage") === 'changedMail'){
			setLoginMessage('Successfully changed mail')
			sessionStorage.setItem("eventMessage", '')
		}if(sessionStorage.getItem("eventMessage") === 'changedName'){
			setLoginMessage('Successfully changed name')
			sessionStorage.setItem("eventMessage", '')
		}if(sessionStorage.getItem("eventMessage") === 'changedSurname'){
			setLoginMessage('Successfully changed surname')
			sessionStorage.setItem("eventMessage", '')
		}if(sessionStorage.getItem("eventMessage") === 'addedUser'){
			setLoginMessage('Successfully added new user')
			sessionStorage.setItem("eventMessage", '')
		}
	}, [])

	useEffect(fetchData, [])

	const [fetchedData, setFetchedData] = useState({});
	const [loginMessage, setLoginMessage] = useState('');
	const [permissions, setPermissions] = useState('');

	function fetchData(){
		
		const tokenData = (async()=>{
			const token = sessionStorage.getItem("token").split(' ')[1];
			const tokenData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/tokenData/${token}`, 
				headers: {'authorization': `bearer ${token}`}, 
			})
			const userData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getUserById/${tokenData.data.user_id}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			const userPermissions = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getPermissionById/${userData.data.id}`, 
				headers: {'authorization': `bearer ${token}`}
			})
			setPermissions(userPermissions.data)
			const organizationData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getOrganizationById/${userData.data.organization_id}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			
			setOrganization(organizationData.data.organization_name)
			setName(userData.data.name)
			setSurname(userData.data.surname)
			setMail(userData.data.mail)
			setPassword('*****')
	})()
}

	function logout(){
		(async() => {
			await axios({
				method: 'put',
				url: `http://localhost:5050/api/auth/logout`, 
				headers: {'authorization': `${sessionStorage.getItem("token")}`},
			})
		})()
		sessionStorage.setItem("token", "")
		sessionStorage.setItem("eventMessage", 'logout');
		navigate('/Login');
	}
	
	function navigateToChangeName(){
		navigate('/ChangeUserDataName')
	}
	function navigateToChangeSurname(){
		navigate('/ChangeUserDataSurname')
	}
	function navigateToChangeMail(){
		navigate('/ChangeUserDataMail');
	}
	function navigateToChangePassword(){
		navigate('/ChangeUserDataPassword');
	}
	function navigateToManageUsers(){
		navigate('/ManageUsers')
	}
	function navigateToMagageItems(){
		navigate('/ManageItems')
	}


  return (
	<div>
		
		<p id='userData'>Organization:&nbsp; {organization}</p>
		<p id='userData' onClick={navigateToChangeName}>Name:&nbsp; {name}</p>
		<p id='userData' onClick={navigateToChangeSurname}>Surname:&nbsp; {surname}</p>
		<p id='userData' onClick={navigateToChangeMail}>Mail:&nbsp; {mail}</p>
		<p id='userData' onClick={navigateToChangePassword}>Password:&nbsp; {password}</p>
		<button id='logoutButton' onClick={logout}>Logout</button>
		{
			permissions.users_permissions ? <button id='goToManageUsers' onClick={navigateToManageUsers}>Manage Users</button> : ''
		}
		{
			permissions.items_premissions ? <button id='goToManageItems' onClick={navigateToMagageItems}>Manage Items</button> : ''
		}
		{
			loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
		}
	</div>
  );
}

export default Dashboard;
