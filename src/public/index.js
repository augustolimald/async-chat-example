let socket;
let user = localStorage.getItem('user');
if (user) {
	user = JSON.parse(user);
	login();
}

function startConnection(login, onReceivedMessage) {
	socket = io({
		auth: {
			login,
		}
	});

	socket.on('error', () => {
		console.log('falhou conexão');
	});

	socket.on("connect_error", (err) => {
		console.log('falhou autenticação');
	});

	socket.on('connect', () => {
		console.log('conectou');
	
		socket.on('disconnect', () => {
			console.log('desconectou');
			socket = null;
		});
	});

	socket.on('message', addMessage);
	socket.on('totalConnections', onReceivedMessage);
	socket.on('status', showStatus);

	socket.on('newConnection', addUser);
	socket.on('lostConnection', removeUser);
}

function showStatus(status) {
	if (status.endsWith('joined')) {
		toastr.info(status);
	} else {
		toastr.warning(status);
	}
}

function finishConnection() {
	if (socket) {
		socket.disconnect();
	}
}

function sendMessage(message) {
	if (socket) {
		socket.emit('message', message);
	}
}

function handleSendMessage() {
	const message = document.getElementById('inputMessage').value;
	
	if (!message || message === '') {
		alert('Type some message');
		return;
	}

	sendMessage(message);
}

function addMessage(data) {
	const self = data.user.id === user.id;

	const div = document.createElement('div');
	div.className = `chat-message-${self ? 'right' : 'left'} pb-4`;

	const div1 = document.createElement('div');
	const img = document.createElement('img');
	img.src = data.user.avatar_url;
	img.className = 'rounded-circle mr-1';
	img.alt = data.user.name;
	img.width = '40';
	img.height = '40';
	div1.appendChild(img);

	const div2 = document.createElement('div');
	div2.className = 'text-muted small text-nowrap mt-2';
	div2.innerHTML = new Date(data.date).toLocaleTimeString();
	div1.appendChild(div2);

	div.appendChild(div1);

	const div3 = document.createElement('div');
	div3.className = `flex-shrink-1 bg-light rounded py-2 px-3 m${self ? 'r' : 'l'}-3`;
	div3.innerHTML = `
		<div class="font-weight-bold mb-1">${self ? 'You' : data.user.name}</div>
		${data.text}
	`;

	div.appendChild(div3);

	document.getElementById('messagesList').appendChild(div);
	return;
}

function addUser(data) {
	const id = `user-${data.id}`;
	if(document.getElementById(id)) {
		return;
	}

	const a = document.createElement('a');
	a.id = id;
	a.className = 'list-group-item list-group-item-action border-0';
	a.href = '#';

	const externalDiv = document.createElement('div');
	externalDiv.className = 'd-flex align-items-start';

	const img = document.createElement('img');
	img.src = data.avatar_url;
	img.className = 'rounded-circle mr-1';
	img.alt = data.name;
	img.width = '40';
	img.height = '40';
	externalDiv.appendChild(img);

	const div = document.createElement('div');
	div.className = 'flex-grow-1 ml-3';
	div.innerHTML = `${data.name} <div class="small"><span class="fas fa-circle chat-online"></span> Online</div>`;
	externalDiv.appendChild(div);

	a.appendChild(externalDiv);

	document.getElementById('usersList').appendChild(a);
}

function removeUser(user) {
	const userElement = document.getElementById(`user-${user.id}`);
	document.getElementById('usersList').removeChild(userElement);
}

async function handleLogin() {
	const inputLogin = document.getElementById('inputLogin').value;
	if (!inputLogin) {
		alert('Preencha um valor primeiro');
		return;
	}

	const data = await fetch(`/api/users/${inputLogin}`);
	if (data.status !== 200) {
		alert('Usuário não encontrado');
		return;
	}

	user = await data.json();
	localStorage.setItem('user', JSON.stringify(user));
	
	login();
}

async function login() {
	// Hide login form
	document.getElementById('loginContainer').innerHTML = '';
	document.getElementById('appContainer').style.display = 'block';

	// Set User Info
	document.getElementById('userName').innerHTML = user.name;
	document.getElementById('userBio').innerHTML = user.bio;
	document.getElementById('userAvatar').src = user.avatar_url;

	// User List
	addUser(user);

	const usersResponse = await fetch(`/api/connections?login=${user.login}`);
	const users = await usersResponse.json();
	users.forEach(user => addUser(user));

	// Message List
	const messagesResponse = await fetch(`/api/messages?login=${user.login}`);
	const messages = await messagesResponse.json();
	messages.forEach(message => addMessage(message));

	startConnection(user.login, console.log);
}

function handleLogout() {
	localStorage.clear();
	window.location.reload();
}