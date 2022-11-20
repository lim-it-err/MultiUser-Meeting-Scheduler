const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/main');
});

router.get('/main', (req,res,next)=>{
  let a = [1,2,3]; //이런식으로 페이지에 변수전달가능
  res.render("user/main.html",a);
})

router.get('/schedule', (req,res,next)=>{
  res.render("user/schedule.html");
})

router.get('/make_schedule', (req,res,next)=>{
  res.render('user/make_schedule.html');
})

module.exports = router;