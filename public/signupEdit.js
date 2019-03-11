var eyes = 'eyes1';
var eyesIndex = 0;
var eyesList = ['eyes1', 'eyes2', 'eyes3', 'eyes4', 'eyes5', 'eyes6', 'eyes7', 'eyes9', 'eyes10'];

var nose = 'nose2';
var noseIndex = 0;
var noseList = ["nose2", "nose3", "nose4", "nose5", "nose6", "nose7", "nose8", "nose9"];

var mouth = 'mouth4';
var mouthIndex = 0;
var mouthList = ["mouth1", "mouth10", "mouth11", "mouth3", "mouth5", "mouth6", "mouth7", "mouth9"];

var color = 'DEADBF';

var img = document.getElementById('avatar');
var hidsrc = document.getElementById('hiddenSrc');
var colorPicker = document.getElementById('colorPicker');
if (img.src) {
    src = img.src;
    var hexRegex = /[A-Fa-f\d]{6}/;
    color = src.match(hexRegex)[0];
    colorPicker.value = `#${color}`;

    var eyesRegex = /eyes\d+/;
    eyes = src.match(eyesRegex)[0];
    eyesIndex = eyesList.indexOf(eyes);

    var noseRegex = /nose\d+/;
    nose = src.match(noseRegex)[0];
    noseIndex = noseList.indexOf(nose);

    var mouthRegex = /mouth\d+/;
    mouth = src.match(mouthRegex)[0];
    mouthIndex = mouthList.indexOf(mouth);

}

var Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;

img.src = Avatar;
hidsrc.value = Avatar;

var avatarUpdateColor = () => {
    color = colorPicker.value;
    color = color.replace('#', "");
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarEyesUp = () => {
    eyesIndex++;
    if (eyesIndex > eyesList.length - 1) {
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
    if (eyesIndex < 0) {
        eyesIndex = eyesList.length - 1;
    }
    eyes = eyesList[eyesIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarNoseUp = () => {
    noseIndex++;
    if (noseIndex > noseList.length - 1) {
        noseIndex = 0;
    }
    nose = noseList[noseIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarNoseDown = () => {
    noseIndex--;
    if (noseIndex < 0) {
        noseIndex = noseList.length - 1;
    }
    nose = noseList[noseIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarMouthUp = () => {
    mouthIndex++;
    if (mouthIndex > mouthList.length - 1) {
        mouthIndex = 0;
    }
    mouth = mouthList[mouthIndex];
    Avatar = `https://api.adorable.io/avatars/face/${eyes}/${nose}/${mouth}/${color}/300`;
    img.src = Avatar;
    hidsrc.value = Avatar;
}

var avatarMouthDown = () => {
    mouthIndex--;
    if (mouthIndex < 0) {
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