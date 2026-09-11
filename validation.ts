import type { BurnoutInput } from "./data";

export const isValidBurnoutInput = (
    input: unknown
): input is BurnoutInput => {
    if (input === null || typeof input !== "object") {
        return false;
    }

    if (Array.isArray(input)) {
        return false;
    }

    const body = input as Record<string, unknown>;

    if (typeof body.sleep !== "number") {
        return false;
    }

    if (!(body.sleep >= 0 && body.sleep <= 24)) {
        return false;
    }

    if (typeof body.meetings !== "number") {
        return false;
    }

    if (!Number.isInteger(body.meetings) || body.meetings < 0) {
        return false;
    }

    if (typeof body.weekends !== "boolean") {
        return false;
    }

    if (typeof body.stress !== "number") {
        return false;
    }

    if (!(body.stress >= 1 && body.stress <= 10)) {
        return false;
    }

    return true;
};