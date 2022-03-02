const socket = io();

const myFace = document.getElementById("myface");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let isMuted = false;
let isCameraOff = false;
let myStream;
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
//Onload
window.addEventListener("load", () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices()를 지원하지 않습니다.");
    return;
  }
  getMedia();
});
