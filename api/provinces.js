const express = require('express')
const router = express.Router()
const { validation, schema } = require('../validator/provinces')
const db = require('../config/db')
 
router.route('/provinces?')
    .get((req, res, next) => { 
        // เราจะดึงข้อมูลท้งหมดตามเงื่อนไขแบ่งหน้า กับดึงข้อมูลจำนวนรายการทั้งหมด ในฟิลด์ total 
        let sql = ' SELECT a.*, (SELECT COUNT(b.province_id) FROM tbl_provinces b) AS total FROM tbl_provinces a '
        let per_page = 10  // กำหนดรายการที่จะแสดงในแต่ละหน้า
        let page = 1  // หน้าแรก
        let offset = 0 // เริ่มแสดงที่ offset 
        let total = 0 // จำนวนรายการถั้งหมด
        if(req.query.page){ // ถ้ามีการแสดงหน้าที่จะแสดงเข้ามา เช่น ?page=1
            page = req.query.page  // หน้า ที่จะแสดง
            offset = (page-1) * per_page  // กำหนด offset เริ่มต้นกรณีแบ่งหน้า
            sql += ' LIMIT '+ offset +','+ per_page +' ' // ต่อคำสั่ง sql เพิ่มการแบ่งหน้า
        }
        db.query(sql,(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            total = results.length  // ถ้าไม่มีการแบ่งหน้า จำนวนทั้งหมด จะนับจากจำนวนของรายการ
            // ถ้ามีการแบ่งหน้า จำนวนทั้งหมดจะใช้จากค่าฟิลด์ total ที่เราคิวรี่เริ่มด้ววคำสั่ง COUNT()
            if(req.query.page && total>0) total = results[0].total 
            // รูปแบบข้อมูลที่ส่งกลับ กรณีรองรับการแบ่างหน้า
            const result = {
                "status": 200,
                "total":total,  // จำนวนรายการทั้งหมด
                "current_page":page, // หน้าที่กำลังแสดงอยู่
                "total_page":Math.ceil(total/per_page), // จำนวนหน้าทั้งหมด
                "data": results  // รายการข้อมูล
            }
            return res.json(result)        
        })
    })
    .post(validation(schema),(req, res, next) => {   
        let province = {
            "province_name": req.body.province_name, 
            "province_name_eng": req.body.province_name_eng 
        }
        let sql = ' INSERT INTO tbl_provinces SET ? '
        db.query(sql, province, (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            province = [{'province_id':results.insertId, ...province}]
            const result = {
                "status": 200,
                "data": province
            }
            return res.json(result)        
        })
    })
 
router.route('/province/:id')
    .all((req, res, next) => { 
        let sql = ' SELECT * FROM tbl_provinces WHERE province_id = ? '
        db.query(sql, [req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            }) 
            res.province = results 
            next()  
        })        
    })
    .get((req, res, next) => { 
        const result = {
            "status": 200,
            "data": res.province
        }
        return res.json(result)
    })
    .put(validation(schema),(req, res, next) => {   
        let province = {
            "province_name": req.body.province_name, 
            "province_name_eng": req.body.province_name_eng 
        }        
        let sql = ' UPDATE tbl_provinces SET ? WHERE province_id = ? '
        db.query(sql, [province, req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            if(results.affectedRows > 0) {
                province = Object.assign(res.province[0], province)
            }else{
                province = res.province
            }
            const result = {
                "status": 200,
                "data": province
            }
            return res.json(result)        
        })
    })
    .delete((req, res, next) => { 
        let sql = ' DELETE FROM tbl_provinces WHERE province_id = ? '
        db.query(sql, [req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            const result = {
                "status": 200,
                "data": res.province
            }
            return res.json(result)        
        })
    })
 
module.exports = router