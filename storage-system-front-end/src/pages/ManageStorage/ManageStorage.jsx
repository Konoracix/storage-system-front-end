import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageStorage.css';

function Dashboard() {
	
	useEffect(()=>{
		if(sessionStorage.getItem("eventMessage") === 'addedUser'){
			setLoginMessage('Successfully added new user')
			sessionStorage.setItem("eventMessage", '')
		}else if(sessionStorage.getItem("eventMessage") === 'addedItem'){
			setLoginMessage('Successfully added new item')
			sessionStorage.setItem("eventMessage", '')
		}
	}, [])

	const navigate = useNavigate();

	const [organization, setOrganization] = useState('');

	const [organizationName, setOrganizationName] = useState('');

	const [allUsers, setAllUsers] = useState([]);
	
	const [racksData, setRacksData] = useState([]);

	const [fetchedData, setFetchedData] = useState({});
	const [selectList, setSelectList] = useState([]);
	const [selectedListOption, setSelectedListOption] = useState(1);
	const [formData, setFormData] = useState({searchData: ''});

	function handleChange(e) {
		setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
	}

	useEffect(fetchData, [])
	useEffect(fetchData, [selectedListOption])

	const [loginMessage, setLoginMessage] = useState('');

	const onOptionChangeHandler = (event) => {
		setSelectedListOption(event.target.value)
	}

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

			const racks = await axios({
				method: 'get',
				url: `http://localhost:5050/api/racks/getRacks/${userData.data.organization_id}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			setRacksData(racks.data)
			const organizationData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getOrganizationById/${userData.data.organization_id}`, 
				headers: {'authorization': `bearer ${token}`},
			})

			setOrganizationName(organizationData.data.organization_name)

			const allItemsData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/items/getAllItemsBySearch/${parseInt(userData.data.organization_id)}/${formData.searchData != ''? formData.searchData : 'null'}?current_page=${selectedListOption}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			// const allItemsData =""
			let pomList = [];
			for(let i = 0; i<allItemsData.data.total_pages; i++){
				pomList.push(i+1)
			}
			setSelectList(pomList);
			setFetchedData(allItemsData.data);
			setOrganization(organizationData.data.organization_name)
			setAllUsers(allItemsData.data.data)
	})()
	}

	const tableStyle = {
    border: '1px solid white',
    borderCollapse: 'collapse'
	}

	const tdStyle = {
  	border: '1px solid white',
	};
	
	function goBackToDashboard(){
		navigate('/Dashboard')
	}
	
	function goToAddUser(){
		navigate('/AddItem')
	}
	function goToManageRacks(){
		navigate('/ManageRacks')
	}
	
	function search(){
		(async () => {
			
		})()
	}

	function handleDelete(e){
		(async () => {
			const token = sessionStorage.getItem("token").split(' ')[1];
			const userData = await axios({
				method: 'delete',
				url: `http://localhost:5050/api/items/deleteItem/${e.target.getAttribute("name")}`, 
				headers: {'authorization': `bearer ${token}`},
			})
		})()
		setLoginMessage('Succesfully deleted user')
		fetchData()
	}

	function getRackFromId(id){
		for(let i = 0; i<racksData.length; i++){
			if(racksData[i].id == id){
				return racksData[i].name
			}
		}
	}

	function handleEdit(e){
		navigate(`/EditItem?id=${e.target.getAttribute("name")}`)
	}

  return (
	<div>
		<h1>Items in {organizationName}</h1>
		<div className='searchInpit'>
			<input type="text" onChange={handleChange} name='searchData' id='id_password_2'/>&nbsp;&nbsp;
			<button id='searchButton' onClick={fetchData}>Search</button>
		</div>
		<div id="usersTable">
			<table style={tableStyle}>
      	<tbody>
        	<tr>
          	<th style={tdStyle}>Id</th>
          	<th style={tdStyle}>Name</th>
          	<th style={tdStyle}>Rack</th>
          	<th style={tdStyle}>Shelve number</th>
          	<th style={tdStyle}>Place number</th>
          	<th style={tdStyle}>Description</th>
        	</tr>
          	{allUsers.map(({ id, rack_id ,name, shelve_number, place_number, description}) => (
            	<tr key={id}>
            	  <td style={tdStyle} id="tableText">{id}</td>
            	  <td style={tdStyle} id="tableText">{name}</td>
            	  <td style={tdStyle} id="tableText">{getRackFromId(rack_id)}</td>
            	  <td style={tdStyle} id="tableText">{shelve_number}</td>
            	  <td style={tdStyle} id="tableText">{place_number}</td>
            	  <td style={tdStyle} id="tableText">{description}</td>
            	  <td style={tdStyle} id="tableText" onClick={handleEdit} name={id}>edit</td>
            	  <td style={tdStyle} id="tableText" onClick={handleDelete} name={id}>delete</td>
          	  </tr>
        	  ))}
      	</tbody>
    	</table>
		</div>
		<select id='paginatios' onChange={onOptionChangeHandler}>
					{selectList.map((option, index) => {
						return <option key={index} >
							{option}
						</option>
					})}
			</select>
		
		<button id='logoutButton' onClick={goBackToDashboard}>Dashboard</button>
		<button id='addUserButton' onClick={goToAddUser}>Add item</button>
		<button id='manageRacksButton' onClick={goToManageRacks}>Manage racks</button>
		{
			loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
		}
	</div>
  );
}

export default Dashboard;
