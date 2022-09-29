import express, { Application, Request, Response} from "express";
import dotenv from "dotenv";
import { Scores } from "./types/index";

dotenv.config();

const CURRENT_VERSION = 2;
const ACCOUNT_NAME = "Steve G. Test Account Meta";

const port: string | number = process.env.PORT || 3000;

const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/", (req: Request, res: Response) => {
    const attributes = req.body[ACCOUNT_NAME];
    console.log(attributes);
    // //Note to make this more programmatic
    // const sentilinkScore: number = parseInt(attributes.find((obj: Scores) => obj.attributeName === "sentilink").attributeValue);
    // const socureScore: number = parseInt(attributes.find((obj: Scores) => obj.attributeName === "socure_risk_score").attributeValue);

    // const modelScore: number = sentilinkScore + socureScore;
    const modelScore = 200;
    console.log(`Model score is: ${modelScore}!`);

    res.json({
        modelScore,
        "modelSuccess": !!modelScore,
        "modelVersion": CURRENT_VERSION
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});