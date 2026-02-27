import path from'path'
import express from'express'

// initialize express app
const app = express();
// configure port
export const port = process.env.PORT || 3000;

// configure ejs
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

// export initialized express app
export default app;