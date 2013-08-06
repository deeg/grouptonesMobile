var nodemailer = require("nodemailer");

module.exports.sendEmail = function (req, res, connection) {
    // create reusable transport method (opens pool of SMTP connections)
    //TODO: Get SMTP info of grouptones support email address
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "grouptonesmobile@gmail.com",
            pass: "Grouppassword"
        }
    });

    //Pad email with sender email address and name
    req.body.mail = req.body.mail + '\n\n' + "From: " + req.body.name + ", " + req.body.email;

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: req.body.email, // sender address
        //TODO: Get goruptones support email address
        to: "wocochoco@gmail.com", // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.mail // plaintext body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log('email sent.');
            res.send(200);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}