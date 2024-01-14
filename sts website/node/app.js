const express = require('express');
const bodyparser = require('body-parser')
const date = require('date-and-time')
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

dotenv.config({ path: __dirname + '\\config.env' })

const app = express();
const port = process.env.PORT;

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())


app.use(express.static('..'));
app.set('view engine', 'pug');

var options = {
  host: process.env.DATABASE_HOST,
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'sts team 404',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    res.render('login', { error: 'Please Login To Move Forward' })
  }
}

const isAuth1 = (req, res, next) => {
  if (req.session.isAuth) {
    res.render('search');
  } else {
    res.render('search1')
  }
}

// serving server pages

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/content', function (req, res) {

  res.render('content');
});

app.get('/contact_us', function (req, res) {

  res.render('contact_us');
});

app.get('/about_us', function (req, res) {

  res.render('about_us');
});

app.get('/search', isAuth1, function (req, res) {

  res.status(200);
});


app.get('/signup', function (req, res) {

  res.render('signup');
});

app.get('/login', function (req, res) {

  res.render('login');
});

app.get('/data_fillup', isAuth, function (req, res) {

  res.render('data_fillup');
});



// end of serving pages


// getting data from frontend to backend




app.post('/submit1',function (req, res) {
  var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  });

  connection.connect(function (error) {
    if (error) throw error;
    console.log('connected..')
  });

  connection.query("select * from students where STDphonenumber = " + req.body.phone + " OR STDemail = '" + req.body.email +"'", function (err, result) {
    if (err) throw err;
    if (result[0] != null) {
      res.render('data_fillup', { message: 'Phone Number Or Email ALready Linked With a Profile.' })
    } else {
      var connection1 = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
      });

      connection1.connect(function (error) {
        if (error) throw error;
        console.log('connected..')
      });
      connection1.query("insert into students (`STDid`,`STDname`,`STDfathername`,`STDmothername`,`STDgender`,`STDdob`,`STDemail`,`STDphonenumber`,`STDstate`,`STDcity`,`STDpincode`,`STDAddress`,`STDinstitutename`,`STDbranch`,`STDcurrentyear`,`STDlastexamname`,`STDresult`,`STDtraining`,`STDintership`,`STDfellowship`,`STDgrants`,`STDannualincome`) values (null,'" + req.body.name + "','" + req.body.fathername + "','" + req.body.mothername + "','" + req.body.gender + "','" + req.body.dob + "','" + req.body.email + "','" + req.body.phone + "','" + req.body.state + "','" + req.body.city + "'," + req.body.pincode + ",'" + req.body.address + "','" + req.body.instituteid + "','" + req.body.branch + "','" + req.body.currentyear + "','" + req.body.lastexam + "'," + req.body.examresult + ",'" + req.body.currenttrainings + "','" + req.body.currentinternship + "','" + req.body.currentfellowship + "','" + req.body.currentgrants + "','" + req.body.annualincome + "')", function (err) {
        if (err) throw err;
      })

      connection1.query("select * from students where STDphonenumber = '" + req.body.phone + "'", function (err, result) {
        if (err) throw err;
        res.status(200);
        res.render('data_fillup', { message: 'Data Saved Successfully With Student ID : ' + result[0].STDid + '.' })
      })
      connection1.end();
    }
  })
  connection.end();
})

//end getting data from frontend to backend



//getting data from backend to frontend

