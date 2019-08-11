var express = require('express');
var payumoney = require('payumoney-node');
payumoney.setKeys("Ew9BexMK", "rum21IvEWc", "hShRcqtbGEK+gzBGRqwcnlJnacS86GhGQbf6o5uvNZM="); 
var app = express();
payumoney.isProdMode(true);

app.use(express.urlencoded());
var db = require('./dbcon');
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/notes', function(req, res) {
var cash = req.query.amount;
//  var cash="10";
	//res.json({notes: "This is your notebook. Edit this to start saving your notes!"});
	var paymentData = {
    productinfo: "test",
    txnid: "12343254",
    amount: cash,
    email: "jkjjithinjkj@gmail.com",
    phone: "8891676114",
    lastname: "jayaraj",
    firstname: "Jithin k",
    surl: "", //"http://localhost:3000/payu/success"
    furl: "", //"http://localhost:3000/payu/fail"
};
 
payumoney.makePayment(paymentData, function(error, response) {
  if (error) {
    // Some error
  } else {
    // Payment redirection link
    console.log(response);
	  res.json({url:response});
  }
});
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
		response.json(result);
		else
			response.json({status:"NOT_OK"});
	});
});
app.post('/reg',function(request,response){
	var quer="select * from user where name='"+request.body.username+"' or phone='"+request.body.phone+"'or email='"+request.body.mail+"'";
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) throw err;
		else
			{
		console.log(request.body.username);
		console.log(result);
		if(result.length==1)
		response.json({status:"NOT_OK"});
		else
		{quer="insert into user (name,email,phone,type,password) values ('"+request.body.username+"','"+request.body.mail+"','"+request.body.phone+"','"+request.body.type+"','"+request.body.password+"')";
			console.log(quer);
			db.query(quer,function(err,result){
			if(err) throw err;	
			else{
				console.log("reg success");		
				response.json({status:"OK"});}
			});
		}
	}
	});
});

app.post('/help_res',function(request,response){
	//var quer="select * from help where status='OPEN'";
	var quer="select help.id,help.no_of_people,help.landmark,help.contact,help.message,help.location,user.name name from help,user where help.requested_user=user.id and status='OPEN'";
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result.length);
		response.json(result);
		
	});
});
app.post('/help_mine',function(request,response){
	var quer="select help.id,help.no_of_people,help.landmark,help.contact,help.message,help.location,help.requested_user,help.status,user.name 'accepted_name',user.phone 'accepted_contact' from help,user where accepted_user=user.id and requested_user="+request.body.userid;
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result.length);
		response.json(result);		
	});
});
app.post('/vol_help_mine',function(request,response){
	var quer="select help.id,help.no_of_people,help.landmark,help.contact,help.message,help.location,help.requested_user,help.status,user.name 'accepted_name',user.phone 'accepted_contact' from help,user where accepted_user=user.id and accepted_user="+request.body.userid;
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
	var quer="select missing.id,missing.name,missing.age,missing.gender,missing.location,user.name 'reported_user',user.phone 'contact',user.id 'reported_uid' from missing,user where missing.reported_user=user.id and miss_found='"+request.body.type+"'"
//	var quer="select * from missing where ;
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) throw err;
//		console.log(request.body.username);
		console.log(result.length);
		response.json(result);
		
	});
});
app.post('/del_miss',function(request,response){
	var quer="delete from missing where id="+request.body.id;
//	var quer="select * from missing where ;
	console.log(quer);
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
app.post('/accept_help',function(request,response){
	var quer=" update help set status='ACCEPTED',accepted_user="+request.body.userid+" where id="+request.body.id;
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) 
		{
			response.json({status:"NOT_OK"});
			throw err;
		}
		else
		response.json({status:"OK"});
			});
});

app.post('/accept_req',function(request,response){
	var quer=" update requests set status='ACCEPTED',accepted_user="+request.body.userid+"  where id="+request.body.id;
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) 
		{
			response.json({status:"NOT_OK"});
			throw err;
		}
		else
		response.json({status:"OK"});
			});
});

app.post('/requests',function(request,response){
	var quer="select * from requests where name='"+request.body.name+"' and contact='"+request.body.contact+"' and requested_user="+request.body.requested_user;
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result);
		if(result.length==1)
		response.json({status:"NOT_OK"});
		else
			quer="insert into requests (name,contact,no_of_people,food,water,soap,dress,bed,medicine,location,status,requested_user,accepted_user) values ('"+request.body.name+"','"+request.body.contact+"',"+request.body.count+",'"+request.body.food+"','"+request.body.water+"','"+request.body.soap+"','"+request.body.dress+"','"+request.body.bed+"','"+request.body.medicine+"','"+request.body.location+"','OPEN',"+request.body.requested_user+",1)";
			console.log(quer);
			db.query(quer,function(err,result){
			if(err) throw err;	
			else
							response.json({status:"OK"});
			});
	});
});
app.post('/request_res',function(request,response){
	var quer="select * from requests where status='OPEN'";
	//var quer="select requests.id,requests.name,requests.contact,requests.no_of_people,requests.location,requests.status,requests.accepted_user,user.name 'name',user.phone 'accepted_contact' from requests where requests.reported_user=user.id and status='OPEN'";
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result.length);
		response.json(result);
		
	});
});
app.post('/request_mine',function(request,response){
	var quer="select requests.id,requests.name,requests.contact,requests.no_of_people,requests.location,requests.status,requests.accepted_user,user.name 'accepted_name',user.phone 'accepted_contact' from requests,user where requests.accepted_user=user.id and requested_user="+request.body.userid;
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result.length);
		response.json(result);
		
	});
});
app.post('/vol_request_mine',function(request,response){
	var quer="select requests.id,requests.name,requests.contact,requests.no_of_people,requests.location,requests.status,requests.accepted_user,user.name 'accepted_name',user.phone 'accepted_contact' from requests,user where requests.accepted_user=user.id and requests.accepted_user="+request.body.userid;
	console.log(quer);
	db.query(quer,function(err,result){
		if (err) throw err;
		console.log(request.body.username);
		console.log(result.length);
		response.json(result);
		
	});
});

app.listen(80);