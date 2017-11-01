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
		res.render('home', { isget : true , message : 'Shorten your URL'});
	},
	post: function(req, res) {
		var siteUrl = "";
		if(process.env.NODE_ENV === 'production')
			siteUrl = "xhml.ml/";
		else
			siteUrl = "localhost:3000/";
		var data = req.body;
		UrlData.find().exec()
		.then((urldata) => {
			data.shortCode = makeid();
			var flag = true;
			while(flag) {
				flag = false;
				data.shortCode = makeid();
				for(var i in urldata) {
					if(urldata[i].url.endsWith(data.url))
						return res.render('home', { message : 'Success !' ,isget: false, link : siteUrl+urldata[i].shortCode, hits: urldata[i].hits });
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
				res.render('home', { isget: false, message : 'Sucess !', link : siteUrl+urldata.shortCode , hits: urldata.hits});
			});
		});
	},
	urlredirect: function(req, res) {
		var code = req.params.shortCode;
		UrlData.findOne({ shortCode : code}).exec()
			.then((data) => {
				if(!data)
					res.status(404).send("Not found!");
				data.hits += 1;
				data.save();
				res.redirect(data.url);
			})
			.catch((err) => {
				res.status(404).send("Error");
			});
	},

	apipost: function(req, res) {
		var siteUrl = "";
		if(process.env.NODE_ENV === 'production')
			siteUrl = "xhml.ml/";
		else
			siteUrl = "localhost:3000/";
		var data = req.body;
		UrlData.find().exec()
		.then((urldata) => {
			data.shortCode = makeid();
			var flag = true;
			while(flag) {
				flag = false;
				data.shortCode = makeid();
				for(var i in urldata) {
					if(urldata[i].url.endsWith(data.url))
						return res.json( { error : false, data: urldata[i] } );
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
					return res.json({ error : true })
				return res.json( { error: false, data } );
			});
		});
	}
};
