var _ = require("underscore"),
    profileController = require('../controllers/profileController'),
    DAL = require('../lib/DAL'),
    nodemailer = require('nodemailer'),
    emailConfig = require('/grouptones/emailConfig.js'),
    crypto = require('crypto');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: emailConfig.user,
        pass: emailConfig.password
    }
});

var mailOptions = {
    from: "Grouptones - Password Reset <no-reply@grouptones.com>", // sender address
    replyTo: 'noreply@grouptones.com',
    to: "", // list of receivers
    subject: "Grouptones Password Reset", // Subject line
    text: "To reset your password on GroupTones.com, please follow the link below. Forgotten password requests are only valid for 24 hours after submitting the password reset request form. If you are having trouble clicking the link, try copying and pasting it into your browser's address bar.\n\r\n\r" +
        "http://grouptones.com/?fp={resetId}", // plaintext body
    envelope: {
        from: "Grouptones - Password Reset <no-reply@grouptones.com>",
        to: ""
    }
};

module.exports.requestPasswordReset = function(req, res, next){
    var email = decodeURIComponent(req.query.email);

    profileController.getProfileByEmail(email, function(err, rows){
        if(err || !rows || !rows[0]){
            res.send('No user with that email', 400);
        }else{
            var user = rows[0];

            module.exports.addEntryToForgotPassword(user.id, function(err, resetId){
                if(!err){
                    var mailOpts = _.extend({}, mailOptions);
                    mailOpts.to = user.email;
                    mailOpts.envelope.to = user.email;
                    mailOpts.text = mailOpts.text.replace(/{resetId}/g, resetId);
                    module.exports.sendMail(mailOpts, function(err){
                        if(err){
                            return res.send('Error sending email, plesae try again.', 400);
                        }else{
                            return res.send('Check your email for instructions to reset your password.');
                        }
                    });
                }else{
                    return res.send('Problem creating forgot password email.', 400);
                }
            });
        }
    });
};

module.exports.setNewPassword = function(req, res, next){
    var email = req.query.email,
        newPassword = req.query.password ? crypto.createHash('sha256').update(req.query.password).digest('hex') : '',
        resetId = req.params.resetId;

    profileController.getProfileByEmail(email, function(err, userRows){
        var user = userRows && userRows[0];

        if(user){
            module.exports.getResetInformation(resetId, function(err, rows){
                var reset = rows[rows.length -1],
                    expTime = Math.round(((new Date().getTime()) / 1000) - 86400);

                if(reset && expTime < reset.request_date && email === user.email && newPassword){
                    profileController.updatePassword({email: user.email, password: newPassword}, function(err, newUserRows){
                        if(!err && newUserRows){
                            module.exports.removeEntryToForgotPassword(reset.id, function(err){
                                if(!err){
                                    return res.send('Password successfully changed.')
                                }
                            });
                        }else{
                            console.log(err);
                            console.log(newUserRows);
                            return res.send('Could not update password.', 400);
                        }
                    })
                }else{
                    return res.send('Could not reset password.', 400);
                }
            });
        }else{
            res.send('Incorrect email address.', 400);
        }

    });
};

module.exports.sendMail = function(opts, cb){
    smtpTransport.sendMail(opts, function(error, response){
        if(error){
           console.log('error sending mail: ', error);
           cb(error)
        }else{
            console.log("Message sent: " + response.message);
            cb();
        }
    });
};

module.exports.addEntryToForgotPassword = function(userId, cb){
    var resetId = module.exports.makeRequestCode();
    var requestTime = Math.round((new Date()).getTime() / 1000);

    DAL.makeQuery({query: 'UPDATE forgot_password SET request_date = 0 WHERE artist_id = ?', escapedValues: [userId]}, function(err){
        if(!err){
            DAL.makeQuery({query: "INSERT INTO forgot_password (artist_id, request_date, request_code) " + "VALUES (?, ?, ?)", escapedValues : [userId, requestTime, resetId]}, function(err){
                cb(err, resetId);
            });
        }else{
            cb(err);
        }
    })
};

module.exports.removeEntryToForgotPassword = function(id, cb){
    var resetId = module.exports.makeRequestCode();
    DAL.makeQuery({query: "DELETE FROM forgot_password WHERE id = ?", escapedValues : [id]}, function(err){
        cb(err);
    });
};

module.exports.getResetInformation = function(resetId, cb){
    DAL.makeQuery({query: 'SELECT * FROM forgot_password where request_code = ?', escapedValues: [resetId]}, function(err, rows){
        cb(err, _.sortBy(rows, 'request_date'));
    })
};

module.exports.makeRequestCode = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};