import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageRacks.css';

function Dashboard() {
	
	useEffect(()=>{
		if(sessionStorage.getItem("eventMessage") === 'addedUser'){
			setLoginMessage('Successfully added new user')
			sessionStorage.setItem("eventMessage", '')
		}
	}, [])

	const navigate = useNavigate();

	const [organization, setOrganization] = useState('');

	const [organizationName, setOrganizationName] = useState('');

	const [allUsers, setAllUsers] = useState([]);
	
	const [fetchedData, setFetchedData] = useState({});
	const [selectList, setSelectList] = useState([]);
	const [selectedListOption, setSelectedListOption] = useState(1);
	const [formData, setFormData] = useState('');

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
			const organizationData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/auth/getOrganizationById/${userData.data.organization_id}`, 
				headers: {'authorization': `bearer ${token}`},
			})

			setOrganizationName(organizationData.data.organization_name)

			const allUsersData = await axios({
				method: 'get',
				url: `http://localhost:5050/api/racks/getRacksBySearch/${userData.data.organization_id}/${formData.searchData != ''? formData.searchData : 'null'}?current_page=${selectedListOption}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			let pomList = [];
			for(let i = 0; i<allUsersData.data.total_pages; i++){
				pomList.push(i+1)
			}
			setSelectList(pomList);
			setFetchedData(allUsersData.data);
			setOrganization(organizationData.data.organization_name)
			setAllUsers(allUsersData.data.data)
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
		navigate('/AddRack')
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
				url: `http://localhost:5050/api/racks/deleteRack/${e.target.getAttribute("name")}`, 
				headers: {'authorization': `bearer ${token}`},
			})
		})()
		setLoginMessage('Succesfully deleted rack')
		fetchData()
	}

	function handleEdit(e){
		navigate(`/EditItem?id=${e.target.getAttribute("name")}`)
	}

  return (
	<div>
		{/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /> */}
		{/* <p id='userData'>Organization:&nbsp; {organization}</p>
		<p id='userData' onClick={navigateToChangeName}>Name:&nbsp; {name}</p>
		<p id='userData' onClick={navigateToChangeSurname}>Surname:&nbsp; {surname}</p>
		<p id='userData' onClick={navigateToChangeMail}>Mail:&nbsp; {mail}</p>
		<p id='userData' onClick={navigateToChangePassword}>Password:&nbsp; {password}</p>
		<button id='logoutButton' onClick={logout}>Logout</button> */}
		<h1>Racks in {organizationName}</h1>
		<div className='searchInpit'>
			<input type="text" onChange={handleChange} name='searchData' id='id_password_2'/>&nbsp;&nbsp;
			<button id='searchButton' onClick={fetchData}>Search</button>
		</div>
		<div id="usersTable">
			<table style={tableStyle}>
      	<tbody>
        	<tr>
          	{/* <th style={tdStyle}>Id</th> */}
          	<th style={tdStyle}>Name</th>
          	<th style={tdStyle}>Shelves</th>
          	<th style={tdStyle}>Places</th>
        	</tr>
          	{allUsers.map(({ id, name, shelves, places }) => (
            	<tr key={id}>
            	  {/* <td style={tdStyle} id="tableText">{id}</td> */}
            	  <td style={tdStyle} id="tableText">{name}</td>
            	  <td style={tdStyle} id="tableText">{shelves}</td>
            	  <td style={tdStyle} id="tableText">{places}</td>
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
		<button id='addUserButton' onClick={goToAddUser}>Add rack</button>
		{
			loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
		}
	</div>
  );
}

export default Dashboard;
