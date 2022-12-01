const {verify} = require("../util/token");

const auth = (req,res,next)=>{
  if(req.cookies.token){
    const token = req.cookies.token;
    const result = verify(token);
    next();
  } else {
    console.log(req.cookies);
    //res.redirect("/login");
  }
}

module.exports = auth;