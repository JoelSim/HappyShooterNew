export function commaThousands(words){
    // words.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    if(words != null){
        words = parseFloat(words);
        return words.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      }
    else
        return false;
}

export function commaThousandsNoDecimal(words){
    // words.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    if(words != null){
        words = parseInt(words);
        return words.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
    else
        return false;
}

export function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true && JSON.stringify(obj) === JSON.stringify({});
}

export function shuffle(a) {
   var j, x, i;
   for (i = a.length; i; i--) {
       j = Math.floor(Math.random() * i);
       x = a[i - 1];
       a[i - 1] = a[j];
       a[j] = x;
   }
   return a;
}

export function removeAlphabet(value){
    var myString = value;
    myString = myString.replace(/[^\d]/g, '');
    return myString;
}

export function text2Binary(string) {
    return string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
}

export function binarytoString(str) {
    return str.split(/\s/).map(function (val){
        return String.fromCharCode(parseInt(val, 2));
    }).join("");
}

export function getRandom (min, max)
{
      return Math.random() * (max - min) + min;
}
export function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isParsable(input) {
  try {
    JSON.parse(input);
  } catch (e) {
    return false;
  }
    return true;
}

//return false if string contain characters outside of ASCII 32-127
export function isAscii(str) {
  var code, i, len;

  if (str == null || str == ""){
    return false;
  }else{
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);

      if (!(code >= 32 && code <= 47) && // symbol => !"#$%&'()*+,-./
          !(code >= 48 && code <= 57) && // numeric (0-9)
          !(code >= 58 && code <= 64) && // symbol => :;<=>?@
          !(code >= 65 && code <= 90) && // upper alpha (A-Z)
          !(code >= 91 && code <= 96) && // symbol => [\]^_'
          !(code >= 97 && code <= 122) && // lower alpha (a-z)
          !(code >= 123 && code <= 127)) { // symbol => {|}~
        return false;
      }
    }
  }

  return true;
}

//turn amount into shortform in various language
export function shortFormAmount(amount, lang){
  if (lang == 'ch'){
    if (amount >= 1000 && amount < 10000){
      var tempAmount = amount/1000;
      var tempString = tempAmount+"千";

      return tempString;
    }else if(amount >= 10000){
      var tempAmount = amount/10000;
      var tempString = tempAmount+"万";

      return tempString;
    }else{
      return amount;
    }
  }else if(lang == "tw"){
    if (amount >= 1000 && amount < 10000){
      var tempAmount = amount/1000;
      var tempString = tempAmount+"千";

      return tempString;
    }else if(amount >= 10000){
      var tempAmount = amount/10000;
      var tempString = tempAmount+"萬";

      return tempString;
    }else{
      return amount;
    }
  }else{
    if (amount >= 1000 && amount < 1000000){
      var tempAmount = amount/1000;
      var tempString = tempAmount+"K";

      return tempString;
    }else if(amount >= 1000000){
      var tempAmount = amount/1000000;
      var tempString = tempAmount+"M";

      return tempString;
    }else{
      return amount;
    }
  }
}