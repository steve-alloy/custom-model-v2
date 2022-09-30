import express, { Application, Request, Response} from "express";
import dotenv from "dotenv";
import { Scores } from "./types/index";

dotenv.config();

const CURRENT_VERSION = 3;
const ACCOUNT_NAME = "Steve G. Test Account";

const port: string | number = process.env.PORT || 3000;

const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/", (req: Request, res: Response) => {
    console.log(req);
    const attributes = req.body[ACCOUNT_NAME + " Meta"];
    const dataSuplied = req.body[ACCOUNT_NAME + " Data Supplied"];
    const suppliedValue = req.body[ACCOUNT_NAME + " Supplied Value"];
    const socureData = req.body["Socure3"];

    const sigmaFraudScore: number = parseInt(socureData.find((obj: Scores) => obj.attributeName === "Sigma Fraud Score").attributeValue);
    const otherRiskScore: number = parseInt(attributes.find((obj: Scores) => obj.attributeName === "other_data_risk_score").attributeValue);

    const modelScore: number = sigmaFraudScore * otherRiskScore;

    console.log("Sigma Fraud:", sigmaFraudScore);
    console.log("Other:", otherRiskScore);
    console.log("Model Score:", modelScore);
    console.log("Account Data Supplied:", dataSuplied);
    console.log("Supplied Value:", suppliedValue);


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