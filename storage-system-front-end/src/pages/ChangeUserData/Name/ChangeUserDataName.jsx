import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ChangeUserDataName.css';
import axios from 'axios';

function ChangeUserData() {

// useEffect(()=>{
// 	if(sessionStorage.getItem("eventMessage") === 'logout'){
// 		setLoginMessage('Successfully logged out')
// 		sessionStorage.setItem("eventMessage", '')
// 	}
// }, [])


const navigate = useNavigate();

// const [fetchedData, setFetchedData] = useState({});

const [name, setName] = useState('');
const [user_id, setUser_id] = useState('');

const [loginMessage, setLoginMessage] = useState('');

const [formData, setFormData] = useState({name: ''});

function handleChange(e) {
	setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
}

useEffect((()=>{fetchData()}), [])

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
			console.log(userData.data.id)
			setUser_id(userData.data.id)
			setName(userData.data.name)
	})()
}

	function changePassword(e){
		e.preventDefault();
		if(formData.name !== ''){
			(async ()=>{
				
				const token = sessionStorage.getItem("token").split(' ')[1];
				const editedUser = await axios({
					method: 'put',
					url: `http://localhost:5050/api/auth/editUser/${user_id}`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
						name: formData.name
					}
				})

				sessionStorage.setItem("eventMessage", 'changedName');
				navigate('/Dashboard');
				
				// setFetchedData(checkPassword.data);		
			})()
		}
		else if(formData.name === ''){
			setLoginMessage('Missing new name')
		}
	}

	function goBackToDashboard(){
		navigate('/Dashboard')
	}
	
  return (
	<div>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"></link>
		<h1>Change name in your account</h1>
		<div id='container'>
			<div id='loginSectionChange'>
				<form>
					<br />
					<label>Current name: {name}</label>
					<br />
					{/* <input onChange={handleChange} name="mail" type="text" id="id_password_1"  /> */}
					{/* <i className="far fa-eye" onClick={changePasswordVisibility_1} id="togglePassword"></i> */}
					<br />
					<br />
					<label>New name</label>
					<br />
					<input type="text" onChange={handleChange} name="name" id="id_password_2"/>
 					{/* <i className="far fa-eye" onClick={changePasswordVisibility_2} id="togglePassword"></i> */}
					<br />
					<br />
					<br />
					
					<button id="signUpButton" onClick={changePassword}>Change name</button>

				</form>
				<button id='logoutButton' onClick={goBackToDashboard}>Dashboard</button>
				{
						loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
					}
			</div>
		</div>
	</div>
  );
}

export default ChangeUserData;
