const socket = io();

//-----------------------------------------------------------------------
// Welcome Code
//-----------------------------------------------------------------------

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

let roomName;
//Enter Room Click Btn Event
welcomeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("enterRoom", { payload: input.value }, (result) => {
    zoomCall.querySelector(
      "h3"
    ).innerText = `Room Name is ${roomName} (${result.count})`;
    viewRoom(true);
  });
  roomName = input.value;
  input.value = "";
});

//-----------------------------------------------------------------------
// Zoom Call Code
//-----------------------------------------------------------------------

const zoomCall = document.getElementById("zoomCall");
const myFace = document.getElementById("myface");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let isMuted = false;
let isCameraOff = false;

let myStream;
let myPeerConnection;

async function getMedia(params) {
  const userMediaConstraints = Object.assign(
    {
      audio: true,
      video: { facingMode: "user" },
    },
    params
  );
  try {
    myStream = await navigator.mediaDevices.getUserMedia(userMediaConstraints);
    myFace.srcObject = myStream;
    if (!params) {
      await getUserDevices("videoinput");
    }
  } catch (e) {
    console.log(e, myStream);
  }
}

//Get User Devices
async function getUserDevices(kind) {
  try {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const devices = allDevices.filter((device) => device.kind === kind);
    const currentDevice = {};
    if (kind.indexOf("video") > -1) {
      currentDevice = myStream.getVideoTracks()[0];
    }
    if (kind.indexOf("audio") > -1) {
      currentDevice = myStream.getAudioTracks()[0];
    }
    devices.forEach((device) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.innerText = device.label;
      if (currentDevice.label === divece.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

//Mute Click Btn Event
muteBtn.addEventListener("click", () => {
  if (!myStream) return;
  myStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (!isMuted) {
    muteBtn.innerText = "UnMute";
  } else {
    muteBtn.innerText = "Mute";
  }
  isMuted = !isMuted;
});

//Camera Click Btn Event
cameraBtn.addEventListener("click", () => {
  if (!myStream) return;
  myStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (!isCameraOff) {
    cameraBtn.innerText = "Turn Camera On";
  } else {
    cameraBtn.innerText = "Turn Camera Off";
  }
  isCameraOff = !isCameraOff;
});

//Camera Select
cameraSelect.addEventListener("input", (e) => {
  const params = { video: { deviceId: e.target.value } };
  getMedia(params);
});

//-----------------------------------------------------------------------
// Common Code
//-----------------------------------------------------------------------

//Onload
window.addEventListener("load", () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices()를 지원하지 않습니다.");
    return;
  }
  viewRoom(false);
});

async function viewRoom(isView) {
  welcome.hidden = isView;
  zoomCall.hidden = !isView;
  if (isView) {
    await getMedia();
    initPeerConnection();
  }
}

//-----------------------------------------------------------------------
// Socket Function
//-----------------------------------------------------------------------
function addMessage(message) {
  const ul = zoomCall.querySelector("ul");
  const li = document.createElement("li");
  li.innerHTML = message;
  ul.appendChild(li);
}

socket.on("welcome", async (data) => {
  console.log("welcome log ", data);
  zoomCall.querySelector(
    "h3"
  ).innerText = `Room Name is ${roomName} (${data.count})`;
  addMessage(`[${data.nickname}] Joined Room!!~`);

  const offer = await myPeerConnection.createOffer();
  console.log(myPeerConnection, offer);
  myPeerConnection.setLocalDescription(offer);
});

//-----------------------------------------------------------------------
// Socket RTC Code
//-----------------------------------------------------------------------
function initPeerConnection() {
  myPeerConnection = new RTCPeerConnection();
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
