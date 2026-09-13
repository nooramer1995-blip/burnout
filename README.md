# Developer Burnout Analysis

A full-stack learning project that predicts a developer's burnout level using a manually implemented decision tree and visualizes its decision-making logic.

## Features

- React dashboard with sliders for sleep, meetings and stress, and a checkbox for weekend work.
- Four possible predictions: Healthy, Risk of burnout, Vacation required, and Critical condition.
- Tree visualization with conditions, Yes/No branches, colored leaves and training-record counts shown on hover.
- Loading state and user-facing request error messages.
- Express API for training, prediction and retrieving the tree as JSON.

## Technology

- TypeScript
- Node.js and Express
- React and Vite
- CSS for layout, node colors and branch connectors

No ready-made machine learning library is used. The visualization uses a recursive React component and CSS rather than a graph library.

## Algorithm and Design

The project uses a custom binary decision tree with entropy and Information Gain as its splitting criterion. This approach was chosen because it makes the reasoning behind each prediction understandable and supports both numeric and Yes/No features.

Entropy measures how mixed the outcomes are in a group:

```text
Entropy(S) = -sum(p_i * log2(p_i))
```

Information Gain measures the reduction in entropy after a split:

```text
Gain = Entropy(parent)
       - (left_count / parent_count) * Entropy(left)
       - (right_count / parent_count) * Entropy(right)
```

The algorithm searches for a useful feature and numerical threshold, partitions the records and recursively builds the child nodes. Numeric questions send values less than or equal to the threshold to the left and greater values to the right. For weekend work, true goes left and false goes right.

Recursion stops when all records have the same outcome or no useful split is found. In the latter case, a leaf uses the most common outcome. Empty training data is rejected. Each node stores the number of training records that reached it.

## Dataset

Training uses the built-in dataset imported by the backend. The tree inspected during development contained 32 training records.

| Feature | Meaning | Type |
| --- | --- | --- |
| sleep | Average hours of sleep | Number |
| meetings | Calls/meetings per day | Number |
| weekends | Whether the developer works on weekends | Boolean |
| stress | Subjective stress level, 1–10 | Number |

The target is one of the four prediction labels listed above.

## Local Setup

Prerequisite: Node.js with npm installed.

From the repository root, install the backend dependencies and start the backend:

```sh
npm install
npm run dev
```

The backend listens on `http://localhost:3000`.

In a second terminal, install the frontend dependencies and start Vite:

```sh
cd frontend
npm install
npm run dev
```

Open the Local URL printed by Vite, usually `http://localhost:5173`. Vite may select another port if that port is occupied. Keep both terminals running.

On Windows PowerShell, if script execution policy blocks npm, use `npm.cmd install` and `npm.cmd run dev`.

The frontend sends relative `/api` requests through the Vite development proxy to the backend.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check backend availability |
| POST | `/api/train` | Build the tree from the built-in dataset |
| GET | `/api/tree` | Return the trained tree as nested JSON |
| POST | `/api/predict` | Validate input and return a prediction |

Example prediction request body:

```json
{
  "sleep": 8,
  "meetings": 0,
  "weekends": false,
  "stress": 5
}
```

The tree must be trained before prediction or retrieval. These endpoints return HTTP 409 when no trained tree exists. Invalid prediction input returns HTTP 400. Caught internal failures return HTTP 500 with an error message.

Currently, clicking Predict burnout trains the tree, requests a prediction, and then retrieves the tree for display. The backend stores the tree in memory; restarting the backend clears it.

## Frontend Visualization

`DecisionTree` receives a node and renders it recursively. A question node displays its condition and renders its left and right children. A leaf displays its prediction and ends that branch.

Leaf colors are green for Healthy, yellow for Risk of burnout, orange for Vacation required and red for Critical condition. A native HTML `title` tooltip displays the node's sample count on hover. CSS `::before` elements and borders draw the branch connectors.

The `TreeNode` type is defined in a shared file so the frontend and backend use the same structure without duplicating the definition.

## Testing

The following manual checks were performed during development:

| Check | Observed result |
| --- | --- |
| Submit with the backend stopped | An error message appeared and the prediction button became available again |
| Restart the backend and submit again | Prediction succeeded and the previous error message disappeared |
| Retrieve the trained tree | Nested JSON was displayed in the frontend |
| Render the recursive tree | Conditions, Yes/No labels, connectors and colored leaves were displayed |
| Algorithm calculations | Five checks passed for entropy, Information Gain and candidate split thresholds |
| Invalid prediction input | Validation correctly rejected null, arrays, missing fields, wrong types and out-of-range values |

## AI Collaboration

I was already familiar with APIs and TypeScript before this project. I used ChatGPT as a learning and development assistant, specifically to:

- Set up the project structure and local development environment, including the React/Vite frontend and running the frontend and backend locally.
- Learn entropy and Information Gain, including the meaning of the formulas and how they guide decision-tree splitting.
- Understand recursive tree construction, stopping conditions and how predictions follow the tree.
- Learn React concepts such as state, conditional rendering, component props and recursive components.
- Implement loading states and user-facing error messages in the React interface.
- Develop and understand CSS styling, including Flexbox, relative and absolute positioning, `::before`, tree connectors and risk-based leaf colors.



## Submission Links

- GitHub repository: [View repository](https://github.com/nooramer1995-blip/burnout)
- Deployed application: 




