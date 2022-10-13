import express from 'express';
import axios from "axios";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));



const fetchUrlData = async(url) => {
    try{
        let data = (await axios({
             url,
            //  headers: { 
            //     Cookie : '_abck=C6634C170FE4EF0A8BB68D543A6A72B7~-1~YAAQFdjIF+ycw72DAQAA7BQ80QgKcY+Swc1QxtbEwY84z+68kRWnAWb8zQUMlM8yyykMrMfg1y7CYGzlHlmrxP24KeXQGl0oJ4tmO2RGJL5wsYotf//ZHhIJGCoP2zriIpwLcVUuDTBNae5guRWXcqWAc9c2kOe3dW4BI4T6crNFJJ0Yit7MyAuGkSGM9a/IC9Mlaj2VUNCxBRt8kL6IL6ttiGYz+Qm7ZGZlXaGPVxlXBx1M3JqtcfGV/x8pEBWQwORRMsDnFlvnc1oG4sJ1nZeXR2kiIJZJOcPxNN1o60sbwPlsTbW3NkQ1Snu41HettbYpJ4bbzcqBaC5Gj+D+JoDS5ifQy5WI5Gvu3hiF6CQXW1A/ZjfMmq8u/PdMRA/eRJSUrcG5p7g4tUno1w==~-1~-1~-1; ak_bmsc=D32187E149882BDDBCC32A98FFE56329~000000000000000000000000000000~YAAQ73UsMdWO2aqDAQAAvfB20RGJcmnc0lVDgx1mOWieNfdCS8GcsZLHQi40oQqN0Ptqw57caQwvM5M+MszkxOv/tnzOHFzoXOuIf7DlvEnY9W4+bqGosQaFv4OsvO67qjsSQn0ZCUng+G9EOzGLWWdgFaf5nUmu8wzRIwFTrO7oQW5kMfjohRTJUATue+lozGQ6Y297uoSti4XEeZS6efbWjEgxT4dG6d/howFrmFOFgI2dMtnlCtO6ft0wRJri9wQWCoSvMg1EA10Ew90pZqV2JL5Dpzkt1Y/hU12MOE6Ew5XoDjclgddiGPV76U9cQhHp3ZwdCM3oKI8oxee5opMfd9rCeUyO0YP2gzdXDLJoWgCymeZutQ0hryNBrJlWzw==; bm_sz=EFE80DA47A0B53EE91E55E449F96240D~YAAQFdjIF+6cw72DAQAA7BQ80RF4KjUbZ77/YV6xVYrey7srLlpOGjoM2A4BBiF9vwGihOz5l6rCg14+UHPUuZ0ogYA+nKJBMQGVKc1aOLHJwMB4xQenqz3wn7P2in3OpAeH1wUAsm4fXHViVIIh8TxLqDAgJkeIbDmXIOgozBqi4inYfYpWNQsJe99UVS+C52pryaNi32nHTwzrFg39xV9WYVBFjuhwmwdZ9SlHUV07cn4OwNKqnmdJeT31iidLLD0RSSF8TaNLUAjstjf89W4AivQe/QIW+196lrF9LXZYU3nknIZKVGs=~3356976~4538690'
            // } 
    })).data;
        return data;
    }
    catch(err){
        res.status(500).json(err.message);
    }
}
app.get( '/:registrationnumber', async(req, res) => {
    let obj = {};
    const regNo = req.params.registrationnumber;
    const response = await fetchUrlData(`https://twowheeler.policybazaar.com/MVCController/PreQuote/CJRenewalRedirect?RegistrationNo=${regNo}&isQuote=true&isVendorResponse=0`);
   
    if(typeof response == 'string' && response){
        let data = JSON.parse(response).ResponseObject;
        obj = {
            CityAndRTO : data?.Regn_no,
            Manufacturer : data?.MakeName,
            Registration_Year : data?.RegYear,
            Model_And_Varient : data?.VariantName
         }
    }
    else {
        let encryptedEnquiryId = response.EncryptedEnquiryId;
        const response2 = await fetchUrlData(`https://twowheeler.policybazaar.com/MVCController/Quote/TWGetUserInfo?enquiryId=${encryptedEnquiryId}&=1665571290701`);
        let RegYear = response2?.VehicleDetails?.RegistrationDate.substring(0,4);
        obj = {
        CityAndRTO : response2?.VehicleDetails?.RegistrationNumber,
        Manufacturer : response2?.VehicleDetails?.MakeName,
        Registration_Year : RegYear,
        Model_And_Varient : `${response2?.VehicleDetails?.ModelName} - ${response2?.VehicleDetails?.VariantName}`,
     }
    }
    
    return res.status(200).json(obj);
});

app.listen(3000, () => {
    console.log("Server Started");
})
