
/**
 * Simulates the AI Analytics Layer for Civic Hero.
 * Adheres to the persona: Non-technical, objective, observation-based, no severity assignment.
 */
export function generateCivicInsights(complaints) {
    if (!complaints || complaints.length === 0) {
        return "System Status: Standing by. No active complaint data available for analysis at this moment.";
    }

    // 1. Aggregation
    const total = complaints.length;
    const wardCounts = {};
    const deptCounts = {};
    const categoryCounts = {};

    complaints.forEach(c => {
        // Normalize headings if needed, assuming mock data is consistent
        const ward = c.ward || 'Unknown Ward';
        const dept = c.department || 'General Administration';
        const cat = c.category || 'Miscellaneous';

        wardCounts[ward] = (wardCounts[ward] || 0) + 1;
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // 2. Identify Patterns
    const distinctWards = Object.keys(wardCounts).length;

    // Find highest frequency items
    const getTop = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0];
    const [topWard, topWardCount] = getTop(wardCounts);
    const [topDept, topDeptCount] = getTop(deptCounts);
    const [topCat, topCatCount] = getTop(categoryCounts);

    // 3. Generate Narrative (Persona-based)
    // "Highlight key trends, identify high-complaint wards, mention departments handling higher workloads..."

    let summary = `Overview: The system is currently tracking ${total} active civic records across ${distinctWards} wards. `;

    summary += `\n\nLocation Trends: ${topWard} shows the highest concentration of reports, accounting for roughly ${Math.round((topWardCount / total) * 100)}% of the current volume. Administrators for this area may observe increased citizen engagement. `;

    summary += `\n\nDepartmental Activity: The ${topDept} is currently handling the primary workload. `;

    summary += `\n\nRecurring Issues: Checks indicate that "${topCat}" is the most frequently reported category. `;

    summary += `\n\nObservation: This pattern suggests a focused need for resources in ${topWard} regarding ${topCat} maintenance.`;

    return summary;
}
