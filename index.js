const express    = require('express');
const path = require("path");
const morgan = require("morgan");
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const app = express();

// configuration =========================

//view engine setting
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

//logging setting
if(process.env.NODE_ENV === "production") {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
//port setting | default 3000
app.set('port', process.env.PORT || 3000);

//routing setting
app.use('/',require('./routes'));
app.use('/user',require('./routes/user'));

//static file serving
app.use(express.static(path.join(__dirname,"public")));

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

/*
app.get('/user', (req, res) => {
    connection.query('SELECT * from user', (error, rows) => {
        if (error) throw error;
        console.log('User info is: ', rows);
        res.send(rows);
    });
});
*/

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});