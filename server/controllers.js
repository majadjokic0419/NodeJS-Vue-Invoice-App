const conn = require('./db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { registerValidation, loginValidation } = require('./validation');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (payload) => {
    return jwt.sign(payload, 'my secret', {
        expiresIn: maxAge
    })
}

const createNewInvoice = (req, res) => {
    if ((req.body.name.lenght === 0)) {
        return res.json({
            "status": false,
            "message": "Invoice needs a name."
        });
    }
    conn.getConnection((err, connection) => {
        if (err) throw err

        const queryInsertUser = `INSERT INTO invoices(name, user_id, paid) VALUES('${req.body.name}', ${req.body.user_id}, 0)`;
        connection.query(queryInsertUser, (err, rows) => {
            if (err) {
                console.log(err)
            } else {
                const ID = rows.insertId;
                for (let i = 0; i < req.body.txn_names.length; i++) {
                    let txn_name = req.body.txn_names[i];
                    let txn_price = req.body.txn_prices[i];
                    const queryInsertTransactions = `INSERT INTO transactions(name, price, invoice_id) VALUES('${txn_name}','${txn_price}','${ID}')`;
                    connection.query(queryInsertTransactions);
                }
                connection.release()
                return res.json({
                    "status": true,
                    "message": "Invoice created."
                });
            }
        })
    })
};
const allInvoicesForAnUser = (req, res) => {
    conn.getConnection((err, connection) => {
        if (err) throw err
        const _id = req.params.user_id;
        connection.query(`SELECT * from invoices WHERE user_id = ${ _id }`, (err, rows) => {
            connection.release()
            if (!err) {
                return res.json({
                    "status": true,
                    "invoices": rows
                });
            } else {
                console.log(err);
            }
        })
    })
};
const singleInvoiceView = (req, res) => {
    conn.getConnection((err, connection) => {
        if (err) throw err
        const userID = req.params.user_id;
        const invoiceID = req.params.invoice_id;
        const querySingleInvoice = `SELECT * FROM invoices LEFT JOIN transactions ON invoices.id = transactions.invoice_id WHERE user_id = '${userID}'AND invoice_id = '${invoiceID}'ORDER BY transactions.id `;
        connection.query(querySingleInvoice, (err, rows) => {
            connection.release()
            if (!err) {
                return res.json({
                    "status": true,
                    "transactions": rows
                });
            } else {
                console.log(err);
            }
        })
    })
}
const userRegister = (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({
            "status": false,
            "message": error.details[0].message
        });
    }


    conn.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT * from users WHERE email='${req.body.email}' `, (err, rows) => {
            if (err) throw err
            if (!(rows.length === 0))
                return res.status(400).json({
                    "status": false,
                    "message": "Email already in use"
                });

            const insert = async() => {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.password, salt)
                const queryRegister = `INSERT INTO users(name,email,company_name,password) VALUES('${req.body.name}','${req.body.email}','${req.body.company_name}','${hashed}')`;
                connection.query(queryRegister, (err, rows) => {
                    if (err) throw err
                    if (!err) {
                        const user_id = rows.insertId;
                        connection.query(`SELECT * from users WHERE id='${user_id}' `, (err, rows) => {
                            if (err) throw err;
                            const user = {
                                id: rows[0].id,
                                name: rows[0].name,
                                email: rows[0].email,
                                company_name: rows[0].company_name,
                            }

                            delete user.password;
                            const token = createToken(
                                user
                            );
                            res.cookie('jwt', token, {
                                httpOnly: true,
                                maxAge: maxAge * 1000
                            })
                            res.status(200).json({
                                "status": true,
                                "message": "User Created.",
                                "user": user
                            });
                        })
                    } else {
                        console.log(err);
                    }
                })
            }
            insert();
        })
    })
}
const userLogin = (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({
            "status": false,
            "message": error.details[0].message
        });
    }
    conn.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT * from users WHERE email='${req.body.email}' `, (err, rows) => {
            connection.release()
            if (err) throw err
            if (rows.length === 0) return res.status(400).json({
                "status": false,
                "message": "Email or password is wrong"
            });
            let user = {
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                company_name: rows[0].company_name,
                password: rows[0].password,
            }

            const compare = async() => {
                const validPass = await bcrypt.compare(req.body.password, user.password);
                if (validPass) {
                    delete user.password;
                    const token = createToken(
                        user
                    );
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000
                    })
                    return res.status(200).json({
                        "status": true,
                        "user": user
                    });
                } else {
                    return res.status(400).json({
                        "status": false,
                        "message": "Email or password is wrong"
                    });
                }
            }
            compare();
        })
    })
};

module.exports = {
    createNewInvoice,
    allInvoicesForAnUser,
    singleInvoiceView,
    userRegister,
    userLogin,
}