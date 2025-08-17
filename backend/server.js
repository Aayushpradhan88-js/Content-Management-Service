import dotenv from 'dotenv';
dotenv.config();


import { app } from "./src/app.js"
import { dbConnection } from "./src/db/db.js"

dbConnection()

app.listen(process.env.PORT || 3000, () => {
  console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
})
