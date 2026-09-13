import type { BurnoutLevel } from '../data'

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
