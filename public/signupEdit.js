var eyes = 'eyes1';
var eyesIndex = 0;
var eyesList = ['eyes1','eyes2','eyes3','eyes4','eyes5','eyes6','eyes7','eyes9','eyes10'];

var nose = 'nose2';
var noseIndex = 0;
var noseList = ["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"];

var mouth = 'mouth4';
var mouthIndex = 0;
var mouthList = ["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"];

var color = 'DEADBF';

var img = document.getElementById('avatar');
var hidsrc = document.getElementById('hiddenSrc');
var colorPicker = document.getElementById('colorPicker');

var Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
if (!img.src) {
    img.src = Avatar;
    hidsrc.value = Avatar;
} else {
    src = img.src;
    hexRegex = /[abcdef\d]{6}/;
    colorHex = src.match(hexRegex);
    colorPicker.value = `#${colorHex[0]}`;
}

var avatarUpdateColor = () =>{
    color = colorPicker.value;
    color = color.replace('#',"");
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarEyesUp = () => {
    eyesIndex++;
    if(eyesIndex > 8){
        eyesIndex = 0;
    }
    eyes = eyesList[eyesIndex];
    console.log(eyes);
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarEyesDown = () => {
    eyesIndex--;
    if(eyesIndex < 0){
        eyesIndex = 8;
    }
    eyes = eyesList[eyesIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarNoseUp = () => {
    noseIndex++;
    if(noseIndex > noseList.length){
        noseIndex = 0;
    }
    nose = noseList[noseIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarNoseDown = () => {
    noseIndex--;
    if(noseIndex < 0){
        noseIndex = noseList.length;
    }
    nose = noseList[noseIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarMouthUp = () => {
    mouthIndex++;
    if(mouthIndex > mouthList.length - 1){
        mouthIndex = 0;
    }
    mouth = mouthList[mouthIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarMouthDown = () => {
    mouthIndex--;
    if(mouthIndex < 0){
        mouthIndex = mouthList.length - 1;
    }
    mouth = mouthList[mouthIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var setAvatarSrc = (src) => {
    hidsrc.value = Avatar;
}