const express = require('express');
const router = express.Router();
const models = require('../../models');
const auth = require('../auth');
const moment = require("moment");

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

router.post("/setUserTime", auth, async(req,res,next)=>{
  const newUserTime = await models.UserTime.create({
    start_time : req.body.start_time,
    end_time : req.body.end_time,
    schedule_id : req.body.sched_id,
    uid: req.uid
  })
  //console.log(`created usertime : ${JSON.stringify(newUserTime)}`);
  if(newUserTime)
    return res.status(201).send({result:newUserTime});
  else
    return res.sendStatus(400);
})

router.post("/delUserTime", auth, async(req,res,next)=>{
  await models.UserTime.destroy({
    where: {
      start_time : req.body.start_time,
      end_time : req.body.end_time,
      schedule_id : req.body.sched_id,
      uid: req.uid
    }  
  })
  return res.status(201).send({success:true});
})

router.get('/getUserTimes', async(req,res,next)=>{
  const user_times = await models.UserTime.findAll({
      where: { uid : req.query.uid, schedule_id: req.query.sched_id },
      include : {model: models.User, attributes:["name"]}
  });
  //console.log(user_times);
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

router.get("/getEmptyTime", async(req,res,next)=>{
  const user_times = await models.UserTime.findAll({
    where: { schedule_id: req.query.sched_id },
    order : [['start_time','ASC']]
  });
  let time_arr = [];
  if (user_times.length ===0){
    res.send(time_arr);
    return;
  }
  let endmoments_arr = [ moment(user_times[0].start_time).set({'hour':0, 'minute':0,'second':0}) ];
  let i , emptycnt=1;
  for(i=0;i<user_times.length;i++){
    let startmoment = moment(user_times[i].start_time);
    //console.log(`start moment ${startmoment}`);
    //console.log(`prev end moment ${endmoments_arr[i]}`);
    //console.log(`diff ${startmoment.diff(endmoments_arr[i],'minutes',true)}`);
    endmoments_arr[i+1] = moment(user_times[i].end_time);
    if(startmoment.diff(endmoments_arr[i],'minutes',true) >= 30){
      let time = {};
      time.title = `빈시간 ${emptycnt++}`;
      time.start = endmoments_arr[i];
      time.end = startmoment;
      time_arr.push(time);
    }
  };
  let finaltime = {
    title : `빈시간 ${emptycnt++}`,
    start : endmoments_arr[i],
    end : moment(user_times[0].start_time).set({'hour':24, 'minute':0,'second':0})
  }
  time_arr.push(finaltime);
  //console.log(`final time : `+JSON.stringify(time_arr));
  res.send(time_arr);
})

module.exports = router;