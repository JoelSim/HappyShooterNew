//language
var lang = "en";
var sound = true;

export function getLang(){
    return lang;
}

export function setLang(value){
    if (value != null){
        if (value == "en" || value =="ch" || value == "tw"){
            lang = value;
        }
    }

    return (lang);
}

export function getSound(){
  return sound;
}

export function setSound(value){
  if (value == true || value == false){
    sound = value;
  }
}