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

    enum RiskLevel {
        High = "HIGH",
        Medium = "MEDIUM",
        Low = "LOW"
    }

    const attributes = req.body[ACCOUNT_NAME + " Meta"];
    const dataSuplied = req.body[ACCOUNT_NAME + " Data Supplied"];
    const suppliedValue = req.body[ACCOUNT_NAME + " Supplied Value"];
    const socureData = req.body["Socure3"];

    const sigmaFraudScore: number = parseFloat(socureData.find((obj: Scores) => obj.attributeName === "Sigma Fraud Score").attributeValue);
    const otherRiskScore: number = parseInt(attributes.find((obj: Scores) => obj.attributeName === "other_data_risk_score").attributeValue);

    const modelScore: number = sigmaFraudScore * otherRiskScore;

    console.log("ALL DATA:", req);
    console.log("Model Score:", modelScore);
    console.log("Account Meta:", attributes);
    console.log("Account Data Supplied:", dataSuplied);
    console.log("Supplied Value:", suppliedValue);

    let riskLevel: string;

    if (modelScore <= 50) {
        riskLevel = RiskLevel.Low;
    } else if (modelScore >= 90) {
        riskLevel = RiskLevel.High;
    } else {
        riskLevel = RiskLevel.Medium;
    }

    res.json({
        modelScore,
        "modelSuccess": !!modelScore,
        "modelVersion": CURRENT_VERSION,
        "custom": {
            "riskLevel": riskLevel,
            "isRisk": modelScore >= 75
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});