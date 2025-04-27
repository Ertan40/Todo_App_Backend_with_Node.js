import mysql from "mysql2/promise";

const DB_CONFIG = {
  database: "todo_db",
  user: "root",
  password: "rootpassword",
  host: "localhost",
  port: 3306,
};

async function initializeDatabase() {
  let connection;
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    console.log("Connected to the MySQL database");

    await connection.execute(`
        CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(250) UNIQUE,
        password TEXT
        )`);

    connection.execute(`
        CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        ) 
        `);
    return connection;
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
  } finally {
    // Remember to close the connection when done
    if (connection) {
      await connection.end();
    }
  }
}

export default initializeDatabase;

//

// import mysql from "mysql2/promise";

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "rootpassword",
//   database: "todo_db",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export default pool;
// then route handler
// const [insertUserResult] = await pool.execute(
//     "INSERT INTO users(username, password) VALUES (?, ?)",
//     [username, hashedPassword]
//   );
