import express from'express'

// initialize express app
const app = express();
// configure port
export const port = process.env.PORT || 3000;


// export initialized express app
export default app;