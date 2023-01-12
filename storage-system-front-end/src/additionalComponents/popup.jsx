import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './popup.css';

function ChangeUserData(props) {

  return (
		<div id='popup'>
			<label id='popuptext'>{props.message}</label>
		</div>
	);
}

export default ChangeUserData;
