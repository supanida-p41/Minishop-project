const express = require('express')  // ใช้งาน module express
const app = express()  // สร้างตัวแปร app เป็น instance ของ express
const path = require('path') // เรียกใช้งาน path module
const createError = require('http-errors') // เรียกใช้งาน http-errors module
const port = 3000  // port 
  
// ส่วนของการใช้งาน router module ต่างๆ 
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const userApi = require('./api/users')
  
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', {delimiter: '?'});
// app.set('env','production')
  
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
  
// เรียกใช้งาน indexRouter
app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/api', [userApi]) 
 
// ทำงานทุก request ที่เข้ามา 
app.use(function(req, res, next) {
    var err = createError(404)
    next(err)
})
  
// ส่วนจัดการ error
app.use(function (err, req, res, next) {
    // กำหนด response local variables 
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
  
    // กำหนด status และ render หน้า error page
    res.status(err.status || 500) // ถ้ามี status หรือถ้าไม่มีใช้เป็น 500
    res.render('error') 
})
  
app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
})