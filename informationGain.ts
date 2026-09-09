import { calculateEntropy } from "./entropy";

export const calculateInformationGain = (
    firstGroup: string[],
    secondGroup: string[]
): number => {
    const total = firstGroup.length + secondGroup.length;
    if (total === 0) return 0;
  
// המספר המעיד על רמת האי וודאות לפני החלוקה (הכוללת)
    const parentEntropy = calculateEntropy([ 
        ...firstGroup,
        ...secondGroup,
    ]);
    //פה אחרי החלוקה
    const firstEntropy = calculateEntropy(firstGroup);
    const secondEntropy = calculateEntropy(secondGroup);

    //המשקל של הקבוצות בחלוקה 
    const firstWeight = firstGroup.length / total;
    const secondWeight = secondGroup.length / total;

    //עכשיו נחשב את מומצע ה ENTROPY החדש אחרי החלוקה 
    const weightedEntropy =
        firstWeight * firstEntropy +
        secondWeight * secondEntropy;
    const informationGain = parentEntropy - weightedEntropy;
   
    return informationGain;

};
