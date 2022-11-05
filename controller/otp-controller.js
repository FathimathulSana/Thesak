const dotenv = require("dotenv");
const { Promise } = require("mongoose");
// const { nextTick } = require("process");
dotenv.config();
const process = require("process");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ServiceSID = process.env.TWILIO_ServiceSID;
const client = require("twilio")(accountSid, authToken, ServiceSID);

//-------------------------send-otp----------------------//

exports.sendOtp = async (userData) => {
  try {
    const data = await client.verify.v2
      .services(ServiceSID)
      .verifications.create({
        to: `+91${userData.phonenumber}`,
        channel: "sms",
      });
  } catch (error) {
    console.log(error);
  }
};

// ----------------------verify-otp-----------------------//

exports.verifyOtp = async (otpData, userData) => {
  try {
    return new Promise(async (resolve, reject) => {
      await client.verify
        .services(ServiceSID)
        .verificationChecks.create({
          to: `+91${userData.phonenumber}`,
          code: otpData,
        })
        .then((verifications) => {
          resolve(verifications.valid);
        });
    });
  } catch (error) {
    console.log(error);
  }
};
