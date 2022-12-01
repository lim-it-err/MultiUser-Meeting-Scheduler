const express = require('express');
const router = express.Router();
const models = require('../models');
const bcrypt = require("bcryptjs");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const auth = require('./auth');

router.get('/', (req, res) => {
  res.redirect('/login');
});

//------------login--------------
router.get('/login', (req, res) => {
  res.render("login.html");
});

router.post('/login', async (req, res) => {
  const responseUid = req.body.uid;
  const user = await models.User.findOne({where: {uid: responseUid}});
  if (!user) res.sendStatus(404);
  else {
    let isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) res.sendStatus(401);
    else {
      const TOKEN_KEY = process.env.JWT_SECRET || "";
      const token = jwt.sign(
        {uid: responseUid},
        TOKEN_KEY,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).send({
          uid: user.uid,
          accessToken: token
        }
      );
    }
  }
})

router.get('/logout', auth, async(req,res) =>{
  res.clearCookie("token");
  res.redirect("/login");
})

//-------------user---------------
router.post('/signup', async (req, res) => {
  const responseUid = req.body.uid;
  const user = await models.User.findOne({where: {uid: responseUid}});

  if (user) res.sendStatus(409);
  else {
    const createdAt = Date.now();
    const user = await models.User.create({
      uid: responseUid,
      password: bcrypt.hashSync(req.body.password, 8),
      name: req.body.name
    });
    const TOKEN_KEY = process.env.JWT_SECRET || "";

    const token = jwt.sign(
      {uid: responseUid},
      TOKEN_KEY,
      {
        expiresIn: "1d",
      }
    );
    user.token = token;

    res.status(200).send({
      uid: user.uid,
      name: user.name,
      accessToken: token
    })
  }
});


//---------------------------
// https://www.notion.so/schedule-6d68794e9ab64020932994ffbca6b118
router.post('/schedule', async (req, res) => {
  let requestUid = req.body.uid;
  const scheduleName = req.body.name;
  const scheduleDate = req.body.date;   //Format : yyyy-mm-dd

  /* TODO: 
      1. Request Uid가 존재하지 않을 경우 -> 404 Not Found {body}
      2. Request가 하나라도 Null일 경우 → 404 Not Found {body}
      3. Request Date가 현재 날짜보다 이전인 경우 → 403 Forbidden
      4. 토큰이 유효하지 않으면 → 401 Unauthorized Error
      5. 해당일에 스케줄이 존재하면 → 409 Conflict Error
   */

  const schedule = await models.Schedule.create({
    name: scheduleName,
    sched_day: new Date(scheduleDate),
    uid: requestUid
  });
  return res.status(201).send(
    {schedule_id: schedule.schedule_id});
});

// GET schedule's details (Might later be used)
// router.get('/schedule/:schedule_id', async(req, res)=>{
//     var params = req.params;
//     const schedule = await models.Schedule.findOne({where: {schedule_id: params.schedule_id }});
//     if (!schedule)  return res.status(404).send({description:"no schedules are found."});
//    
//     return res.status(201).json(schedule.toJSON());
//
// });

// https://www.notion.so/schedule-join-a533e2354142498ca61d733844f8ec1a
router.post('/schedule/join', async (req, res) => {
  let requestScheduleId = req.body.schedule_id;
  let requestUid = req.body.uid;
  const existingSchedule = await models.Schedule.findByPk(requestScheduleId);
  if (!existingSchedule) return res.status(404).send({description: "no schedules are found"})
  const newSchedule = await models.Schedule.create({
    name: existingSchedule.name,
    sched_day: existingSchedule.sched_day,
    uid: requestUid
  })
  /* TODO:
      1. If schedule Not exists -> 404 Error (Done)
   */
  return res.status(201).send(
    {schedule_id: newSchedule.schedule_id});
});

// https://www.notion.so/scheudle-userid-fc61ec47299c4e33a0697aee0f8f514b
router.get('/schedule/:uid', async (req, res) => {
  var requestUid = req.params.uid;
  const scheduleList = await models.Schedule.findAll({
    // attributes:['schedule_id', 'name', 'sched_day'],
    where:{
      uid:requestUid
    }
  });
  return res.status(201).send({scheduleList})
})
//------------example-------------

router.get('/testcreate', async (req, res) => {
  const user = await models.User.create({
    uid: "test",
    password: 1234,
    name: "테스트유저"
  });
  const schedule = await models.Schedule.create({
    name: "테스트일정",
    sched_day: new Date(),
    uid: user.uid,
  });
  const usertime = await models.UserTime.create({
    start_time: new Date(),
    end_time: new Date("2022-11-27T02:00:00"),
    schedule_id: schedule.schedule_id,
    uid: user.id
  });
  res.sendStatus(200);
})

module.exports = router;