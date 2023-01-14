import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './AddItem.css';
import axios from 'axios';

function ChangeUserData() {

const navigate = useNavigate();

const [organization, setOrganization] = useState('');

const [mail, setMail] = useState('');
const [user_id, setUser_id] = useState('');

const [loginMessage, setLoginMessage] = useState('');

const [formData, setFormData] = useState({password: '', mail: ''});

function handleChange(e) {
	setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
}

function handleCheck(e) {
	setFormData((prev) => ({...prev, [e.target.name]: e.target.checked}));
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
			console.log(userData.data)
			const organizationData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getOrganizationById/${userData.data.organization_id}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			setOrganization(organizationData.data);
	})()
}

	function addUser(e){
		e.preventDefault();
		if(formData.mail !== '' && formData.password !== ''){
			(async ()=>{
				const token = sessionStorage.getItem("token").split(' ')[1];
				const addedUser = await axios({
					method: 'post',
					url: `http://localhost:5050/api/auth/addUser`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
							organization_id: organization.id,
							name: formData.name ? formData.name : '',
							surname: formData.surname ? formData.surname : '',
							mail: formData.mail,
							password: formData.password
					}
				})
				const addedPermission = await axios({
					method: 'post',
					url: `http://localhost:5050/api/auth/addPermission`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
						user_id: addedUser.data.id,
						users_permissions: formData.usersPermissions,
						racks_permissions: formData.racksPermissions,
						items_premissions: formData.itemsPermissions
					}
				})
				sessionStorage.setItem("eventMessage", 'addedUser');
				navigate('/ManageUsers');	
			})()
		}
		else if(formData.mail === ''){
			setLoginMessage('Missing mail')
		}else if(formData.password === ''){
			setLoginMessage('Missing password')
		}
	}
	
	function navigateToManageUsers(){
		navigate('/ManageRacks')
	}

	function changePasswordVisibility(){
    if(document.getElementById('passwordInput').type === 'password'){
        document.getElementById('passwordInput').type = 'text'
        return;
    }
    document.getElementById('passwordInput').type = 'password';
}

  return (
	<div>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"></link>
		<h1>Add new rack to {organization.organization_name}</h1>
		<div id='container'>
			<div id='loginSectionAddUser'>
				<form>
					<br />
					
					<label>Name</label>
					<br />
					<input type="text" onChange={handleChange} name="name" id="id_password_2"/>
					<br />
					<br />
 					<label>Surname</label>
					<br />
					<input type="text" onChange={handleChange} name="surname" id="id_password_2"/>
					<br />
					<br />
 					<label>Mail</label>
					<br />
					<input type="text" onChange={handleChange} name="mail" id="id_password_2"/>
					<br />
					<br />
 					<label>Password</label>
					<br />
					<input type="password" onChange={handleChange} name="password" id="passwordInput"/>
 					<i className="far fa-eye" onClick={changePasswordVisibility} id="togglePassword"></i>
					<br />
					<br />
					<input type="checkbox" id='permissionCheckBox' onChange={handleCheck} name='usersPermissions'/><label id='textForCheckBox'>Users Permissions</label> 
					<input type="checkbox" id='permissionCheckBox' onChange={handleCheck} name='racksPermissions'/><label id='textForCheckBox'>Racks Permissions</label> 
					<input type="checkbox" id='permissionCheckBox' onChange={handleCheck} name='itemsPermissions'/><label id='textForCheckBox'>Items Permissions</label> 
					<br />					
					<br />					
					<button id="AddUserButton" onClick={addUser}>Add Rack</button>
				</form>
				<button id='logoutButton' onClick={navigateToManageUsers}>Manage Racks</button>
				{
						loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
					}
			</div>
		</div>
	</div>
  );
}

export default ChangeUserData;
