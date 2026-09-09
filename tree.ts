import type { BurnoutLevel, BurnoutRecord } from "./data";
import { findBestQuestion } from "./split";

// הגדרת עלה נקודת סיום בקוד 
type LeafNode = {
    type: "leaf";
    prediction: BurnoutLevel;
    samples: number;
};

type QuestionNode = {
    type: "question";
    feature: "sleep" | "meetings" | "stress" | "weekends";
    threshold: number | null;// סופש הסף יהיה NULL 
    samples: number;
    left: TreeNode;
    right: TreeNode;
};

export type TreeNode = LeafNode | QuestionNode;//כל ענף יכול להסתיים בתוצאה או להמשיך לשאלה נוספת.

// פומקצית בניית העץ תהיה ריקורסיבית אנחנו כל פעם נקטין את הערבוב עד שנגיע לעלה 
export const buildTree = (records: BurnoutRecord[]): TreeNode => {
        // אי אפשר לבנות עץ ללא נתוני אימון
        if (records.length === 0) {
            throw new Error("Cannot build a tree without training records");
        }

    // לוקחים את התוצאה של הרשומה הראשונה
    const firstOutcome = records[0].outcome;

    // בודקים אם לכל הרשומות יש אותה תוצאה
    const simllerOutComes = records.every(
        record => record.outcome === firstOutcome
    );

    // אם כן, אין צורך בשאלה נוספת — מחזירים עלה
    if (simllerOutComes) {
        return {
            type: "leaf",
            prediction: firstOutcome,
            samples: records.length,
        };
    }
    // מוצאים את השאלה הטובה ביותר לרשומות בקבוצה הנוכחית
    const bestQuestion = findBestQuestion(records);
    
    // אם אין שאלה מועילה, יוצרים עלה עם התוצאה הנפוצה
    if (
        bestQuestion.bestFeature === null ||
        bestQuestion.bestGain === 0
    ) {
        return {
            type: "leaf",
            prediction: getMostCommonOutcome(records),
            samples: records.length,
        };
    }

    const feature = bestQuestion.bestFeature;
    const threshold = bestQuestion.bestThreshold;

    let leftGroup: BurnoutRecord[];
    let rightGroup: BurnoutRecord[];

    // שאלה מובלה שהיא לאמ ספרית
    if (feature === "weekends") {
        leftGroup = records.filter(record => record.weekends === true);
        rightGroup = records.filter(record => record.weekends === false);
    } else {
        // לשאלה מספרית חייב להיות סף
        if (threshold === null) {
            throw new Error("A numeric question must have a threshold");
        }

        leftGroup = records.filter(record => record[feature] <= threshold);
        rightGroup = records.filter(record => record[feature] > threshold);
    }
    // בונים עץ מהקבוצה השמאלית
    const leftTree = buildTree(leftGroup);

    // בונים עץ מהקבוצה הימנית
    const rightTree = buildTree(rightGroup);

    // מחברים את שני העצים לשאלה הנוכחית
    const questionNode: QuestionNode = {
        type: "question",
        feature: feature,
        threshold: threshold,
        samples: records.length,
        left: leftTree,
        right: rightTree,
    };

    // מחזירים את הצומת עם שני הענפים שלו
    return questionNode;
    };
    

    const getMostCommonOutcome = (
    records: BurnoutRecord[]
): BurnoutLevel => {
    const counts: Partial<Record<BurnoutLevel, number>> = {};// אפשר להתחיל בלי לאתחל כל הפרמטרים

    let mostCommon = records[0].outcome;
    let highestCount = 0;

    for (const record of records) {
        const outcome = record.outcome;
        const count = (counts[outcome] ?? 0) + 1;

        counts[outcome] = count;

        if (count > highestCount) {
            highestCount = count;
            mostCommon = outcome;
        }
    }

    return mostCommon;
};
