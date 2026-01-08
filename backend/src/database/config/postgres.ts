import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL as string;
const sql = postgres(connectionString, { max: 1 })

export default sql;  