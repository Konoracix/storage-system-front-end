import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import './Signup.css';
import axios from 'axios';

function Signup() {

useEffect(()=>{
	if(sessionStorage.getItem("eventMessage") === 'logout'){
		setLoginMessage('Successfully logged out')
		sessionStorage.setItem("eventMessage", '')
	}
}, [])



	const navigate = useNavigate();

	const [fetchedData, setFetchedData] = useState({});

	const [loginMessage, setLoginMessage] = useState('');

	const [formData, setFormData] = useState({email: '', password: '', organization: ''});

	function handleChange(e) {
		setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
	}

	function signUp(e){
		e.preventDefault();
		if(formData.email !== '' && formData.password !== '' && formData.organization !== ''){
			(async ()=>{
				const organization = await axios({
					method: 'post',
					url: `http://localhost:5050/api/auth/addOrganization`, 
					withCredentials: false,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json',
					},
					data: {
						organization_name: formData.organization
					},
				});
				if(typeof(organization.data.message) == typeof('')){
					setLoginMessage("Invalid data")
				}
				else{
					setFetchedData(organization.data);
				}

				const user = await axios({
					method: 'post',
					url: `http://localhost:5050/api/auth/addUser`, 
					withCredentials: false,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json',
					},
					data: {
						mail: formData.email,
						password: formData.password,
						organization_id: organization.data.id
					},
				});

				const data = await axios({
					method: 'post',
					url: `http://localhost:5050/api/auth/login`, 
					withCredentials: false,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json',
					},
					data: {
						mail: user.data.mail,
						password: formData.password	
					},
				});
				sessionStorage.setItem("token", "bearer " + data.data.token)
				navigate('/Dashboard');	
			})()
		}
		else if(formData.organization === ''){
			setLoginMessage('Missing organization name')
		}
		else if(formData.email === ''){
			setLoginMessage('Missing email')
		}
		else if(formData.password === ''){
			setLoginMessage('Missing password')
		}
	}

	function changePasswordVisibility(){
		if(document.getElementById('id_password').type === 'password'){
			document.getElementById('id_password').type = 'text'
			return;
		}
		document.getElementById('id_password').type = 'password';
	}

	function forwardToLoggingIn(){
		navigate('/Login')
	}
	
  return (
	<div>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"></link>
		<img id="logo" alt='' src={require("../../logo.png")}/>
		<h1>Sign up to Storage System</h1>
		<div id='container'>
			<div id='loginSection'>
				<form>
					<br />
					<label>Organization name</label>
					<br />
					<input onChange={handleChange} name="organization" type="text"  />
					<br />
					<br />
					<label>Email address</label>
					<br />
					<input onChange={handleChange} name="email" type="text"  />
					<br />
					<br />
					<label>Password</label>
					<br />
					<input type="password" onChange={handleChange} name="password" autoComplete="current-password" id="id_password"/>
 					<i className='far fa-eye' onClick={changePasswordVisibility} id="togglePassword"></i>
					{/* <input onChange={handleChange} name='password' type="password"  /> */}
					<br />
					<br />
					<br />
					
					<button id="signUpButton" onClick={signUp}>Sign Up</button>
					<br />
					<br />
					<label id="loginMessage">{loginMessage}</label>
					<br />
					<label id='makeAccount' onClick={forwardToLoggingIn}>Sign in</label>
					<br />
				</form>
			</div>
		</div>
	</div>
  );
}

export default Signup;
