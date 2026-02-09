# Admin-Side Map Visualization & Geo-Spatial Workflow

This document details the technical workflow for the Admin-Side Map Visualization feature in the Civic Hero application.

## 1. Data Ingestion & Loading
Upon logging into the hidden admin mode, the system triggers a data fetch operation to populate the visualization layer.
- **Data Payload:** The backend retrieves active complaint records containing:
  - **Issue Attributes:** Category (e.g., Pothole), Priority status.
  - **Complainant Details:** User Name (e.g., "Arsheer"), Contact info.
  - **Location Data:** Precise Latitude (`lat`) and Longitude (`lng`) coordinates captured at the time of submission.
  - **Administrative Scope:** Ward Number and assigned Department.

## 2. Interactive Marker Plotting
The system renders the city map and plots each unique complaint as an interactive marker.
- **Coordinate Mapping:** The `(lat, lng)` pair of each complaint is mapped to a pixel position on the interface.
- **Visual Encoding:** Markers are often color-coded by status (e.g., Red = Pending, Green = Resolved) or issue type to allow quick visual scanning.
- **Precision:** This allows administrators to see the *exact* physical location of the issue, not just a generic address, facilitating accurate field team deployment.

## 3. Detailed Data Querying (Marker Selection)
Interactivity is key for operational efficiency.
- **Selection Action:** Clicking or hovering over a specific marker triggers an info-window or sidebar update.
- **Displayed Intelligence:**
  - **Problem:** "Large Pothole causing traffic"
  - **Reported By:** "Arsheer (Citizen)"
  - **Location:** "Ward 12, Main Street"
  - **Status:** "In Progress"
- **Purpose:** This immediate context allows the admin to verify duplicates or assign urgency without navigating away from the map view.

## 4. Aggregated Heatmap Visualization
To support high-level planning, the system enables an overlay view called "Heatmap Mode".
- **Aggregation Logic:** The system processes the coordinate data to calculate spatial density (clusters of complaints within close proximity).
- **Visual Output:**
  - **High Density (Red/Orange):** Indicates a "Hotspot" or recurring problem zone (e.g., a road stretch with 10+ reports).
  - **Low Density (Green/Blue):** Indicates isolated incidents.
- **Strategic Value:** This visualization abstract individual points into actionable *areas*, helping officials identify systemic infrastructure failures (e.g., "Why is Ward 5 always red?") rather than just fixing individual tickets.

## Summary
By combining **precise point-plotting** for operational tasks with **density heatmaps** for strategic monitoring, the visualization layer transforms raw coordinate data into a powerful governance tool, all within the secure Admin interface.
