import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUsers.css';

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
	// function handleChange(e) {
	// 	setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
	// }

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
				url: `http://localhost:5050/api/auth/getAllUsersById/${userData.data.organization_id}/${organizationData.data.id}?current_page=${selectedListOption}`, 
				headers: {'authorization': `bearer ${token}`},
			})
			let pomList = [];
			for(let i = 0; i<allUsersData.data.total_pages; i++){
				pomList.push(i+1)
			}
			console.log(pomList)
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
	// function logout(){
	// 	(async() => {
	// 		await axios({
	// 			method: 'put',
	// 			url: `http://localhost:5050/api/auth/logout`, 
	// 			headers: {'authorization': `${sessionStorage.getItem("token")}`},
	// 		})
	// 	})()
	// 	sessionStorage.setItem("token", "")
	// 	sessionStorage.setItem("eventMessage", 'logout');
	// 	navigate('/Login');
	// }
	
	function goBackToDashboard(){
		navigate('/Dashboard')
	}
	
	function goToAddUser(){
		navigate('/AddUser')
	}

  return (
	<div>
		
		{/* <p id='userData'>Organization:&nbsp; {organization}</p>
		<p id='userData' onClick={navigateToChangeName}>Name:&nbsp; {name}</p>
		<p id='userData' onClick={navigateToChangeSurname}>Surname:&nbsp; {surname}</p>
		<p id='userData' onClick={navigateToChangeMail}>Mail:&nbsp; {mail}</p>
		<p id='userData' onClick={navigateToChangePassword}>Password:&nbsp; {password}</p>
		<button id='logoutButton' onClick={logout}>Logout</button> */}
		<h1>Users in {organizationName}</h1>
		<div id="usersTable">
			<table style={tableStyle}>
      	<tbody>
        	<tr>
          	<th style={tdStyle}>Id</th>
          	<th style={tdStyle}>Name</th>
          	<th style={tdStyle}>Surname</th>
          	<th style={tdStyle}>Mail</th>
        	</tr>
          	{allUsers.map(({ id, name, surname, mail }) => (
            	<tr key={id}>
            	  <td style={tdStyle}>{id}</td>
            	  <td style={tdStyle}>{name}</td>
            	  <td style={tdStyle}>{surname}</td>
            	  <td style={tdStyle}>{mail}</td>
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
		<button id='addUserButton' onClick={goToAddUser}>Add user</button>
		{
			loginMessage === '' ? null : <div id='popup' onAnimationEnd={(()=>{setLoginMessage('')})}><label id='popuptext'>{loginMessage}</label> </div>
		}
	</div>
  );
}

export default Dashboard;
