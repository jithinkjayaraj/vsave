var express = require('express');
 
var app = express();

app.use(express.urlencoded());
var db = require('./dbcon');
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/notes', function(req, res) {
  res.json({notes: "This is your notebook. Edit this to start saving your notes!"});
});

// Access the parse results as request.body
app.post('/', function(request, response){
    console.log(request.body.user.name);
    console.log(request.body.user.email);
//	response.writeHead(200, {'Content-Type': 'text/html'});
	 response.json({response: "This is a POST request"});
//  response.end('thanks');
});	
 
app.get('/', function(request, response){
    response.json({test:"this is a test"});
});
app.post('/login',function(request,response){
	var quer="select * from user where name='"+request.body.username+"' and password='"+request.body.password+"'";
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result.length);
		if(result.length==1)
		response.json({status:"OK"});
		else
			response.json({status:"NOT_OK"});
	});
});
app.post('/reg',function(request,response){
	var quer="select * from user where name='"+request.body.username+"' or phone='"+request.body.phone+"'or email='"+request.body.mail+"'";
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result);
		if(result.length==1)
		response.json({status:"NOT_OK"});
		else
			quer="insert into user (name,email,phone,type,password) values ('"+request.body.username+"','"+request.body.mail+"','"+request.body.phone+"','"+request.body.type+"','"+request.body.password+"')";
			console.log(quer);
			db.query(quer,function(err,result){
			if(err) throw err;	
			else
							response.json({status:"OK"});
			});
	});
});

app.post('/help_res',function(request,response){
	var quer="select * from help where status='OPEN'";
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result.length);
		response.json(result);
		
	});
});
app.post('/help_req',function(request,response){
	var quer="select * from help where requested_user='"+request.body.requested_user+"'";
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result);
		if(result.length==1)
		response.json({status:"NOT_OK"});
		else
			quer="insert into help (no_of_people,landmark,contact,message,location,requested_user) values ('"+request.body.count+"','"+request.body.landmark+"','"+request.body.phone+"','"+request.body.message+"','"+request.body.location+"',"+request.body.requested_user+")";
			console.log(quer);
			db.query(quer,function(err,result){
			if(err) throw err;	
			else
							response.json({status:"OK"});
			});
	});
});
app.post('/miss_res',function(request,response){
	var quer="select * from missing where miss_found='"+request.body.type+"'";
	db.query(quer,function(err,result){
		if (err) throw err;
//		console.log(request.body.username);
		console.log(result.length);
		response.json(result);
		
	});
});
app.post('/miss_req',function(request,response){
	var quer="select * from missing where name='"+request.body.name+"' and age='"+request.body.age+"' and gender='"+request.body.gender+"' and reported_user="+request.body.uid;
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result);
		if(result.length==1)
		response.json({status:"NOT_OK"});
		else
			quer="insert into missing (name,age,gender,location,miss_found,reported_user) values ('"+request.body.name+"','"+request.body.age+"','"+request.body.gender+"','"+request.body.location+"','"+request.body.miss_found+"',"+request.body.uid+")";
			console.log(quer);
			db.query(quer,function(err,result){
			if(err) throw err;	
			else
							response.json({status:"OK"});
			});
	});
});

app.listen(80);