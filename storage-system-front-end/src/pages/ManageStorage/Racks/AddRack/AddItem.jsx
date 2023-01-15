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

const [formData, setFormData] = useState({name: '', shelves: '', places: ''});

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
		if(formData.name !== '' && formData.shelves !== '' && formData.places !== ''){
			(async ()=>{
				const token = sessionStorage.getItem("token").split(' ')[1];
				const addedUser = await axios({
					method: 'post',
					url: `http://localhost:5050/api/racks/addRack`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
							organization_id: organization.id,
							name: formData.name,
							shelves: parseInt(formData.shelves),
							places: parseInt(formData.places),
					}
				})
				// const addedPermission = await axios({
				// 	method: 'post',
				// 	url: `http://localhost:5050/api/auth/addPermission`, 
				// 	headers: {'authorization': `bearer ${token}`}, 
				// 	data: {
				// 		user_id: addedUser.data.id,
				// 		users_permissions: formData.usersPermissions,
				// 		racks_permissions: formData.racksPermissions,
				// 		items_premissions: formData.itemsPermissions
				// 	}
				// })
				sessionStorage.setItem("eventMessage", 'addedRack');
				navigate('/ManageRacks');	
			})()
		}
		else if(formData.name === ''){
			setLoginMessage('Missing name')
		}else if(formData.shelves === ''){
			setLoginMessage('Missing number of shelves')
		}else if(formData.places === ''){
			setLoginMessage('Missing number of places')
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
			<div id='loginSectionAddUser2'>
				<form>
					<br />
					
					<label>Name</label>
					<br />
					<input type="text" onChange={handleChange} name="name" id="id_password_2"/>
					<br />
					<br />
 					<label>Number of shelves</label>
					<br />
					<input type="text" onChange={handleChange} name="shelves" id="id_password_2"/>
					<br />
					<br />
 					<label>Number of places</label>
					<br />
					<input type="text" onChange={handleChange} name="places" id="id_password_2"/>
					<br />
					<br />
					<br />
 					{/* <label>Password</label>
					<br />
					<input type="password" onChange={handleChange} name="password" id="passwordInput"/>
 					<i className="far fa-eye" onClick={changePasswordVisibility} id="togglePassword"></i>
					<br />
					<br />
					<input type="checkbox" id='permissionCheckBox' onChange={handleCheck} name='usersPermissions'/><label id='textForCheckBox'>Users Permissions</label> 
					<input type="checkbox" id='permissionCheckBox' onChange={handleCheck} name='racksPermissions'/><label id='textForCheckBox'>Racks Permissions</label> 
					<input type="checkbox" id='permissionCheckBox' onChange={handleCheck} name='itemsPermissions'/><label id='textForCheckBox'>Items Permissions</label> 
					<br />					
					<br />					 */}
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
