# 🚀 SAP Audit Trail – Change Request Management System

<p align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</p>

> **Enterprise-inspired SAP Change Request Management System featuring role-based workflow, Audit Trail, Admin Dashboard, AI-powered Risk Assessment, and Duplicate Change Request Detection.**

---

## 📖 Project Overview

The **SAP Audit Trail – Change Request Management System** is a full-stack enterprise web application designed to simulate the complete SAP Change Request lifecycle followed in modern organizations.

The system enables users to create, review, approve, track, and deploy Change Requests through a secure role-based workflow while maintaining complete transparency using an Audit Trail. It also incorporates AI-assisted features such as Duplicate Change Request Detection, Similar Change Request Suggestions, and Risk Assessment to support better decision-making.

This project was developed to demonstrate enterprise workflow automation, role-based access control, audit management, analytics, and AI-assisted governance in SAP Change Management.

---
## ✨ Key Features

### 🔐 Role-Based Access Control
- Separate dashboards for Requester, SAP AMS Team, Manager, CAB, Production Team, and Admin.
- Secure workflow based on user responsibilities.

### 📝 Change Request Management
- Create, update, and track Change Requests.
- Monitor the complete lifecycle from creation to production deployment.

### 🔄 Multi-Level Approval Workflow
- SAP AMS technical review.
- Manager approval.
- CAB (Change Advisory Board) approval.
- Production deployment with rollback support.

### 📋 Audit Trail
- Maintains a complete history of every Change Request.
- Records approvals, rejections, deployments, and workflow activities for transparency and accountability.

### 📊 Admin Dashboard
Accessible to **SAP AMS Team, Managers, and CAB members**, providing:

- Workflow statistics
- Change Request analytics
- Risk distribution
- Duplicate Change Request insights
- Audit monitoring

### 🤖 AI-Assisted Features
- Duplicate Change Request Detection
- Similar Change Request Suggestions
- AI-powered Risk Assessment
- Intelligent workflow recommendations

### 🔍 Search & Tracking
- Search Change Requests quickly.
- Filter requests by workflow status.
- View complete Change Request details and approval timeline.

---
## 👥 User Roles

| Role | Responsibilities |
|------|-------------------|
| **Requester** | Creates Change Requests, tracks their progress, and receives AI-assisted duplicate suggestions. |
| **SAP AMS Team** | Performs technical review, validates Change Requests, updates implementation details, and forwards requests for approval. |
| **Manager** | Reviews Change Requests, approves or rejects them, and monitors workflow progress. |
| **CAB (Change Advisory Board)** | Performs governance review and approves high-impact or critical Change Requests before production deployment. |
| **Production Team** | Deploys approved Change Requests to production, performs rollback when necessary, and updates deployment status. |
| **Admin** | Accesses the Admin Dashboard to monitor workflow metrics, audit logs, analytics, duplicate requests, and overall system performance. The Admin Dashboard is accessible to **SAP AMS Team, Managers, and CAB members**. |

---
## 🏗️ System Architecture

```text
                           ┌───────────────────────┐
                           │      Requester        │
                           └──────────┬────────────┘
                                      │
                                      ▼
                      Create Change Request
                                      │
                                      ▼
                    ┌──────────────────────────┐
                    │      Node.js Server       │
                    │      (Express.js API)     │
                    └──────────┬────────────────┘
                               │
                               ▼
                     AI Risk Assessment
                 Duplicate Detection Engine
                 Similar CR Recommendation
                               │
                               ▼
                       MySQL Database
                               │
                               ▼
 ┌──────────────┬──────────────┬──────────────┬──────────────┐
 │              │              │              │              │
 ▼              ▼              ▼              ▼              ▼
SAP AMS      Manager          CAB       Production       Admin
 Dashboard   Dashboard     Dashboard     Dashboard     Dashboard
```

The application follows a centralized **Node.js + Express** architecture where every dashboard communicates with the backend server. Business logic, AI-assisted analysis, audit logging, and workflow management are processed by the server before storing data in the MySQL database.

---
## 🔄 Change Request Workflow

```text
Requester
    │
    ▼
Create Change Request
    │
    ▼
SAP AMS Technical Review
    │
    ▼
Manager Approval
    │
    ▼
CAB Approval
    │
    ▼
Production Deployment
    │
    ▼
Completed
```

Every Change Request passes through a structured enterprise approval workflow. Each stage records audit logs, status updates, timestamps, and user actions to ensure complete traceability throughout the lifecycle.

---
## 🤖 AI-Assisted Features

