import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';

import Popup from '../../additionalComponents/popup';

function Login() {

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
	}
}, [])

	const navigate = useNavigate();

	const [fetchedData, setFetchedData] = useState({});

	const [loginMessage, setLoginMessage] = useState('');


	const [formData, setFormData] = useState({email: '', password: ''});

	function handleChange(e) {
		setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
	}

	function signUp(e){
		e.preventDefault();
		if(formData.email !== '' && formData.password !== ''){
			(async ()=>{
				const data = await axios({
					method: 'post',
					url: `http://localhost:5050/api/auth/login`, 
					withCredentials: false,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json',
					},
					data: {
						mail: formData.email,
						password: formData.password
					},
				});
				if(typeof(data.data.message) == typeof('')){
					setLoginMessage("Invalid data")
				}
				else{
					setFetchedData(data.data);
					sessionStorage.setItem("token", "bearer " + data.data.token)
					navigate('/Dashboard');
				}
			})()
		}
		else if(formData.email === ''){
			setLoginMessage('Missing email')
			// changePopupVisibility()
		}
		else if(formData.password === ''){
			setLoginMessage('Missing password')
			// changePopupVisibility()
		}
		// changePopupVisibility()
	}

	function changePasswordVisibility(){
		if(document.getElementById('id_password').type === 'password'){
			document.getElementById('id_password').type = 'text'
			return;
		}
		document.getElementById('id_password').type = 'password';
	}

	function firwardToMakingAccount(){
		navigate('/Signup')
	}

  return (
	<div>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"></link>
		<img id="logo" alt='' src={require("../../logo.png")}/>
		<h1>Sign in to Storage System</h1>
		<div id='container'>
			<div id='loginSection'>
				<form>
					<br />
					<label>Email address</label>
					<br />
					<input onChange={handleChange} name="email" type="text"  />
					<br />
					<br />
					<label>Password</label>
					<br />
					<input type="password" onChange={handleChange} name="password" autoComplete="current-password" id="id_password"/>
 					<i className="far fa-eye" onClick={changePasswordVisibility} id="togglePassword"></i>
					<br />
					<br />
					<br />
					
					<button id="signUpButton" onClick={signUp}>Sign in</button>

				</form>
				<label id='makeAccount' onClick={firwardToMakingAccount}>Signup</label>
					<br />
					<br />
					{
						loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
					}
			</div>
		</div>
	</div>
  );
}

export default Login;
