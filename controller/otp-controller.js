const dotenv = require('dotenv');
const { Promise } = require('mongoose');
const { nextTick } = require('process');
dotenv.config()
const process = require('process');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ServiceSID = process.env.TWILIO_ServiceSID;
const client = require('twilio')(accountSid, authToken, ServiceSID);

//-------------------------send-otp----------------------//

exports.sendOtp = async (userData) => {
  console.log(userData);
    try {
          console.log("66666666666666");
          console.log(userData.phonenumber,"33333333333333");
        const data = await client.verify.v2.services(ServiceSID).verifications.create({
           
            to: `+91${userData.phonenumber}`,
            channel: 'sms'
          
        },console.log("haayyy"))
        console.log(data,"77777777777777");
    
    } catch (error) {
        console.log(error)
    }
}

// ----------------------verify-otp-----------------------//

exports.verifyOtp = async (otpData,userData) => {
    // console.log("ethi",otp,phonenumber)
    try {
       return new Promise(async (resolve,reject) => {
        await client.verify.services(ServiceSID).verificationChecks.create({
            to : `+91${userData.phonenumber}`,
            code : otpData
        }).then((verifications) => {
            resolve(verifications.valid)
        });
       })
    } catch (error) {
        console.log(error)
    }
}
