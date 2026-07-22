const express = require("express");

const cors = require("cors");

const mysql = require("mysql2");

const multer = require("multer");

const path = require("path");

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const PORT = 3000;
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Vinag@08",
    database: "sap_audit_portal"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
        return;
    }

    console.log("MySQL Connected Successfully");
});
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT *
        FROM users
        WHERE username = ?
        AND password = ?
    `;

    db.query(
        sql,
        [username, password],
        (err, result) => {

            if(err){
                return res.status(500).json({
                    success:false,
                    message:"Database Error"
                });
            }

            if(result.length > 0){

                res.json({
                    success:true,
                    role: result[0].role,
                    message:"Login Successful"
                });

            } else {

                res.json({
                    success:false,
                    message:"Invalid Credentials"
                });

            }

        }
    );

});
app.post("/create-cr", upload.single("brdFile"), (req, res) => {

    const {
        title,
        module,
        priority,
        brd,
        description
    } = req.body;

    const brdFile =
    req.file ? req.file.filename : null;

    // ---------------- AI Risk Assessment ----------------

let evaluationFactors = [];

let risk = "Low";
let aiRiskScore = 18;

// Priority based assessment
if (priority === "Critical") {

    risk = "High";
    aiRiskScore = 92;
    evaluationFactors.push("Critical Business Priority");

}
else if (priority === "High") {

    risk = "Medium";
    aiRiskScore = 63;
    evaluationFactors.push("High Business Priority");

}
else {

    risk = "Low";
    aiRiskScore = 18;
    evaluationFactors.push("Standard Business Priority");

}

// Module impact
if (module === "SAP FI") {

    evaluationFactors.push("Finance Module Impact");

}
else if (module === "SAP SD") {

    evaluationFactors.push("Sales & Distribution Module");

}
else {

    evaluationFactors.push(module + " Module");

}

// AI Recommendation
let aiRecommendation = "Auto Recommended";

if (risk === "High") {

    aiRecommendation = "CAB Review Required";

}
else if (risk === "Medium") {

    aiRecommendation = "Manager Review Recommended";

}
else {

    aiRecommendation = "Auto Recommended";

}

// --------------------------------------

const crId = "CR-" + Date.now();
    const duplicateSql = `
    SELECT *
    FROM change_requests
    WHERE title = ?
    `;

    const sql = `
        INSERT INTO change_requests
        (
    cr_id,
    title,
    module,
    priority,
    risk,
    aiRiskScore,
    aiRecommendation,
    status,
    requester,
    brd_file,
    duplicateDetected,
    duplicateProbability,
    similarCR,
    createdDate
)
VALUES
(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    db.query(
    duplicateSql,
    [title],
    (dupErr, dupResults) => {

        let duplicateDetected = "No";
        let duplicateProbability = 0;
        let similarCR = null;

        if (dupResults.length > 0) {

            duplicateDetected = "Yes";
            duplicateProbability = 92;
            similarCR = dupResults[0].cr_id;

            evaluationFactors.push("Similar Change Request Detected");

        }
        console.log("Saving aiRiskScore =", aiRiskScore);
        console.log("Saving risk =", risk);
        db.query(
            sql,
            [
                crId,
                title,
                module,
                priority,
                risk,
                aiRiskScore,
                aiRecommendation,
                "Pending",
                "Requester",
                brdFile,
                duplicateDetected,
                duplicateProbability,
                similarCR
            ],
            (err, result) => {

                if(err){

                    console.log(err);

                    return res.json({
                        message:
                        "Failed to create CR"
                    });

                }

                const auditSql = `
                INSERT INTO audit_logs
                (
                    cr_id,
                    user_name,
                    role,
                    action_taken,
                    remarks,
                    log_time
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    NOW()
                )
                `;

                db.query(
                    auditSql,
                    [
                        crId,
                        "Requester",
                        "Requester",
                        "CR Created",
                        "New Change Request Submitted"
                    ]
                );

                res.json({

                    message: "CR Created Successfully",

                    duplicateDetected: duplicateDetected,

                    duplicateProbability: duplicateProbability,

                    similarCR: similarCR

                });

            }
        );

    }
);
});
app.get("/crs", (req, res) => {

    const sql = `
    SELECT *
    FROM change_requests
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.json([]);
        }

        res.json(results);

    });

});
app.get("/", (req, res) => {

    const crSql =
    "SELECT * FROM change_requests";

    const auditSql =
    "SELECT * FROM audit_logs ORDER BY log_time DESC";

    db.query(crSql, (err, crs) => {

        if(err){
            console.log(err);
            return res.json({
                crs:[],
                auditLogs:[]
            });
        }

        db.query(auditSql, (err, auditLogs) => {

            if(err){
                console.log(err);
                return res.json({
                    crs,
                    auditLogs:[]
                });
            }

            res.json({
                crs,
                auditLogs
            });

        });

    });

});
app.get("/search-cr", (req, res) => {

    const title = req.query.title;

    if(!title || title.trim() === ""){

        return res.json([]);

    }

    const sql = `
    SELECT
        cr_id,
        title
    FROM change_requests
    WHERE LOWER(title) LIKE LOWER(?)
    LIMIT 5
    `;

    db.query(
        sql,
        [`%${title}%`],
        (err, results) => {

            if(err){

                console.log(err);

                return res.json([]);

            }

            res.json(results);

        }
    );

});
app.post("/login",(req,res)=>{

    const { username,password } = req.body;

    const sql =
    "SELECT * FROM users WHERE username=? AND password=?";

    db.query(
        sql,
        [username,password],
        (err,result)=>{

            if(err){

                return res.json({
                    success:false
                });
            }

            if(result.length===0){

                return res.json({
                    success:false
                });
            }

            res.json({
                success:true,
                role:result[0].role
            });

        }
    );

});
app.post("/update-analysis", (req, res) => {

    const { crId, priority, risk } = req.body;

    const sql = `
        UPDATE change_requests
        SET
            priority = ?,
            risk = ?,
            consultant = 'SAP AMS Team',
            status = 'Manager Approval Pending'
        WHERE id = ?
    `;

    db.query(
        sql,
        [priority, risk, crId],
        (err, result) => {

            if(err){
                console.log(err);

                return res.json({
                    success:false,
                    message:"Database Update Failed"
                });
            }

            const auditSql = `
            INSERT INTO audit_logs
            (
                cr_id,
                user_name,
                role,
                action_taken,
                remarks,
                log_time
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                NOW()
            )
            `;

            db.query(
                auditSql,
                [
                    crId,
                    "SAP AMS Team",
                    "AMS",
                    "Analysis Completed",
                    "Forwarded To Manager"
                ]
            );

            res.json({
                success:true,
                message:"Analysis Saved Successfully"
            });

        }
    );

});
app.post("/manager-approve", (req, res) => {

    const { crId } = req.body;

    const sql = `
        UPDATE change_requests
        SET
            managerApproval = 'Approved',
            status = 'CAB Approval Pending'
        WHERE id = ?
    `;

    db.query(
        sql,
        [crId],
        (err, result) => {

            if(err){
                console.log(err);

                return res.json({
                    success:false,
                    message:"Approval Failed"
                });
            }
            const auditSql = `
            INSERT INTO audit_logs
            (
                cr_id,
                user_name,
                role,
                action_taken,
                remarks,
                log_time
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                NOW()
            )
            `;

            db.query(
                auditSql,
                [
                    crId,
                    "Manager",
                    "Manager",
                    "CR Approved",
                    "Forwarded To CAB"
                ]
            );

            res.json({
                success:true,
                message:"CR Approved Successfully"
            });

        }
    );

});
app.post("/manager-reject", (req, res) => {

    const { crId } = req.body;

    const sql = `
        UPDATE change_requests
        SET
            managerApproval = 'Rejected',
            status = 'Rejected'
        WHERE id = ?
    `;

    db.query(
        sql,
        [crId],
        (err, result) => {

            if(err){
                console.log(err);

                return res.json({
                    success:false,
                    message:"Rejection Failed"
                });
            }

            res.json({
                success:true,
                message:"CR Rejected"
            });

        }
    );

});
app.get("/cab-crs", (req, res) => {

    const sql = `
        SELECT *
        FROM change_requests
        WHERE status = 'CAB Approval Pending'
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.json([]);
        }

        res.json(results);

    });

});
app.post("/cab-approve", (req, res) => {

    const { crId } = req.body;

    const sql = `
        UPDATE change_requests
        SET
            cabApproval = 'Approved',
            status = 'Testing Pending'
        WHERE id = ?
    `;

    db.query(
        sql,
        [crId],
        (err, result) => {

            if(err){

                console.log(err);

                return res.json({
                    success:false,
                    message:"Update Failed"
                });
            }
            const auditSql = `
            INSERT INTO audit_logs
            (
                cr_id,
                user_name,
                role,
                action_taken,
                remarks,
                log_time
            )
            VALUES
            (
                ?,
                'CAB',
                'CAB',
                'CAB Approved',
                'Forwarded To Testing',
                NOW()
            )
            `;

            db.query(
                auditSql,
                [crId]
            );

            res.json({
                success:true,
                message:"CAB Approved Successfully"
            });

        }
    );

});
app.post("/cab-reject",(req,res)=>{

    const { crId } = req.body;

    const sql = `
    UPDATE change_requests
    SET
        cabApproval='Rejected',
        status='Rejected By CAB'
    WHERE cr_id=?
    `;

    db.query(
        sql,
        [crId],
        (err,result)=>{

            if(err){

                console.log(err);

                return res.json({
                    success:false,
                    message:"Database Error"
                });
            }

            res.json({
                success:true,
                message:"CAB Rejected Successfully"
            });

        }
    );

});
app.get("/testing-crs", (req, res) => {

    const sql = `
        SELECT *
        FROM change_requests
        WHERE status = 'Testing Pending'
    `;

    db.query(sql, (err, results) => {

        if(err){
            console.log(err);
            return res.json([]);
        }

        res.json(results);

    });

});
app.post("/testing-pass", (req, res) => {

    const { crId } = req.body;

    const sql = `
        UPDATE change_requests
        SET
            testingStatus = 'Passed',
            status = 'Production Pending'
        WHERE id = ?
    `;

    db.query(
        sql,
        [crId],
        (err, result) => {

            if(err){

                console.log(err);

                return res.json({
                    success:false,
                    message:"Update Failed"
                });

            }

            const auditSql = `
            INSERT INTO audit_logs
            (
                cr_id,
                user_name,
                role,
                action_taken,
                remarks,
                log_time
            )
            VALUES
            ( 
                ?,
                'Testing Team',
                'Testing',
                'Testing Passed',
                'Forwarded To Production',
                NOW()
            )
            `;

            db.query(
                auditSql,
                [crId]
            );

            res.json({
                success:true,
                message:"Testing Passed Successfully"
            });

        }
    );

});
app.post("/testing-fail", (req, res) => {

    const { crId } = req.body;

    const sql = `
    UPDATE change_requests
    SET
        status = 'Pending',
        testingStatus = 'Failed'
    WHERE id = ?
    `;

    db.query(sql, [crId], (err) => {

        if(err){
            console.log(err);
            return res.json({
                message: "Failed to update CR"
            });
        }

        const auditSql = `
        INSERT INTO audit_logs
        (
            cr_id,
            user_name,
            role,
            action_taken,
            remarks,
            log_time
        )
        SELECT
            cr_id,
            'Testing Team',
            'Testing',
            'Testing Failed',
            'Returned to AMS for rework',
            NOW()
        FROM change_requests
        WHERE id = ?
        `;

        db.query(auditSql, [crId]);

        res.json({
            message: "CR returned to AMS successfully."
        });

    });

});
app.get("/production-crs", (req, res) => {

    const sql = `
        SELECT *
        FROM change_requests
        WHERE status = 'Production Pending'
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.json([]);
        }

        res.json(results);

    });

});
app.post("/deploy-cr", (req, res) => {

    const { crId } = req.body;

    const sql = `
        UPDATE change_requests
        SET
            deploymentStatus = 'Released',
            status = 'Completed'
        WHERE cr_id = ?
    `;

    db.query(
        sql,
        [crId],
        (err, result) => {

            if(err){

                console.log(err);

                return res.json({
                    success:false,
                    message:"Deployment Failed"
                });
            }

            const auditSql = `
            INSERT INTO audit_logs
            (
                cr_id,
                user_name,
                role,
                action_taken,
                remarks,
                log_time
            )
            VALUES
            (
                ?,
                'Production Team',
                'Production',
                'CR Deployed',
                'Released To Production',
                NOW()
            )
            `;

            db.query(
                auditSql,
                [crId]
            );

            res.json({
                success:true,
                message:"CR Deployed Successfully"
            });

        }
    );

});
app.get("/audit-logs", (req, res) => {

    const sql = `
    SELECT *
    FROM audit_logs
    ORDER BY log_time DESC
    `;

    db.query(sql, (err, results) => {

        if(err){
            console.log(err);
            return res.json([]);
        }

        res.json(results);

    });

});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});