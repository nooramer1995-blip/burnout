import type { BurnoutInput, BurnoutLevel } from "./data";
import type { TreeNode } from "./tree";

export const predict = (
    node: TreeNode,
    input: BurnoutInput
): BurnoutLevel => {
    // אם הגענו לעלה, מחזירים את התחזית שלו
    if (node.type === "leaf") {
        return node.prediction;
    }
    //סוף שבוע,  
    if (node.feature === "weekends") {
        if (input.weekends === true) {
            return predict(node.left, input);
        } else {
            return predict(node.right, input);
        }
    }
    // שאלה מספרית חייבת להכיל סף
    if (node.threshold === null) {
        throw new Error("A numeric question must have a threshold");
    }

    // קוראים מנתוני המשתמש את המאפיין שעליו הצומת שואל
    const value = input[node.feature];

    // קטן או שווה לסף — ממשיכים שמאלה
    if (value <= node.threshold) {
        return predict(node.left, input);
    }

    // גדול מהסף — ממשיכים ימינה
    return predict(node.right, input);
};
