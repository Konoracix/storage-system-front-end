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
// useEffect((()=>{console.log(formData)}), [formData])

	function fetchData(){
	
		const tokenData = (async()=>{
			const token = sessionStorage.getItem("token").split(' ')[1];
			const name = new URLSearchParams(document.location.search).get('id')
			setUser_id(name)	
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
			const rackData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/racks/getRack/${name}`, 
				headers: {'authorization': `bearer ${token}`},
			})

			// setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
			setFormData({
				name: rackData.data.name,
				shelves: rackData.data.shelves,
				places: rackData.data.places,
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
			(async ()=>{
				const token = sessionStorage.getItem("token").split(' ')[1];
				const editedUser = await axios({
					method: 'put',
					url: `http://localhost:5050/api/racks/editRack/${user_id}`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
							name: formData.name,
							shelves: formData.shelves,
							places: formData.places,
					}
				})
				sessionStorage.setItem("eventMessage", 'editedRack');
				navigate('/ManageRacks');	
			})()
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
		<h1>Edit rack in {organization.organization_name}</h1>
		<div id='container'>
			<div id='loginSectionAddUser'>
				<form>
					<br />
					
					<label>Name</label>
					<br />
					<input type="text" onChange={handleChange} value={formData.name} name="name" id="id_password_2"/>
					<br />
					<br />
 					<label>Number of shelves</label>
					<br />
					<input type="text" onChange={handleChange} value={formData.shelves} name="shelves" id="id_password_2"/>
					<br />
					<br />
 					<label>Number of places</label>
					<br />
					<input type="text" onChange={handleChange} name="places" value={formData.places} id="id_password_2"/>
					<br />
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