The application integrates AI-inspired capabilities to improve Change Request analysis and decision-making.

### 🔍 Duplicate Change Request Detection
- Detects similar Change Requests during submission.
- Helps reduce redundant requests and improve workflow efficiency.

### 💡 Similar Change Request Suggestions
- Suggests previously created Change Requests with similar titles.
- Assists users in identifying existing solutions before creating a new request.

### ⚠️ AI-Powered Risk Assessment
- Evaluates the overall risk associated with a Change Request.
- Supports better decision-making during the approval process.

### 📈 Intelligent Workflow Insights
- Highlights high-risk and duplicate Change Requests through the Admin Dashboard.
- Enables administrators to monitor workflow trends and improve governance.

---
## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Version Control** | Git, GitHub |
| **Development Tools** | Visual Studio Code, MySQL Workbench |

---
## 📂 Project Structure

```text
SAP-Audit-Trail-CR-Management-System
│
├── admin.html                 # Admin Dashboard
├── ams.html                   # SAP AMS Dashboard
├── audit.html                 # Audit Trail
├── cab.html                   # CAB Dashboard
├── crdetails.html             # Change Request Details
├── crlist.html                # Change Request List
├── index.html                 # Landing Page
├── login.html                 # Login Page
├── manager.html               # Manager Dashboard
├── production.html            # Production Dashboard
├── requester.html             # Requester Dashboard
├── testing.html               # Testing Module
│
├── uploads/                   # Uploaded files
│
├── server.js                  # Backend Server (Node.js + Express)
├── package.json               # Project Configuration
├── package-lock.json          # Dependency Lock File
├── README.md                  # Project Documentation
└── .gitignore                 # Git Ignore Rules
```

---
## 🚀 Installation Guide

### Prerequisites

Before running the project, ensure the following software is installed:

- Node.js
- MySQL Server
- MySQL Workbench (Recommended)
- Git

### Clone the Repository

```bash
git clone https://github.com/sn5347-netizen/SAP-Audit-Trail-CR-Management-System.git
```

### Navigate to the Project

```bash
cd SAP-Audit-Trail-CR-Management-System
```

### Install Dependencies

```bash
npm install
```

### Configure the Database

- Create a MySQL database.
- Import the required SQL tables.
- Update the MySQL connection details inside `server.js`.

### Start the Server

```bash
node server.js
```

The application will be available at:

```text
http://localhost:3000
```

---
## 📸 Application Screenshots

> **Note:** Screenshots will be added after deployment to showcase the application interface and workflow.

### 🔐 Login Page

*(Screenshot Coming Soon)*

---

### 👤 Requester Dashboard

*(Screenshot Coming Soon)*

---

### 📊 Admin Dashboard

*(Screenshot Coming Soon)*

---

### 👨‍💼 SAP AMS Dashboard

*(Screenshot Coming Soon)*

---

### 👔 Manager Dashboard

*(Screenshot Coming Soon)*

---

### 🛡️ CAB Dashboard

*(Screenshot Coming Soon)*

---

### 🚀 Production Dashboard

*(Screenshot Coming Soon)*

---

### 📋 Change Request Details

*(Screenshot Coming Soon)*

---
## 🔮 Future Enhancements

The following enhancements are planned to further improve the system:

- 🤖 Advanced AI-based Risk Prediction using Machine Learning.
- 🔔 Email notifications for workflow approvals and status updates.
- 📊 Interactive analytics and customizable dashboards.
- 📄 Export Change Request reports in PDF and Excel formats.
- 🔐 JWT-based authentication and enhanced security.
- 🌐 Integration with enterprise SAP systems.
- 📱 Responsive user interface for mobile and tablet devices.
- 📈 Real-time notifications and live workflow updates.
- 🐳 Docker containerization for simplified deployment.
- ☁️ Cloud deployment with CI/CD integration.

---
## 👩‍💻 Author

**SHIVADHARSNI N**

**B.Tech Computer Science and Engineering**  
SRM Institute of Science and Technology

🔗 **GitHub:** https://github.com/sn5347-netizen

💼 **LinkedIn:** https://www.linkedin.com/in/shivadharsni-n-460949356/

📌 Developed as an enterprise-inspired full-stack project to demonstrate SAP Change Request Management, workflow automation, audit trail management, analytics, and AI-assisted decision support.

---
## 📜 License

This project is licensed under the **MIT License**.

Copyright © 2026 **SHIVADHARSNI N**

This project is intended for educational, learning, and portfolio purposes.

See the **LICENSE** file for complete license information.