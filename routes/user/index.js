const express = require('express');
const router = express.Router();
const models = require('../../models');

router.get('/', (req, res, next) => {
  res.redirect('/user/main');
});

router.get('/main', (req,res,next)=>{
  let a = [1,2,3]; //이런식으로 페이지에 변수전달가능
  res.render("user/main.html",a);
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