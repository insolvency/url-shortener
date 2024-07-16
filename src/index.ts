import express from "express";
import { env } from "./env";

const app = express();

app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}.`));
