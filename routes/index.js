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
  res.clearCookie("uid")
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
  });
  const usertime = await models.UserTime.create({
    start_time: new Date(),
    end_time: new Date("2022-11-27T02:00:00"),
    schedule_id: schedule.schedule_id,
    uid: user.id
  });
  user.addSchedule(schedule);
  res.sendStatus(200);
})

module.exports = router;