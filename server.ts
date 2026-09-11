import express from "express";
import { records } from "./data";
import { buildTree } from "./tree";
import type { TreeNode } from "./tree";
import { predict } from "./predict";
import { isValidBurnoutInput } from "./validation";

const app = express();

app.use(express.json());
// כאן נשמור את העץ לאחר האימון
let trainedTree: TreeNode | null = null;

// בדיקה שהשרת חיי
app.get("/api/health", (req: any, res: any) => {
    res.json({ status: "ok" });
});

// אימון = בניית עץ החלטה מתוך נתוני האימון
app.post("/api/train", (req, res) => {
       
        try {
            trainedTree = buildTree(records);

            return res.status(200).json({
                success: true,
                message: "Tree trained successfully",
            });
        } catch (error) {
            console.error("Tree training failed:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to train the tree",
            });
        }
    }); 

app.get("/api/tree", (req, res) => {
    try {
        if (trainedTree === null) {
            return res.status(409).json({
                success: false,
                message: "Tree is null. Please train the tree first.",
            });
        }

        return res.status(200).json({
            success: true,
            tree: trainedTree,
        });
    } catch (error) {
        console.error("Failed to retrieve the tree:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the tree",
        });
    }
});

app.post("/api/predict", (req, res) => {
    try {
        if (trainedTree === null) {
            return res.status(409).json({
                success: false,
                message: "Please train the tree first",
            });
        }
        const input: unknown = req.body;

        if (!isValidBurnoutInput(input)) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
            });
        }

        const prediction = predict(trainedTree, input);

        return res.status(200).json({
            success: true,
            prediction,
        });
    } catch (error) {
        console.error("Prediction failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to predict",
        });
    }
});

// מפעילים את השרת בפורט 3000
app.listen(3000, () => {
    console.log("Server is listening  at http://localhost:3000");
});