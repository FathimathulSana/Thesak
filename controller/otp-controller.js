const dotenv = require('dotenv')
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ServiceSID = process.env.TWILIO_ServiceSID;
const client = require('twilio')(accountSid, authToken, ServiceSID);

exports.sendOtp = async (phonenumber) => {
 
    try {
        const data = await client.verify.v2.services(ServiceSID).verifications.create({
           
            to: `+91${phonenumber}`,
            channel: 'sms'
          
        })
    
    } catch (error) {
        console.log(error)
    }
}

exports.verifyOtp = async (phonenumber, otp) => {
    try {
        const data = await client.verify.v2.services(ServiceSID).verificationChecks.create({
            to: `+91${phonenumber}`,
            code: otp
        })
        return data
    } catch (error) {
        console.log(error)
    }
}
