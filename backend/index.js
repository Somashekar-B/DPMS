const express = require('express');

const bodyParser = require('body-parser');

const projectRoutes = require('./routes/projects');

const departmentRoutes = require('./routes/departments');

const userRoutes = require('./routes/users');

const studentRoutes = require('./routes/students');

const errorController = require('./controllers/error');

const path = require('path');

const app = express();

const ports = process.env.PORT || 3000;



// const router = express.Router();
app.use(bodyParser.json());

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Controll-Allow-Method','GET, POST, PUT, OPTIONS,DELETE');
    // res.setHeader('Access-Control-Allow-Header','Content-Type, Authorization')

     // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
})

// app.get('/',function(req,res){
// 	res.send("Example GET");
// });
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use('/projects', projectRoutes);

app.use('/departments', departmentRoutes);

app.use('/users', userRoutes);

app.use('/students', studentRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

app.listen(ports, () => console.log(`listening on port ${ports}`));

