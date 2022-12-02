const express = require('express');
const router = express.Router();
const models = require('../../models');
const auth = require('../auth');

router.get('/', auth, (req,res,next)=>{
  res.render('user/make_schedule.html');
});

//---------------------------
// https://www.notion.so/schedule-6d68794e9ab64020932994ffbca6b118
router.post('/', auth, async (req, res) => {
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
  const user = models.User.findByPk(requestUid);
  const schedule = await models.Schedule.create({
    name: scheduleName,
    sched_day: new Date(scheduleDate),
    uid: requestUid
  });
  schedule.addUser(user);
  return res.status(201).send(
    {schedule_id: schedule.schedule_id});
});

module.exports = router;