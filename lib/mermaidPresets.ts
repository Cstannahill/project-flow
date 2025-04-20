// export const diagramTypes = [
//   {
//     label: "Flowchart",
//     value: "flowchart",
//     snippet: `graph TD
//   A[Start] --> B{Decision}
//   B -->|Yes| C[Do something]
//   B -->|No| D[Do something else]`,
//   },
//   {
//     label: "Sequence Diagram",
//     value: "sequence",
//     snippet: `sequenceDiagram
//   participant A
//   participant B
//   A->>B: Hello B
//   B-->>A: Hi A`,
//   },
//   {
//     label: "Class Diagram",
//     value: "class",
//     snippet: `classDiagram
// class Issue {
//         <<Abstract>>
//         +int id
//         +String title
//         +String description
//         +Status status
//         +User assignedTo
//         +start()
//         +complete()
//     }

//     class Bug {
//         +Severity severity
//         +String report()
//     }

//     class Epic {
//         +String featureDetails
//         +requestApproval()
//     }

//     class Story {
//         +int EpicID
//     }

//     class Task {
//         +Date deadline
//     }

//     class User {
//         <<Abstract>>
//         +int userId
//         +String username
//         +String email
//         +login()
//         +logout()
//     }

//     class Admin {
//         +manageUsers()
//         +viewAllTasks()
//     }

//     class RegularUser {
//         +viewAssignedTasks()
//         +updateTaskStatus()
//     }

//     class TaskManager {
//         <<interface>>
//         +assignTask()
//         +removeTask()
//         +updateTask()
//     }
//     TaskManager <|.. TaskApp

//     class TaskApp {
//         +assignTask()
//         +removeTask()
//         +updateTask()
//         +getAllTasks()
//     }

//     class Status {
//         <<enumeration>>
//         New
//         Open
//         In Progress
//         Postponed
//         Closed
//     }

//     class Severity {
//         <<enumeration>>
//         Critical
//         High
//         Medium
//         Low
//     }

//     Issue "1" -->  User : assignedTo
//     Issue "1" --> Status : has
//     Bug "1" --> Severity : has
//     Issue <|-- Bug : Inheritance
//     Issue <|-- Epic : Inheritance
//     Issue <|-- Task : Inheritance
//     Issue <|-- Story : Inheritance
//     Epic "0" --> "many" Story
//     User <|-- Admin
//     User <|-- RegularUser

//     style Issue fill:#bfb,stroke:#6f6,stroke-width:2px,color:#000,stroke-dasharray: 5 5
//     style User fill:#bfb,stroke:#6f6,stroke-width:2px,color:#000,stroke-dasharray: 5 5
//     style TaskManager fill:#9ff,stroke:#369,stroke-width:2px,color:#000,stroke-dasharray: 5 5
//     style Status fill:#ffb,stroke:#663,stroke-width:2px,color:#000,stroke-dasharray: 5 5
//     style Severity fill:#ffb,stroke:#663,stroke-width:2px,color:#000,stroke-dasharray: 5 5

// `,
//   },
//   {
//     label: "State Diagram",
//     value: "state",
//     snippet: `stateDiagram-v2
//   [*] --> Idle
//   Idle --> Loading
//   Loading --> Complete
//   Complete --> [*]`,
//   },
//   {
//     label: "Gantt Chart",
//     value: "gantt",
//     snippet: `gantt
//   dateFormat  YYYY-MM-DD
//   title Sample Gantt
//   section Development
//   Setup       :done, 2024-01-01, 3d
//   Feature X   :active, 2024-01-04, 5d
//   QA          :2024-01-10, 3d`,
//   },
//   {
//     label: "Architecture",
//     value: "architecture-beta",
//     snippet: `architecture-beta
//     group api(cloud)[API]

//     service db(database)[Database] in api
//     service disk1(disk)[Storage] in api
//     service disk2(disk)[Storage] in api
//     service server(server)[Server] in api

