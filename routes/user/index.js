const express = require('express');
const router = express.Router();
const models = require('../../models');
const auth = require('../auth');

router.get('/', (req, res, next) => {
  res.redirect('/user/main');
});

router.get('/main', auth, (req,res,next)=>{
  //let a = req.cookies.token;
  res.render("user/main.html");
});

router.get('/schedule', (req,res,next)=>{
  res.render("user/schedule.html");
});

router.get('/make_schedule', (req,res,next)=>{
  res.render('user/make_schedule.html');
});

router.get('/schedule/getusertime',async(req,res,next)=>{
  const usertime = await models.UserTime.findAll({
    where: {
      uid: "test"
    },
    include: [models.User, models.Schedule]
  });
  res.send(usertime);
})

module.exports = router;