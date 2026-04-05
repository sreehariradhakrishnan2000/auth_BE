const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userCheck = await pool.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
    //
  );

  if (userCheck.rows.length > 0) {
    return res.status(400).json({ msg: "User exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    'INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)',
    [name, email, hash, role]
  );

  res.json({ msg: "Registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ msg: "User not found" });
  }

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(400).json({ msg: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token, role: user.role });
};