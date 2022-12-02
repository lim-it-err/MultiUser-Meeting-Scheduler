const express = require('express');
const router = express.Router();
const models = require('../../models');
const auth = require('../auth');
const {verify} = require("../../util/token");


//routes
router.get('/', (req, res, next) => {
  res.redirect('/user/main');
});

router.get('/main', auth, (req,res,next)=>{
  res.render("user/main.html");
});

router.get('/schedule', auth, (req,res,next)=>{
  res.render("user/schedule.html");
});

router.get('/make_schedule', auth, (req,res,next)=>{
  res.render('user/make_schedule.html');
});

//main page 요청들

// https://www.notion.so/schedule-join-a533e2354142498ca61d733844f8ec1a
router.post('/joinSchedule', auth, async (req, res) => {
  let requestScheduleId = req.body.schedule_id;
  let requestUid = req.body.uid;
  const existingUser = await models.User.findByPk(requestUid);
  const existingSchedule = await models.Schedule.findByPk(requestScheduleId);
  if (!existingSchedule) return res.status(404).send({description: "no schedules are found"})
  const newSchedule = await models.Schedule.create({
    name: existingSchedule.name,
    sched_day: existingSchedule.sched_day,
    uid: requestUid
  });
  newSchedule.addUser(existingUser);

  /* TODO:
      1. If schedule Not exists -> 404 Error (Done)
   */
  return res.status(201).send(
    {schedule_id: newSchedule.schedule_id});
});

router.get('/detail', auth, async(req, res)=>{
  const token = req.cookies.token;
  const result = verify(token);
  if(result.ok){
    let uid = result.uid;
    next();
  } else { //토큰인증실패
    res.status(401).send({
      ok:false,
      message:result.message
    });
    User.findOne({_id: userId}).then(function(user){
      // Do something with the user
      return res.status(201).send(user);
    });
  }
  return res.send(500);
});

//현재 uid의 유저가 가진 모든 스케쥴 가져오기
// https://www.notion.so/scheudle-userid-fc61ec47299c4e33a0697aee0f8f514b
router.get('/getSchedule/:uid', async (req, res) => {
  var requestUid = req.params.uid;
  const user = await models.User.findOne({
    // attributes:['schedule_id', 'name', 'sched_day'],
    where:{
      uid:requestUid
    },
    include:models.Schedule
  });
  console.log(user.Schedules);
  const scheduleList = user.Schedules;
  return res.status(201).send({scheduleList})
});

//For Backup Plan
router.get('/getSchedule_byFindall/:uid', async(req, res)=>
{
  var requestUid = req.params.uid;
  const scheduleList = await models.Schedule.findAll({
    // attributes:['schedule_id', 'name', 'sched_day'],
    where:{
      uid:requestUid
    }
  });
  return res.status(201).send({scheduleList})
})

//testing
router.get('/usertimetest',async(req,res,next)=>{
  const usertime = await models.Users.findAll({
    where: {
      uid: "test"
    },
    include: [models.User, models.Schedule]
  });
  res.send(usertime);
})

module.exports = router;