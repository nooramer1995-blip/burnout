import { calculateInformationGain } from "./informationGain";
import type { BurnoutRecord } from "./data";

type NumericFeature = "sleep" | "meetings" | "stress";//DATA SET
type Feature = NumericFeature | "weekends";

//פה קיבלנו מערך נתונים מספריים ומחשבים  ממנו את הגבול בין כל שני נתונים  
export const getSplits = (values: number[]): number[] => {
    const sortedValues = [...new Set(values)].sort((a, b) => a - b);

    const splits: number[] = [];

    for (let i = 0; i < sortedValues.length - 1; i++) {
        const middle = (sortedValues[i] + sortedValues[i + 1]) / 2;
        splits.push(middle);
    }

    return splits;
};

export const findBestSplit = (
    records: BurnoutRecord[],
    feature: NumericFeature
) => {
    const values = records.map(record => record[feature]);
    const splits = getSplits(values);
    let bestGain = 0;
    let bestSplit: number | null = null;

    for (const split of splits) {
        const leftGroup = records.filter(record => record[feature] <= split);
        const rightGroup = records.filter(record => record[feature] > split);

        const gain = calculateInformationGain(
            leftGroup.map(record => record.outcome),
            rightGroup.map(record => record.outcome)
        );
        // שומר את סף הפיצ'ר  שיש לו רווח מידע הכי גבוה 
        if (gain > bestGain) {
            bestGain = gain;
            bestSplit = split;
        }
    }
    return { bestSplit, bestGain };
};

// בוחרת את השאלה הטובה ביותר מבין המאפיינים המספריים
export const findBestQuestion = (records: BurnoutRecord[]) => {
    // רשימת המאפיינים המספריים שנבדוק
    const features: NumericFeature[] = [
        "sleep",
        "meetings",
        "stress",
    ];

    // שומר את רווח המידע הגבוה ביותר שנמצא עד כה
    let bestGain = 0;

    //שומר את המאפיין המנצחן
    let bestFeature: Feature | null = null;

    // שומר את הסף של המאפיין המנצח
    let bestThreshold: number | null = null;

    // עוברת על המאפיינים המספריים אחד־אחד
    for (const feature of features) {
        // מוצאת את הסף הטוב ביותר ואת רווח המידע שלו למאפיין הנוכחי
        const result = findBestSplit(records, feature);

        // בודקת אם הרווח הנוכחי גבוה מהרווח הטוב ביותר ששמרנו
        if (result.bestGain > bestGain) {
            // מעדכנת את רווח המידע הטוב ביותר
            bestGain = result.bestGain;

            // שומרת את המאפיין שנתן את הרווח הזה
            bestFeature = feature;

            // שומרת את הסף שנתן את הרווח הזה
            bestThreshold = result.bestSplit;
        }
    }
    // מחלקים את הרשומות לפי עבודה בסופי שבוע
    const worksWeekends = records.filter(
        record => record.weekends === true
    );

    const noWeekends = records.filter(
        record => record.weekends === false
    );

    // מחשבים את רווח המידע של החלוקה
    const weekendsGain = calculateInformationGain(
        worksWeekends.map(record => record.outcome),
        noWeekends.map(record => record.outcome)
    );

    // אם החלוקה טובה יותר מהחלוקה המספרית המובילה, שומרים אותה
    if (weekendsGain > bestGain) {
        bestGain = weekendsGain;
        bestFeature = "weekends";

        // בשאלת כן/לא אין סף מספרי
        bestThreshold = null;
    }
    // מחזירה אובייקט עם המאפיין, הסף ורווח המידע של השאלה שנבחרה
    return { bestFeature, bestThreshold, bestGain };
};