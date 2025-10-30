<div>
<input type="text" id="phoneInput" placeholder="Enter phone number" />
<button id="callButton">Call</button>
<div id="incomingCalls"></div>
    <div id="sessions"></div>
    <div id="cause"></div>
    <div id="error"></div>
 
</div>


<script>
let phone = null;
let pbx = null;
let secretKey = '';
let sessions = [];
let incomings = [];
let cause = '';
let error = '';
const userName = '1001';

const phoneInput = document.getElementById('phoneInput');
const callButton = document.getElementById('callButton');


async function fetchData() {
try {
  const response = await fetch("https://crm.voycell.com/admin/api_controller/get_access_token", {
    method: "POST"
  });
  if (!response.ok) throw new Error("Network response was not ok");
  const result = await response.json();
  const access_token = result.data.access_token;
  await getSecretKey(access_token);
} catch (err) {
  error = err.message;
  errorDiv.textContent = `Error: ${error}`;
}
}

async function getSecretKey(access_token) {
try {
  const responseForSecret = await fetch(
    `https://cmedia.ras.yeastar.com/openapi/v1.0/sign/create?access_token=${access_token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: userName,
        sign_type: "sdk",
        expire_time: 0
      })
    }
  );
  if (!responseForSecret.ok) throw new Error("Network response was not ok");

  const resultForSecret = await responseForSecret.json();
  secretKey = resultForSecret.data.sign;
  localStorage.setItem("secretKey", secretKey);
  initializePhone();
} catch (err) {
  error = err.message;
  errorDiv.textContent = `Error: ${error}`;
}
}

function initializePhone() {
if (!secretKey) return;

init({
  username: userName,
  secret: secretKey,
  pbxURL: "https://cmedia.ras.yeastar.com/openapi/v1.0/",
  disableCallWaiting: true
})
  .then(({ phone: initializedPhone, pbx: initializedPbx }) => {
    phone = initializedPhone;
    pbx = initializedPbx;
    phone.start();
    setupEventHandlers();
  })
  .catch((err) => {
    console.error(err);
    errorDiv.textContent = `Error: ${err.message}`;
  });
}


function setupEventHandlers() {
phone.on("startSession", updateSessions);
phone.on("deleteSession", handleSessionEnd);
phone.on("incoming", handleIncoming);

pbx.on("runtimeError", (err) => {
  console.error(`PBX runtime error: code ${err.code}, message ${err.message}`);
});
}


function updateSessions() {
sessions = Array.from(phone.sessions.values());
sessionsDiv.innerHTML = '';
sessions.forEach(session => {
  const sessionDiv = document.createElement('div');
  sessionDiv.textContent = `Session: ${session.status.callId}`;
  sessionsDiv.appendChild(sessionDiv);
});
}


function handleSessionEnd({ cause }) {
causeDiv.textContent = `Phone call ended, Cause: ${cause}`;
updateSessions();
}


function handleIncoming({ session }) {
incomings.push(session);
incomingCallsDiv.innerHTML = '';
incomings.forEach(incomingSession => {
  const incomingDiv = document.createElement('div');
  incomingDiv.textContent = `Incoming call: ${incomingSession.status.callId}`;
  incomingCallsDiv.appendChild(incomingDiv);
});
}


function callHandler() {
const number = phoneInput.value;
if (!phone || !number) return;

phone.call(number);
phoneInput.value = '';
causeDiv.textContent = '';
}


callButton.addEventListener('click', callHandler);


fetchData();

</script>



