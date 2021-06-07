const videoElement = document.getElementById('video-element');
const startButtonElement = document.getElementById('start-button');
const stopButtonElement = document.getElementById('stop-button');
const saveButtonElement = document.getElementById('save-button');

let isRecorded = false;
let videoBuffer = null;
let mediaRecorder;
let myMediaStream = new MediaStream();

function startRecord() {
    startButtonElement.setAttribute('disabled', 'disabled');
    stopButtonElement.removeAttribute('disabled');
    saveButtonElement.setAttribute('disabled', 'disabled');

    videoBuffer = [];
    startCapture()
        .then((stream) => {
            // videoElement.srcObject = stream;
            console.log('Start');
            // mediaRecorder = new MediaRecorder(stream);
            // mediaRecorder.addEventListener("dataavailable",function(event) {
            //     videoBuffer.push(event.data);
            //     isRecorded = true;
            //     // console.log('event.data', event);
            // });
            // mediaRecorder.start(10);
            myMediaStream.addTrack(stream.getVideoTracks()[0]);
            setTimeout(() => {
                mediaRecorder = new MediaRecorder(myMediaStream);
                mediaRecorder.addEventListener("dataavailable",function(event) {
                    videoBuffer.push(event.data);
                    isRecorded = true;
                    // console.log('event.data', event);
                });
                mediaRecorder.start(10);
            }, 1000)
        })
}

function stopRecord() {
    startButtonElement.removeAttribute('disabled');
    stopButtonElement.setAttribute('disabled', 'disabled');
    saveButtonElement.removeAttribute('disabled');

    mediaRecorder.stop();
}

function saveVideo() {
    const voiceBlob = new Blob(videoBuffer, {
        type: 'video/webm;'
        // type: 'video/webm;codecs=vp8'
    });
    console.log('voiceBlob', voiceBlob);

    let link = document.createElement('a');
    link.download = 'video.webm';
    // link.download = 'video.avi';

    link.href = URL.createObjectURL(voiceBlob);

    link.click();

    URL.revokeObjectURL(link.href);
}

function startCapture() {
    const gdmOptions = {
        video: {
            cursor: "always"
        },
        // audio: true
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
        }
    }

    return navigator.mediaDevices.getUserMedia({
        audio: true
    })
        .then(function(stream) {
            const audios = stream.getAudioTracks();
            audios.forEach((audioStream) => {
                myMediaStream.addTrack(audioStream);
            })
            return navigator.mediaDevices.getDisplayMedia(gdmOptions)
                .catch(err => { console.error("Error:" + err); return null; });
        })
}