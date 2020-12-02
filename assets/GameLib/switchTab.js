//  document.addEventListener("visibilitychange", function() {
//     if(document.hidden){

//     }

//     if(document.visibilityState == "visible"){
//         if(URL.token && URL.host_id){
//             if (history.pushState) {
//                 // cc.log("enter here")
//                 setTimeout(function(){
//                     var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?host_id='+URL.host_id+'&access_token='+URL.token+"&lang="+URL.lang+"&allow_vertical="+URL.allow_vertical+"&return_lobby="+URL.return_lobby;
//                     window.history.pushState({path:newurl},'',newurl);
//                     location.reload();
//                 },1000);
//             }
//         }else{
//             location.reload();
//         }
//     }
// }, false);