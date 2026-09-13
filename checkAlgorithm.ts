import { strict as assert } from 'node:assert'
import { calculateEntropy } from './entropy'
import { calculateInformationGain } from './informationGain'
import { getSplits } from './split'
import { predict } from './predict'
import { isValidBurnoutInput } from './validation'
import type { TreeNode } from './tree'

// קבוצה אחידה — אין חוסר ודאות
assert.equal(calculateEntropy(['Healthy', 'Healthy']), 0)

// שתי תוצאות בשכיחות שווה
assert.equal(
    calculateEntropy(['Healthy', 'Risk of burnout']),
    1
)

// פיצול שמפריד לחלוטין בין שתי תוצאות
assert.equal(
    calculateInformationGain(
        ['Healthy', 'Healthy'],
        ['Risk of burnout', 'Risk of burnout']
    ),
    1
)

// מיון, הסרת כפילויות וחישוב נקודות האמצע
assert.deepEqual(getSplits([8, 4, 6, 6]), [5, 7])

// בדיקות לקלטים לא תקינים
for (const badInput of [
    null,
    [],
    {},
    { sleep: -1, meetings: 2, weekends: false, stress: 5 },
    { sleep: 25, meetings: 2, weekends: false, stress: 5 },
    { sleep: '8', meetings: 2, weekends: false, stress: 5 },
    { sleep: 8, meetings: -2, weekends: false, stress: 5 },
    { sleep: 8, meetings: 1.5, weekends: false, stress: 5 },
    { sleep: 8, meetings: 2, weekends: 'true', stress: 5 },
    { sleep: 8, meetings: 2, weekends: false, stress: 0 },
    { sleep: 8, meetings: 2, weekends: false, stress: 11 },
    { sleep: 8, meetings: 2, weekends: false, stress: '5' },
]) {
    assert.equal(isValidBurnoutInput(badInput), false)
}

console.log('All invalid input checks passed')