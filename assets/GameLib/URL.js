function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

window.URL={
	username: getParameterByName('username'),
    isLive: getParameterByName('isLive'),
    uid: getParameterByName('uid'),
    lang: getParameterByName('lang'),
    profile_pic: getParameterByName('profile_pic'),
    nickname: getParameterByName('nickname'),
    share_link: getParameterByName('share_link'),
};