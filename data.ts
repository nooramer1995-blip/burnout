import { readFileSync } from "node:fs";

//#region Types
export type BurnoutLevel =
    | "Healthy"
    | "Risk of burnout"
    | "Vacation required"
    | "Critical condition";

export type BurnoutRecord = {
    sleep: number;
    meetings: number;
    weekends: boolean;
    stress: number;
    outcome: BurnoutLevel;
};

export type BurnoutInput = Omit<BurnoutRecord, "outcome">;
//#endregion

//#region Load data
export const records: BurnoutRecord[] = JSON.parse(
    readFileSync("./burnout-data.json", "utf-8").replace(/^\uFEFF/, "")
);
//#endregion