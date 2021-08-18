import * as ecryptContoller from 'ecrypt_New';
var global = require("GlobalData");
import * as constant from "Constant";

cc.Class({
    extends: cc.Component,

    onLoad: function()
    {
        cc.log("--------- Dynamic Endpoint ----------------");
        if(window.endPointConfig != null){
            var networkConfig = ecryptContoller.decrypt(window.endPointConfig);
            if(networkConfig != null){
                var networkConfigJson = JSON.parse(networkConfig);

                //cc.log(networkConfigJson.geoip_url);
                //cc.log(networkConfigJson.api_url);

                global.geoIp_url = networkConfigJson.geoip_url;
                global.api_url = networkConfigJson.api_url;
                constant.socketURL = constant.prodSocketURL;

                // cc.log(global.SetGeoip_Url(networkConfigJson.geoip_url));
                // cc.log(global.SetApi_Url(networkConfigJson.api_url));
            }
        }
    },
});
