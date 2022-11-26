const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (req, res, next) => {
  res.redirect('/login');
});

router.get('/login', (req, res, next) => {
  res.render("login.html");
});

router.get('/testcreate', async(req, res, next) => {
    const user = await models.User.create({
      uid : "test",
      password :1234,
      name : "테스트유저"
    });
    const schedule = await models.Schedule.create({
      name : "테스트일정",
      sched_day : new Date(),
      uid : user.uid,
    });
    const usertime = await models.UserTime.create({
      start_time : new Date(),
      end_time : new Date("2022-11-27T02:00:00"),
      schedule_id : schedule.schedule_id,
      uid : user.id
    });
    res.sendStatus(200);
})

module.exports = router;