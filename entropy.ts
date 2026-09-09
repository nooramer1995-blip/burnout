export const calculateEntropy = (outcomes: string[]): number => {
    const counts: Record<string, number> = {};

    for (const outcome of outcomes) {
        counts[outcome] = (counts[outcome] ?? 0) + 1;
    }

    let entropy = 0;

    for (const count of Object.values(counts)) {
        const p = count / outcomes.length;
        entropy -= p * Math.log2(p);
    }

    return entropy;
};