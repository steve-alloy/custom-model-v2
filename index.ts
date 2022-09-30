import express, { Application, Request, Response} from "express";
import dotenv from "dotenv";
import { Scores } from "./types/index";

dotenv.config();

const CURRENT_VERSION = 3;
const ACCOUNT_NAME = "Steve G. Test Account Meta";

const port: string | number = process.env.PORT || 3000;

const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/", (req: Request, res: Response) => {
    console.log(req);
    const attributes = req.body[ACCOUNT_NAME];
    const socureData = req.body["Socure3"];

    const sigmaFraudScore: number = parseInt(socureData.find((obj: Scores) => obj.attributeName === "Sigma Fraud Score").attributeValue);
    const otherRiskScore: number = parseInt(attributes.find((obj: Scores) => obj.attributeName === "other_data_risk_score").attributeValue);

    const modelScore: number = sigmaFraudScore * otherRiskScore;

    res.json({
        modelScore,
        "modelSuccess": !!modelScore,
        "modelVersion": CURRENT_VERSION,
        "custom": {
            "riskLevel": "HIGH",
            "isRisk": true
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});