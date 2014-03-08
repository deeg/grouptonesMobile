var DAL = require('../lib/DAL'),
    _ = require('underscore');

module.exports.list = function (req, res) {
	DAL.makeQuery({query: 'SELECT e.*, a.artist_name from mail_messages e JOIN artists_profile a ON e.from_id = a.id where e.to_id = ? ORDER BY sent_date DESC', escapedValues: [req.user[0].id]}, function (err, messages) {
        if (!err) {
            console.log(messages);
            res.render('messageList.dust', {list: messages, currentUser: req.user[0]});
        } else {
            res.json(500);
        }
    });
};

module.exports.message = function (req, res) {
	DAL.makeQuery({query: 'SELECT * from mail_messages where id = ?', escapedValues: [req.params.id]}, function (err, message) {
        if (!err) {
			if (message) {
				console.log(req.user[0].id);
				if (message[0].to_id !== req.user[0].id) {
					res.json(404);
				}
				console.log(message);
				res.render('message.dust', message[0]);
			}
        } else {
            res.json(500);
        }
    });
};