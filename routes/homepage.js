const UrlData = require('../models/urlData');

var makeid = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = {
	get: function(req, res) {
		res.render('home', { isget : true });
	},
	post: function(req, res) {
		var data = req.body;
		UrlData.find().exec()
		.then((urldata) => {
			data.shortCode = makeid();
			var flag = true;
			while(flag) {
				flag = false;
				data.shortCode = makeid();
				for(var i in urldata) {
					if(urldata[i].url == data.url)
						res.render('home', { isget: false, urldata : urldata[i]});
					if(urldata[i].shortCode !== data.shortCode)
						continue;
					flag = true;
				}
			}
			if(!(data.url.startsWith('http://') || data.url.startsWith('https://')))
				data.url = 'http://' + data.url;
			var urldata = new UrlData(data);
			urldata.save(function(err) {
				if(err)
					throw err;
				res.render('home', { isget: false, urldata : urldata});
			});
		});
	},
	urlredirect: function(req, res) {
		var code = req.params.shortCode;
		UrlData.findOne({ shortCode : code}).exec()
			.then((data) => {
				if(!data)
					res.json({ message : 'No url found'});
				res.redirect(data.url);
			})
			.catch((err) => {
				res.json(err);
			});
	}
};