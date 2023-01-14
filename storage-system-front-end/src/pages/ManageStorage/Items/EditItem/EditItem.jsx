import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom";
import './EditItem.css';
import axios from 'axios';

function ChangeUserData() {

const navigate = useNavigate();

const [organization, setOrganization] = useState('');
const [user_id, setUser_id] = useState('');
const [loginMessage, setLoginMessage] = useState('');
const [formData, setFormData] = useState({password: '', mail: ''});

const [mail, setMail] = useState('');
const [name, setName] = useState('');
const [surname, setSurname] = useState('');
const [permissions, setPermissions] = useState('');

function handleChange(e) {
	setFormData((prev) => ({...prev, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked: e.target.value}));
}

useEffect((()=>{fetchData()}), [])
useEffect((()=>{console.log(formData)}), [formData])

	function fetchData(){
	
		const tokenData = (async()=>{
			const token = sessionStorage.getItem("token").split(' ')[1];
			const name = new URLSearchParams(document.location.search).get('id')
			setUser_id(name)
			// const tokenData = await axios({
			// 	method: 'get',
			// 	url: `http://localhost:5050/api/auth/tokenData/${token}`, 
			// 	headers: {'authorization': `bearer ${token}`}, 
			// })
			const userData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getUserById/${name}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			const organizationData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getOrganizationById/${userData.data.organization_id}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			const userPermissions = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getPermissionById/${name}`, 
				headers: {'authorization': `bearer ${token}`}
			})
			// setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
			setFormData({
				mail: userData.data.mail,
				name: userData.data.name,
				surname: userData.data.surname,
				usersPermissions: userPermissions.data.users_permissions,
				racksPermissions: userPermissions.data.racks_permissions,
				itemsPermissions: userPermissions.data.items_premissions
			});
			// setMail(userData.data.mail)
			// setName(userData.data.name)
			// setSurname(userData.data.surname)
			// setPermissions(userPermissions.data)
			setOrganization(organizationData.data);
	})()
}

	function addUser(e){
		e.preventDefault();
		if(formData.mail !== '' && formData.password !== ''){
			(async ()=>{
				const token = sessionStorage.getItem("token").split(' ')[1];
				const editedUser = await axios({
					method: 'put',
					url: `http://localhost:5050/api/auth/editUser/${user_id}`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
							name: formData.name,
							surname: formData.surname,
							mail: formData.mail,
					}
				})
				const editPermissions = await axios({
					method: 'put',
					url: `http://localhost:5050/api/auth/editPermission/${user_id}`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
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
		navigate('/ManageUsers')
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
		<h1>Edit user in {organization.organization_name}</h1>
		<div id='container'>
			<div id='loginSectionAddUser'>
				<form>
					<br />
					
					<label>Name</label>
					<br />
					<input type="text" onChange={handleChange} value={formData.name} name="name" id="id_password_2"/>
					<br />
					<br />
 					<label>Surname</label>
					<br />
					<input type="text" onChange={handleChange} value={formData.surname} name="surname" id="id_password_2"/>
					<br />
					<br />
 					<label>Mail</label>
					<br />
					<input type="text" onChange={handleChange} name="mail" value={formData.mail} id="id_password_2"/>
					<br />
					<br />
					<input defaultChecked={formData.usersPermissions} type="checkbox" id='permissionCheckBox' onChange={handleChange} name='usersPermissions'/>&nbsp;&nbsp;<label id='textForCheckBox'>Users Permissions</label> 
					<input defaultChecked={formData.racksPermissions} type="checkbox" id='permissionCheckBox' onChange={handleChange} name='racksPermissions'/>&nbsp;&nbsp;<label id='textForCheckBox'>Racks Permissions</label> 
					<input defaultChecked={formData.itemsPermissions} type="checkbox" id='permissionCheckBox' onChange={handleChange} name='itemsPermissions'/>&nbsp;&nbsp;<label id='textForCheckBox'>Items Permissions</label> 
					<br />					
					<br />					
					<button id="AddUserButton" onClick={addUser}>Edit User</button>
				</form>
				<button id='logoutButton' onClick={navigateToManageUsers}>Manage Users</button>
				{
						loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
					}
			</div>
		</div>
	</div>
  );
}

export default ChangeUserData;
