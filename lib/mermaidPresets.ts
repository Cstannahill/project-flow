export const diagramTypes = [
  {
    label: "Flowchart",
    value: "flowchart",
    snippet: `graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Do something]
  B -->|No| D[Do something else]`,
  },
  {
    label: "Sequence Diagram",
    value: "sequence",
    snippet: `sequenceDiagram
  participant A
  participant B
  A->>B: Hello B
  B-->>A: Hi A`,
  },
  {
    label: "Class Diagram",
    value: "class",
    snippet: `classDiagram
  Animal <|-- Duck
  Animal <|-- Fish
  class Animal {
    +String name
    +move()
  }`,
  },
  {
    label: "State Diagram",
    value: "state",
    snippet: `stateDiagram-v2
  [*] --> Idle
  Idle --> Loading
  Loading --> Complete
  Complete --> [*]`,
  },
  {
    label: "Gantt Chart",
    value: "gantt",
    snippet: `gantt
  dateFormat  YYYY-MM-DD
  title Sample Gantt
  section Development
  Setup       :done, 2024-01-01, 3d
  Feature X   :active, 2024-01-04, 5d
  QA          :2024-01-10, 3d`,
  },
];
