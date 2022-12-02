const express = require('express');
const router = express.Router();
const models = require('../../models');
const auth = require('../auth');

router.get('/', auth, (req,res,next)=>{
  res.render('user/schedule.html');
});

// GET schedule's details (Might later be used)
// router.get('/:schedule_id', async(req, res)=>{
//     var params = req.params;
//     const schedule = await models.Schedule.findOne({where: {schedule_id: params.schedule_id }});
//     if (!schedule)  return res.status(404).send({description:"no schedules are found."});
//    
//     return res.status(201).json(schedule.toJSON());
//
// });

module.exports = router;