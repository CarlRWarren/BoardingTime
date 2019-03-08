
var eyes = 'eyes1';
var eyesCount = 0;
var eyesList = ['eyes1','eyes2','eyes3','eyes4','eyes5','eyes6','eyes7','eyes9','eyes10'];

var nose = 'nose2';
var noseCount = 0;
var noseList = ["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"];

var mouth = 'mouth4';
var mouthCount = 0;
var mouthList = ["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"];

var color = 'DEADBF';

var img = document.getElementById('avatar');
var colorPicker = document.getElementById('colorPicker');

var Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
img.setAttribute("src", Avatar);

var avatarUpdateColor = () =>{
    color = colorPicker.value;
    color = color.replace('#',"");
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.setAttribute("src", Avatar);
}

var avatarEyesUp = () => {
    eyesCount++;
    if(eyesCount > 8){
        eyesCount = 0;
    }
    eyes = eyesList[eyesCount];
    console.log(eyes);
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.setAttribute("src", Avatar);
}

var avatarEyesDown = () => {
    eyesCount--;
    if(eyesCount < 0){
        eyesCount = 8;
    }
    eyes = eyesList[eyesCount];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.setAttribute("src", Avatar);
}

var avatarNoseUp = () => {
    noseCount++;
    if(noseCount > noseList.length){
        noseCount = 0;
    }
    nose = noseList[noseCount];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.setAttribute("src", Avatar);
}

var avatarNoseDown = () => {
    noseCount--;
    if(noseCount < 0){
        noseCount = noseList.length;
    }
    nose = noseList[noseCount];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.setAttribute("src", Avatar);
}

var avatarMouthUp = () => {
    mouthCount++;
    if(mouthCount > mouthList.length - 1){
        mouthCount = 0;
    }
    mouth = mouthList[mouthCount];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.setAttribute("src", Avatar);
}

var avatarMouthDown = () => {
    mouthCount--;
    if(mouthCount < 0){
        mouthCount = mouthList.length - 1;
    }
    mouth = mouthList[mouthCount];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.setAttribute("src", Avatar);
}