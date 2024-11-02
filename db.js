var pg = require ('pg')

const config={
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_DATABASE,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
}



const client= new pg.Pool(config)

if(client)
{
    console.log('******************************')
    console.log('*** db postgres connected ***')
    console.log('******************************')
    // console.log(client)
}

module.exports= client