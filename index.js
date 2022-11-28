const express    = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const morgan = require("morgan");
const models = require('./models');

const app = express();

// configuration =========================

//view engine setting
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);


//middlewares
if(process.env.NODE_ENV === "production") {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());

//port setting | default 3000
app.set('port', process.env.PORT || 3000);

//routing setting
app.use('/',require('./routes'));
app.use('/user',require('./routes/user'));

//static file serving
app.use('/',express.static(path.join(__dirname,"public")));

//error handling
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (err.status == 404) {
      res.send('Page Not Found');
  } else {
      res.send(`Uncaught error ${err.status}`);
  }
});

models.sequelize.sync({force:false}) //true로 설정시 db모두 삭제후 재생성
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log('Express server listening on port ' + app.get('port'));
    });
  })
  .catch(err => {
    console.log("DB connection failed: " + err);
  })