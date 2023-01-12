import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ChangeUserDataMail.css';
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

const [mail, setMail] = useState('');
const [user_id, setUser_id] = useState('');

const [loginMessage, setLoginMessage] = useState('');

const [formData, setFormData] = useState({mail: ''});

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
			setUser_id(userData.data.id)
			setMail(userData.data.mail)
	})()
}

	function changePassword(e){
		e.preventDefault();
		if(formData.mail !== ''){
			(async ()=>{
				
				const token = sessionStorage.getItem("token").split(' ')[1];
				const editedUser = await axios({
					method: 'put',
					url: `http://localhost:5050/api/auth/editUser/${user_id}`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
						mail: formData.mail
					}
				})
				console.log()

				sessionStorage.setItem("eventMessage", 'changedMail');
				sessionStorage.setItem("token", "")
				navigate('/Login');
				
				// setFetchedData(checkPassword.data);		
			})()
		}
		else if(formData.mail === ''){
			setLoginMessage('Missing new mail')
		}
	}
	
	function goBackToDashboard(){
		navigate('/Dashboard')
	}

  return (
	<div>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"></link>
		<h1>Change mail in your account</h1>
		<div id='container'>
			<div id='loginSectionChange'>
				<form>
					<br />
					<label>Current mail: {mail}</label>
					<br />
					{/* <input onChange={handleChange} name="mail" type="text" id="id_password_1"  /> */}
					{/* <i className="far fa-eye" onClick={changePasswordVisibility_1} id="togglePassword"></i> */}
					<br />
					<br />
					<label>New mail</label>
					<br />
					<input type="text" onChange={handleChange} name="mail" id="id_password_2"/>
 					{/* <i className="far fa-eye" onClick={changePasswordVisibility_2} id="togglePassword"></i> */}
					<br />
					<br />
					<br />
					
					<button id="signUpButton" onClick={changePassword}>Change mail</button>

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
