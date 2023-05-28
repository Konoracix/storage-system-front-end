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

const [rackData, setRackData] = useState([]);

// const [mail, setMail] = useState('');
// const [name, setName] = useState('');
// const [surname, setSurname] = useState('');
// const [permissions, setPermissions] = useState('');

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
			const itemData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/items/getOneItem/${name}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			const racksData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/racks/getRacksBySearchNoPagi/${userData.data.organization_id}/${undefined}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			setRackData(racksData.data)
			const rackData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/racks/getRack/${itemData.data.rack_id}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			// setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
			setFormData({
				item_id: itemData.data.id,
				rack_id: itemData.data.rack_id,
				rack_name: rackData.data.name,
				name: itemData.data.name,
				shelve: itemData.data.shelve_number,
				place: itemData.data.place_number,
				description: itemData.data.description
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
			const rackData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/racks/getRacksBySearch/${organization.id}/${formData.rack_name}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			const editedUser = await axios({
				method: 'put',
				url: `http://localhost:5050/api/items/editItem/${formData.item_id}`, 
				headers: {'authorization': `bearer ${token}`}, 
				data: {
					name: formData.name,
					shelve_number: formData.shelve,
					place_number: formData.shelve,
					description: formData.description,
					rack_id: rackData.data.data[0].id
				}
		  })
			sessionStorage.setItem("eventMessage", 'editedItem');
			navigate('/ManageItems');	
		})()
	}
	
	function navigateToManageUsers(){
		navigate('/ManageItems')
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
		<h1>Edit item in {organization.organization_name}</h1>
		<div id='container'>
			<div id='loginSectionAddUser'>
				<form>
					<br />
					
					<label>Name</label>
					<br />
					<input type="text" onChange={handleChange} value={formData.name} name="name" id="id_password_2"/>
					<br />
					<br />
 					<label>Shelve number</label>
					<br />
					<input type="text" onChange={handleChange} value={formData.shelve} name="shelve" id="id_password_2"/>
					<br />
					<br />
 					<label>Place number</label>
					<br />
					<input type="text" onChange={handleChange} name="place" value={formData.place} id="id_password_2"/>
					<br />
					<br />
					<label>Description</label>
					<br />
					<input type="text" onChange={handleChange} name="description" value={formData.description} id="id_password_2"/>
					<br />
					<br />
					<label>Rack</label>
					<br />
					<br />
					<select name="rack_name"  id="select" onChange={handleChange}>
					{rackData.map((option) => {
						if(option.id == formData.rack_id){
							// setFormData((prev) => ({
							// 	...prev,
							// 	rack_name: option.name
							// }))
							return <option key={option.id} selected>
								{option.name}
							</option>
						}	else {
							return <option key={option.id} >
							{option.name}
							</option>
						}
							// return <option key={option.id} >
							// 	{option.name}
							// </option>
					})}
			</select>			
					{/* <input defaultChecked={formData.usersPermissions} type="checkbox" id='permissionCheckBox' onChange={handleChange} name='usersPermissions'/>&nbsp;&nbsp;<label id='textForCheckBox'>Users Permissions</label> 
					<input defaultChecked={formData.racksPermissions} type="checkbox" id='permissionCheckBox' onChange={handleChange} name='racksPermissions'/>&nbsp;&nbsp;<label id='textForCheckBox'>Racks Permissions</label> 
					<input defaultChecked={formData.itemsPermissions} type="checkbox" id='permissionCheckBox' onChange={handleChange} name='itemsPermissions'/>&nbsp;&nbsp;<label id='textForCheckBox'>Items Permissions</label>  */}
					<br />					
					<br />					
					<button id="AddUserButton" onClick={addUser}>Edit Item</button>
				</form>
				<button id='logoutButton' onClick={navigateToManageUsers}>Manage Items</button>
				{
						loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
					}
			</div>
		</div>
	</div>
  );
}

export default ChangeUserData;
