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

const [formData, setFormData] = useState({name: '', shelve: '', place: '', description: '', rack_name: 'Choose rack'});

const [selectList, setSelectList] = useState([]);

const [rackData, setRackData] = useState([]);

function handleChange(e) {
	setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
}

function handleCheck(e) {
	setFormData((prev) => ({...prev, [e.target.name]: e.target.checked}));
}

useEffect( (()=> (console.log(formData))), [formData])

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
			const racksData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/racks/getRacksBySearchNoPagi/${userData.data.organization_id}/${undefined}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			// console.log(racksData.data)
			setRackData(racksData.data)
	})()
}

	function addUser(e){
		e.preventDefault();
		if(formData.name !== '' && formData.shelve !== '' && formData.place !== '' && formData.rack_name !== 'Choose rack'){
			(async ()=>{
				const token = sessionStorage.getItem("token").split(' ')[1];

				const rackData = await axios({
					method: 'get',
					url: `http://localhost:5050/api/racks/getRacksBySearch/${organization.id}/${formData.rack_name}`, 
					headers: {'authorization': `bearer ${token}`},
				})
				const rackId = rackData.data.data[0].id
				console.log(formData.description)
				const addedItem = await axios({
					method: 'post',
					url: `http://localhost:5050/api/items/addItem`, 
					headers: {'authorization': `bearer ${token}`}, 
					data: {
							organization_id: organization.id,
							name: formData.name,
							description: formData.description,
							shelve_number: formData.shelve,
							place_number: formData.place,
							rack_id: rackId
					}
				})

				sessionStorage.setItem("eventMessage", 'addedItem');
				navigate('/ManageItems');	
			})()
		}
		else if(formData.name === ''){
			setLoginMessage('Missing name')
		}else if(formData.shelve === ''){
			setLoginMessage('Missing shelve number')
		}else if(formData.place === ''){
			setLoginMessage('Missing place number')
		}else if(formData.rack_name === 'Choose rack'){
			setLoginMessage('Missing rack')
		}
	}
	
	function navigateToManageUsers(){
		navigate('/ManageItems')
	}

	function onOptionChangeHandler(){

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
		<h1>Add new item to {organization.organization_name}</h1>
		<div id='container'>
			<div id='loginSectionAddUser'>
				<form>
					<br />
					
					<label>Name</label>
					<br />
					<input type="text" onChange={handleChange} name="name" id="id_password_2"/>
					<br />
					<br />
 					<label>Shelve number</label>
					<br />
					<input type="text" onChange={handleChange} name="shelve" id="id_password_2"/>
					<br />
					<br />
 					<label>Place number</label>
					<br />
					<input type="text" onChange={handleChange} name="place" id="id_password_2"/>
					<br />
					<br />
 					<label>Description</label>
					<br />
					<input type="text" onChange={handleChange} name="description" id="passwordInput"/>
					<br />
					<br />
 					<label>Rack</label>
					<br />
					<br />
					<select name="rack_name" id="select" onChange={handleChange}>
						<option>Choose rack</option>
					{rackData.map((option) => {
						return <option key={option.id} >
							{option.name}
						</option>
					})}
			</select>			
					<button id="AddItemButton" onClick={addUser}>Add Item</button>
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
