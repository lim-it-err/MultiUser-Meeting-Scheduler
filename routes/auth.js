const {verify} = require("../util/token");

const auth = (req,res,next)=>{
  if(process.env.NODE_ENV !== "production") {
    if(req.cookies && req.cookies.token){
      const token = req.cookies.token;
      const result = verify(token);
      if(result.ok){
        req.uid = result.uid;
      } else { //토큰인증실패
        console.log("Unauthorized Access");
        console.log("cookies : " + JSON.stringify(req.cookies));
      }
    } else { //토큰존재안함
      console.log("No token");
      console.log("cookies : " + JSON.stringify(req.cookies));
    }
    next();
    
  } else {
    if(req.cookies && req.cookies.token){
      const token = req.cookies.token;
      const result = verify(token);
      if(result.ok){
        req.uid = result.uid;
        next();
      } else { //토큰인증실패
        res.status(401).send({
          ok:false,
          message:result.message
        });
      }
    } else { //토큰존재안함
      res.redirect("/login");
    }
  }
}

module.exports = auth;