//     db:L -- R:server
//     disk1:T -- B:server
//     disk2:T -- B:db
//     `,
//   },
//   {
//     value: "timeline",
//     label: "Timeline",
//     snippet: `timeline
//     title Project Timeline
//     section January - March
//         Research : Begin working on a prototype
//         Legal : Research patents and if other companies have similar ideas
//         Marketing : Probe the market and look for an opening
//     section April - June
//         Research : Test prototype and investigate ways of improving it
//         Legal : Begin working on filing for a patent
//         Marketing : Small scale marketing campaign, look for testers : Identify tester group and connect to Product Manager
//     section July
//         Vacation : Only maintenance work conducted
//     section August - September
//         Research : Move into beta-testing : Record learnings
//         Legal : Finish patent filing and wait for approval
//         Marketing : Launch a large scale marketing campaign to gauge purchasing interest
//         Production: Take beta tester feedback and implement improvements : Begin preparing for mass production of the product
//     section October - December
//         Research : Implement changes to the product based on results from beta-testing
//         Legal : Ensure the product is protected by patent before product launch
//         Marketing : Try to reach new client groups
//         Production: Scale up production to meet demand`,
//   },
//   {
//     label: "C4 Model",
//     value: "c4",
//     snippet: `C4Context
//       title System Context diagram for Internet Banking System
//       Enterprise_Boundary(b0, "BankBoundary0") {
//         Person(customerA, "Banking Customer A", "A customer of the bank, with personal bank accounts.")
//         Person(customerB, "Banking Customer B")
//         Person_Ext(customerC, "Banking Customer C", "desc")

//         Person(customerD, "Banking Customer D", "A customer of the bank, <br/> with personal bank accounts.")

//         System(SystemAA, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")

//         Enterprise_Boundary(b1, "BankBoundary") {

//           SystemDb_Ext(SystemE, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

//           System_Boundary(b2, "BankBoundary2") {
//             System(SystemA, "Banking System A")
//             System(SystemB, "Banking System B", "A system of the bank, with personal bank accounts. next line.")
//           }

//           System_Ext(SystemC, "E-mail system", "The internal Microsoft Exchange e-mail system.")
//           SystemDb(SystemD, "Banking System D Database", "A system of the bank, with personal bank accounts.")

//           Boundary(b3, "BankBoundary3", "boundary") {
//             SystemQueue(SystemF, "Banking System F Queue", "A system of the bank.")
//             SystemQueue_Ext(SystemG, "Banking System G Queue", "A system of the bank, with personal bank accounts.")
//           }
//         }
//       }

//       BiRel(customerA, SystemAA, "Uses")
//       BiRel(SystemAA, SystemE, "Uses")
//       Rel(SystemAA, SystemC, "Sends e-mails", "SMTP")
//       Rel(SystemC, customerA, "Sends e-mails to")

//       UpdateElementStyle(customerA, $fontColor="red", $bgColor="grey", $borderColor="red")
//       UpdateRelStyle(customerA, SystemAA, $textColor="blue", $lineColor="blue", $offsetX="5")
//       UpdateRelStyle(SystemAA, SystemE, $textColor="blue", $lineColor="blue", $offsetY="-10")
//       UpdateRelStyle(SystemAA, SystemC, $textColor="blue", $lineColor="blue", $offsetY="-40", $offsetX="-50")
//       UpdateRelStyle(SystemC, customerA, $textColor="red", $lineColor="red", $offsetX="-50", $offsetY="20")

//       UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")`,
//   },
//   {
//     label: "TCP Packet",
//     value: "tcp-packet",
//     snippet: `tcp-packet
//     0-15: "Source Port"
//     16-31: "Destination Port"
//     32-63: "Sequence Number"
//     64-95: "Acknowledgment Number"
//     96-99: "Data Offset"
//     100-105: "Reserved"
//     106: "URG"
//     107: "ACK"
//     108: "PSH"
//     109: "RST"
//     110: "SYN"
//     111: "FIN"
//     112-127: "Window"
//     128-143: "Checksum"
//     144-159: "Urgent Pointer"
//     160-191: "(Options and Padding)"
//     192-255: "Data (variable length)"`,
//   },
//   {
//     label: "Radar Chart",
//     value: "radar-beta",
//     snippet: `radar-beta
//     axis m["Math"], s["Science"], e["English"]
//     axis h["History"], g["Geography"], a["Art"]
//     curve a["Alice"]{85, 90, 80, 70, 75, 90}
//     curve b["Bob"]{70, 75, 85, 80, 90, 85}

//     max 100
//     min 0`,
//   },
// ];

export const diagramTypes = [
  {
    label: "Flowchart",
    value: "flowchart",
    snippet: `graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Do something]
  B -->|No| D[Do something else]`,
  },
];
