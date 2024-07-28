
const express = require("express");
const app=express();
import cors from "cors";




import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
app.use(express.json());
app.use(cors())
app.use("/v1/user",userRouter);
app.use("/v1/worker",workerRouter);


app.listen(3000);
