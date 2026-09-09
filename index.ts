const projectName: string = "BURNOUT";
console.log(projectName);
//#region Imports
import { records } from "./data";
import { calculateEntropy } from "./entropy";
import { calculateInformationGain } from "./informationGain";
import { findBestSplit } from "./split";
import { buildTree } from "./tree";
import { predict } from "./predict";
import type { BurnoutInput } from "./data";
//#endregion

//#region Initial entropy
const outcomes = records.map(record => record.outcome);

console.log("Entropy:", calculateEntropy(outcomes));
//#endregion

//#region Weekend split
const worksWeekends = records.filter(
    record => record.weekends === true
);

const noWeekends = records.filter(
    record => record.weekends === false
);

const gain = calculateInformationGain(
    worksWeekends.map(record => record.outcome),
    noWeekends.map(record => record.outcome)
);

console.log("Weekend information gain:", gain);
//#endregion

//#region Best numeric splits
console.log("Sleep:", findBestSplit(records, "sleep"));
console.log("Meetings:", findBestSplit(records, "meetings"));
console.log("Stress:", findBestSplit(records, "stress"));
//#endregion

//#region Build tree
const tree = buildTree(records);

console.log(JSON.stringify(tree, null, 2));
//#endregion

//#region Test prediction
const newDeveloper: BurnoutInput = {
    sleep: 7,
    meetings: 4,
    weekends: false,
    stress: 5,
};

const prediction = predict(tree, newDeveloper);

console.log("Prediction:", prediction);
//#endregion