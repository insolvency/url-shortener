import express from "express";
import { env } from "./env";
import type { IStorage } from "./storage/IStorage";
import { MemoryStorage } from "./storage/MemoryStorage";

const app = express();
const urlStorage: IStorage = new MemoryStorage();

app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}.`));