app.post('/request', function (req, res) {
  var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });

  connection.connect(function (error) {
    if (error) throw error;
    console.log('connected..')
  });
  var STDid = req.body.id;

  if (STDid == "" || STDid.length > 12) {
    res.render('search', { error: 'INVALID INPUT' })
    return false;
  } else {
    var sql = "SELECT * FROM students where STDid = " + STDid + " "

    connection.query(sql, function (err, result, fields) {
      if (err) throw err;

      if (result[0] == null) {
        res.status(404)
        res.render('search', { error: 'NO DATA FOUND LINKED WITH STUDENT ID ' + STDid + '' })
      } else {
        const value = date.format(result[0].STDdob,'DD/MM/YYYY');
        res.status(200)
        res.render('search', {
          error: '',
          data1: result[0].STDid,
          data2: result[0].STDname,
          data3: result[0].STDfathername,
          data4: result[0].STDmothername,
          data5: result[0].STDgender,
          data6: value,
          data7: result[0].STDemail,
          data8: result[0].STDphonenumber,
          data9: result[0].STDstate,
          data10: result[0].STDcity,
          data11: result[0].STDpincode,
          data12: result[0].STDAddress,
          data13: result[0].STDinstitutename,
          data14: result[0].STDbranch,
          data15: result[0].STDcurrentyear,
          data16: result[0].STDlastexamname,
          data17: result[0].STDresult,
          data18: result[0].STDtraining,
          data19: result[0].STDintership,
          data20: result[0].STDfellowship,
          data21: result[0].STDgrants,
          data22: result[0].STDannualincome
        });
      }
    })
  }
  connection.end();
})


app.post('/request1', function (req, res) {
  var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });

  connection.connect(function (error) {
    if (error) throw error;
    console.log('connected..')
  });
  var STDid = req.body.id;

  if (STDid == "" || STDid.length > 12) {
    res.render('search1', { error: 'INVALID INPUT' })
    return false;
  } else {
    var sql = "SELECT * FROM students where STDid = " + STDid + " "

    connection.query(sql, function (err, result, fields) {
      if (err) throw err;

      if (result[0] == null) {
        res.status(404)
        res.render('search1', { error: 'NO DATA FOUND LINKED WITH STUDENT ID ' + STDid + '' })
      } else {
        const value = date.format(result[0].STDdob,'DD/MM/YYYY');
        res.status(200)
        res.render('search1', {
          error: '',
          data1: result[0].STDid,
          data2: result[0].STDname,
          data3: result[0].STDgender,
          data4: value,
          data5: result[0].STDinstitutename,
          data6: result[0].STDbranch,
        });
      }
    })
  }
  connection.end();
})
// end getting data from backend to frontend

//signup portal

app.post('/user_signup', (req, res) => {
  var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  });

  connection.connect(function (error) {
    if (error) throw error;
    console.log('connected..')
  });

  if (req.body.password != req.body.cpassword) {
    res.status(406);
    res.render('signup', { message: 'Password Does Not Match' })
  } else {
    connection.query("select * from users where username = '" + req.body.username + "'", function (err, result) {
      if (err) throw err;
      if (result[0] != null) {
        res.render('signup', { message: 'UserName Already Taken' })
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) throw err;
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) throw err;
            var connection1 = mysql.createConnection({
              host: process.env.DATABASE_HOST,
              user: process.env.DATABASE_USER,
              password: process.env.DATABASE_PASSWORD,
              database: process.env.DATABASE
            });

            connection1.connect(function (error) {
              if (error) throw error;
              console.log('connected..')
            });

            connection1.query("insert into users (`firstname`,`lastname`,`username`,`uname`,`uid`,`email`,`password`,`cpassword`,`doe`,`ctype`) values ('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.username + "','" + req.body.uname + "'," + req.body.uid + ",'" + req.body.email + "','" + hash + "','" + hash + "','" + req.body.doe + "','" + req.body.ctype + "')", function (err) {
              if (err) throw err;
              res.redirect('login');
            })

            connection1.end();
          });
        });
      }
    })
  }
  connection.end();
})


//end signup portal


// login portal


app.post('/login', function (req, res) {
  var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  });

  connection.connect(function (error) {
    if (error) throw error;
    console.log('connected..')
  });

  connection.query("select * from users where username = '" + req.body.username + "'", function (err, result) {
    if (err) throw err;
    if (result[0] != null) {
      hash = result[0].cpassword;
      uname = result[0].username;
      bcrypt.compare(req.body.password, hash, function (err, result) {  // Compare
        // if passwords match
        if (result) {
          req.session.isAuth = true;
          res.redirect('/');
        }
        // if passwords do not match
        else {
          res.render('login', { error: 'Username Or Password Incorrect' })
        }
      });

    } else {
      res.render('login', { error: 'No User found Please Signup' })
    }
  })
});


// end of login portal


// logout portal

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/');
  })
});

// end of logout portal



app.listen(port);
console.log('Server started at http://localhost:' + port);

