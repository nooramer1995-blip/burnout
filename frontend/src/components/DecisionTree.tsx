import type { TreeNode } from '../../../shared/tree'

type DecisionTreeProps = {
    node: TreeNode
}

export default function DecisionTree({ node }: DecisionTreeProps) {
    if (node.type === 'leaf') {
        const leafColors: Record<typeof node.prediction, string> = {
            'Healthy': '#dcfce7',
            'Risk of burnout': '#fef9c3',
            'Vacation required': '#ffedd5',
            'Critical condition': '#fee2e2',
        }

        return (
            <div
                className="tree-node"
                style={{ backgroundColor: leafColors[node.prediction] }}
                title={`Samples: ${node.samples}`}
            >
                {node.prediction} {/*הצגה של התחזית של אותה צומת*/}
            </div>
        )
    }

    const question =
        node.feature === 'weekends'
            ? 'Works on weekends?'
            : `${node.feature} ≤ ${node.threshold}?`

    return (
        <div className="tree-branch">
            <div className="tree-node" title={`Samples: ${node.samples}`}>
                {question}
            </div>

            <div className="tree-children">
                <div>
                    <span>Yes</span>
                    <DecisionTree node={node.left} />
                </div>

                <div>
                    <span>No</span>
                    <DecisionTree node={node.right} />
                </div>
            </div>
        </div>
    )
}                   