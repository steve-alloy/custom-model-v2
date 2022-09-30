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
    const socureData = req.body["Socure3"]

    const sigmaFraudScore: number = parseInt(socureData.filter(data => data.attributeName === "Sigma Fraud Score")[0].attributeValue);

    const otherRiskScore: number = parseInt(attributes.filter(data => data.attributeName === "other_data_risk_score")[0].attributeValue);

    console.log(req);
    const modelScore: number = sigmaFraudScore * otherRiskScore;
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