const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Pranav@28',
  database: 'taskmanagement'
};

async function insertAdmin() {
  let connection;
  try {
    
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL');

    
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    
    const sql = 'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)';
    const values = ['Admin', 'admin@gmail.com', hashedPassword, 1];

    
    const [result] = await connection.execute(sql, values);
    console.log('Admin inserted with ID:', result.insertId);
  } catch (error) {
    console.error('Error inserting admin:', error);
  } finally {
    if (connection) await connection.end(); 
  }
}


insertAdmin();