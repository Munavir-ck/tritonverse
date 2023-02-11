







const ServicesSID = process.env.SSID;
const accountSid = process.env.SID;
const authToken = process.env.TOKEN;
const client = require('twilio')(accountSid, authToken)


function sendotp(mobile) {
    client.verify.v2.services(ServicesSID)
        .verifications
        .create({ to: `+91${mobile}`, channel: 'sms' })
        .then(verification => console.log(verification.status));

    return true


}




function verifyotp(mobile, otp) {
    console.log(22222222222);
    console.log(mobile+11111111);
    console.log(otp+11111111);
    return new Promise((resolve, reject) => {
        client.verify.v2
            .services(ServicesSID)
            .verificationChecks.create({ to: `+91 ${mobile}`, code: otp }).then((verification_check) => {
                console.log(mobile+11111111);
                console.log(verification_check.status);
                resolve(verification_check);
            });
    }) }


module.exports = {
            sendotp,
            verifyotp
        }