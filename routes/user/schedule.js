const express = require('express');
const router = express.Router();
const models = require('../../models');
const auth = require('../auth');

router.get('/sched/:sched_id', auth, async(req,res,next)=>{
  const schedule = await models.Schedule.findOne({
    where: {schedule_id: req.params.sched_id },
    include:models.User
  });
  //console.log(JSON.stringify(schedule));
  if (!schedule)  return res.status(404).send({description:"no schedules are found."});
  if(schedule.Users.length){
    //schedule.Users = schedule.Users.filter(user => user.uid != req.uid);
    schedule.Users.sort(function(x,y){ return x.uid == req.uid ? -1 : y.uid == req.uid ? 1 : 0; });
  }
  res.render('user/schedule.html',{schedule:schedule});
});

// GET schedule's details (Might later be used)
// router.get('/getSchedInfo/:schedule_id', async(req, res)=>{
//     var params = req.params;
//     const schedule = await models.Schedule.findOne({where: {schedule_id: params.schedule_id }});
//     if (!schedule)  return res.status(404).send({description:"no schedules are found."});
//    
//     return res.status(201).json(schedule.toJSON());
//
// });

router.get('/getUserTime', async(req,res,next)=>{
  const user_times = await models.UserTime.findAll({
      where: { uid : req.query.uid, schedule_id: req.query.sched_id },
      include : {model: models.User, attributes:["name"]}
  });
  console.log(user_times);
  let time_arr = [];
  user_times.forEach(usertime=>{
    let time = {};
    time.resourceId = usertime.uid;
    time.start = usertime.start_time;
    time.end = usertime.end_time;
    time.title = usertime.User.name;
    time_arr.push(time);
  })
  return res.send(time_arr);
})

module.exports = router;