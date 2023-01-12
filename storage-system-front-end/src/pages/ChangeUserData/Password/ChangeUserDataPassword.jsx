import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ChangeUserDataPassword.css';
import axios from 'axios';

function ChangeUserData() {

useEffect(()=>{
	if(sessionStorage.getItem("eventMessage") === 'logout'){
		setLoginMessage('Successfully logged out')
		sessionStorage.setItem("eventMessage", '')
	}
}, [])



	const navigate = useNavigate();

	const [fetchedData, setFetchedData] = useState({});

	const [loginMessage, setLoginMessage] = useState('');

	const [formData, setFormData] = useState({password1: '', password2: ''});

	function handleChange(e) {
		setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
	}

	function changePassword(e){
		e.preventDefault();
		if(formData.password1 !== '' && formData.password2 !== ''){
			(async ()=>{
				
				const token = sessionStorage.getItem("token").split(' ')[1];
				const tokenData = await axios({
					method: 'get',
					url: `http://localhost:5050/api/auth/tokenData/${token}`, 
					headers: {'authorization': `bearer ${token}`}, 
				})
				const checkPassword = await axios({
					method: 'get',
					url: `http://localhost:5050/api/auth/checkPassword/${tokenData.data.user_id}/${formData.password1}`, 
					headers: {'authorization': `bearer ${token}`},
					data: {
						id: tokenData.data.user_id,
						password: formData.password1
					}
				})
				if(checkPassword.data.message === 'true'){
					const changePassword = await axios({
						method: 'put',
						url: `http://localhost:5050/api/auth/editUser/${tokenData.data.user_id}`, 
						headers: {'authorization': `bearer ${token}`},
						data: {
							password: formData.password2
						}
					})
					sessionStorage.setItem("eventMessage", 'changedPassword');
					sessionStorage.setItem("token", "")
					navigate('/Login');
				}else{
					setLoginMessage("Invalid data")
				}
				
				// setFetchedData(checkPassword.data);
				
				
			})()
		}
		else if(formData.password1 === ''){
			setLoginMessage('Missing old password')
		}
		else if(formData.password2 === ''){
			setLoginMessage('Missing new password')
		}
	}

	function changePasswordVisibility_1(){
		if(document.getElementById('id_password_1').type === 'password'){
			document.getElementById('id_password_1').type = 'text'
			return;
		}
		document.getElementById('id_password_1').type = 'password';
	}
	function changePasswordVisibility_2(){
		if(document.getElementById('id_password_2').type === 'password'){
			document.getElementById('id_password_2').type = 'text'
			return;
		}
		document.getElementById('id_password_2').type = 'password';
	}

	function firwardToMakingAccount(){
		navigate('/Signup')
	}
	
	function goBackToDashboard(){
		navigate('/Dashboard')
	}

  return (
	<div>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"></link>
		{/* <img id="logo" alt='' src={require("../../logo.png")}/> */}
		<h1>Change password in your account</h1>
		<div id='container'>
			<div id='loginSectionChange'>
				<form>
					<br />
					<label>Current password</label>
					<br />
					<input onChange={handleChange} name="password1" type="password" autoComplete="current-password" id="id_password_1"  />
					<i className="far fa-eye" onClick={changePasswordVisibility_1} id="togglePassword"></i>
					<br />
					<br />
					<label>New password</label>
					<br />
					<input type="password" onChange={handleChange} name="password2" autoComplete="current-password" id="id_password_2"/>
 					<i className="far fa-eye" onClick={changePasswordVisibility_2} id="togglePassword"></i>
					<br />
					<br />
					<br />
					
					<button id="signUpButton" onClick={changePassword}>Change password</button>

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
