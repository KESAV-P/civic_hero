# Hidden Admin Mode: Unified Application Architecture

This document details the "Hidden Admin Mode" architecture of the Civic Hero application, explaining how a single codebase securely serves both citizens and government officials through strict Role-Based Access Control (RBAC).

## 1. Unified Access Point (Single Codebase)
Unlike traditional systems that require separate apps for citizens and officials, Civic Hero uses a **Single Application Strategy**.
- **Installation:** Citizens and Officials download the exact same app.
- **Efficiency:** This drastically reduces development time, maintenance costs, and deployment complexity. There is only one version to update and secure.

## 2. Dynamic Role-Based Authentication
The "Hidden Admin Mode" is unlocked purely through authentication logic, remaining invisible to standard users.
- **Login Flow:** All users see the same login screen asking for a Mobile Number and OTP.
- **Backend Verification:** Upon successful OTP verification, the backend checks the user's registered role in the secure database.
  - **IF Role = 'Citizen':** The app loads the **Reporting Interface** (Home Screen, "My Complaints").
  - **IF Role = 'Admin':** The app seamlessly switches to the **Governance Interface** (Command Dashboard).
- **Result:** A government officer logging in with their official number immediately sees administrative tools, while a citizen logging in sees reporting tools. The logic is handled server-side, preventing unauthorized access.

## 3. The Administrative Interface (Governance Only)
Once inside the Admin Mode, the application transforms:
- **Restriction:** The "Report Issue" button is removed. Admins cannot submit complaints to prevent data pollution.
- **Dashboard:** Instead of a hero banner, admins see high-density data tables and status counters (Pending, Resolved, Spam).
- **Filters:** Advanced controls allow slicing data by **Ward**, **Department**, and **Issue Type**.

### Key Admin Features:
1.  **Complaint Detail View:**
    - Displays User Name (for contact), Issue Category, and Exact GPS Location.
    - **Map Integration:** Shows the precise pin on a map for field navigation.
2.  **Status Control:**
    - Admins have exclusive controls to transition a complaint status (e.g., from *Assigned* → *In Progress* → *Resolved*).
    - These actions are audit-logged and trigger immediate notifications to the citizen.
3.  **Geo-Heatmap:**
    - A specialized visualization layer overlaid on the city map showing complaint density, helping identify "Red Zones" (high failure areas).
4.  **AI Analytics Panel:**
    - A passive intelligence layer that summarizes weekly trends (e.g., *"Garbage complaints up 20% in Ward 4"*).
    - **Crucial:** AI does **not** auto-resolve or auto-close complaints. It only summarizes data. Operational decisions remain with the human officer.
5.  **Spam & Duplicate Manager:**
    - Tools to view and merge clustered complaints, keeping the operational view clean.

## 4. Operational Integrity & Security
- **Rule-Based Routing:** The core routing logic (assigning a pothole in Ward 5 to the Ward 5 Roads Engineer) remains deterministic and hard-coded in the backend rules, ensuring AI cannot hallucinate a wrong assignment.
- **Auditability:** Every status change made in Admin Mode is stamped with the Officer's ID and Timestamp.
- **Isolation:** Explicit route protection ensures that even if a citizen guesses a URL like `/admin/dashboard`, they are instantly bounced back to the home page if their token does not have the 'admin' claim.

## Summary
This architecture provides **Role Isolation without Code Duplication**. It ensures that the government has full control and transparency over civic issues while maintaining a lean, easily maintainable technical footprint.
