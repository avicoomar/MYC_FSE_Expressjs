const jwt = require('jsonwebtoken');

//JWT Filter middleware function
function jwtFilter(req, res, next){
	const jwtToken = req.get("Authorization");
	try{
		if(req.path.startsWith("/auth") || jwt.verify(jwtToken,"coomar"))
			next();
		else
			res.sendStatus(403);
	}
	catch(error){
		//Log error if needed
		res.sendStatus(403);	
	}
}

//RBAC Filter middleware function
function rbacFilter(req, res, next){
	
	if(req.path.startsWith("/auth")){
		next();
		return;
	}
	
	const jwtToken = req.get("Authorization");
	const role = JSON.parse(atob((jwtToken.split(".")[1]))).role;
	try{

		if(req.path.startsWith("/entrepreneur")){
			if(role === "ENTREPRENEUR")
				next();
			else
				res.sendStatus(403);
		}
		else if(req.path.startsWith("/investor")){
			if(role === "INVESTOR")
				next();
			else
				res.sendStatus(403);
		}
		else{
			next();
		}
	}
	catch(error){
		//Log error if needed
		res.sendStatus(403);
	}
}

module.exports = { jwtFilter, rbacFilter };
