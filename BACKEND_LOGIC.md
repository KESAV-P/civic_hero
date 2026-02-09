# Backend Logic & Architecture: Civic Complaint Management System

This document outlines the backend architecture and logic flow for the Civic Hero application, designed for evaluators and government officials.

## 1. Secure Access & Accountability (Authentication)
The system enforces strict user accountability to maintain the integrity of civic data.
- **OTP-Based Login:** Users must authenticate via a One-Time Password (OTP) sent to their mobile number. This binds every interaction to a verified identity.
- **Ban & Rate Limiting:** The backend monitors for abusive patterns (e.g., excessive OTP requests) and can temporarily block numbers to prevent SMS flooding.
- **Session Management:** Secure, time-limited sessions ensure that user data remains protected during the reporting process.

## 2. Complaint Submission & Ingestion
Once authenticated, the system captures structured data to ensure actionability.
- **Data Payload:** Every complaint record includes rigid fields: `Issue Type` (Enum: Pothole, Garbage, etc.), `GPS Coordinates` (Lat/Long), `Ward Number` (Spatial query or user selection), `Timestamp`, and `Photo URL`.
- **Validation:** The backend validates coordinates against city boundaries to ensure the complaint is within the jurisdiction before acceptance.

## 3. Rule-Based Routing Engine (Deterministic Assignment)
To ensure zero bias and full auditability, the system uses a strict rule engine for assignment, removing human error from the initial triage.
- **Logic Matrix:** A decision matrix maps `Issue Type` + `Geo-Location (Ward)` -> `DepartmentID`.
  - *Example:* IF `Type`="Pothole" AND `Ward`="12" THEN ASSIGN TO `Roads_Dept_Zone_B`.
- **Deterministic Nature:** The same input always results in the same output, ensuring that routing is predictable and legally defensible.

## 4. duplicate & Spam Control (Smart Deduplication)
The system prevents resource wastage by intelligently managing repeated reports.
- **Spatial-Temporal Clustering:** Upon a new submission, the backend queries for *active* complaints of the *same type* within a *defined radius* (e.g., 20 meters) submitted in the last *48 hours*.
- **Merging Strategy:** 
  - If a match is found: The new report is linked to the existing "Parent" complaint as a "Child" or "Support Vote".
  - **Result:** The operational team sees ONE actionable item, but with a higher "Urgency Score" based on the count of merged duplicates. The user still receives updates on the parent complaint.

## 5. Lifecycle Status Management
The backend maintains a State Machine for every complaint to track its journey.
- **Transition Flow:** `Submitted` → `Assigned` (Auto) → `In Progress` (Officer Acknowledged) → `Resolved` (Work Done) → `Closed` (Verified).
- **Audit Trail:** Every status change is timestamped and logged with the ID of the actor (System or Officer), providing a complete chain of custody for transparency.
- **Real-Time Reflection:** Status changes trigger immediate updates to the citizen’s "My Complaints" view and push notifications.

## 6. Geo-Spatial Aggregation (Visualization Layer)
Raw data is transformed into visual intelligence for the dashboard.
- **Aggregation Service:** Background workers periodically aggregate complaint counts `GROUP BY Ward`, `Department`, and `Status`.
- **Heatmap Generation:** Density scores are calculated based on these aggregates to render color-coded zones on the admin map (Red=Critical, Green=Normal), allowing officials to spot recurring problem zones instantly.

## 7. AI-Driven Analytics (Decision Support)
AI is utilized purely as an analytical layer to support decision-making, without interfering with operational routing.
- **Role:** The AI engine analyzes the aggregate data (7-day and 30-day windows) to generate text summaries.
- **Insight Generation:** It translates complex statistics into plain English, e.g., *"Sanitation Department in Ward 4 is overloaded by 30% compared to average; consider reallocating resources."*
- **Safety Protocol:** The AI provides *read-only* insights. It cannot change a complaint's status or department, ensuring that all executive actions remain human-verified.

## Conclusion
This backend architecture successfully transforms raw, scattered citizen inputs into a **structured, deduplicated, and efficiently routed** stream of governance tasks. It balances **automated efficiency** with **human accountability**, providing high-level AI insights while maintaining deterministic reliability for day-to-day operations.
