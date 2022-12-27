const mysql = require('mysql') // เรียกใช้งาน MySQL module
 
// กำหนดการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'testdb'
  })
 
// ทำการเชื่อมต่อกับฐานข้อมูล 
db.connect((err) =>{
    if(err){ // กรณีเกิด error
        console.error('error connecting: ' + err.stack)
        return
    }
    console.log('connected as id ' + db.threadId)
})
// ปิดการเชื่อมต่อฐานข้อมูล MySQL ในที่นี้เราจะไม่ให้ทำงาน
// db.end() 
module.exports = db

let sql = ' SELECT * FROM tbl_users '
db.query(sql,(error, results, fields)=>{
    if(error) {
        throw error
    }   
    res.json(results)
})