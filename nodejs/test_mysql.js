var test_mysql = require('mysql');
function main()
{
    let conn;
    try
    {
        conn = test_mysql.createConnection(
            {
                host: 'database-1.cqo5ojqkxxxt.ap-northeast-2.rds.amazonaws.com',
                user: 'root',
                password: 'tmzpwbffj',
                database: 'schedule',
                allowPublicKeyRetrieval:true
            }
        );
        create_table(conn);
    }
    catch(err)
    {
        console.log(err);
    }

}
function create_table(conn) {

    conn.query("CREATE TABLE IF NOT EXISTS schedule.user (" +
        "  id INT PRIMARY KEY AUTO_INCREMENT," +
        "  username VARCHAR(25)," +
        "  password VARCHAR(120)" +
        ") ENGINE=InnoDB", (err,res,meta) => {
        if (err) throw err;
        console.log(res);
        console.log(meta);
        conn.end(error => {if(error){
            console.log("SQL error in closing a connection: ", error);
        }});
    });
}
main();

