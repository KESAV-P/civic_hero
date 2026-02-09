
const fs = require('fs');
const path = require('path');

const CITIES = [
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, short: 'BLR' },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090, short: 'DLH' },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, short: 'MUM' },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, short: 'CHN' },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, short: 'HYD' }
];

const ISSUES = [
    { cat: 'Roads & Signage', desc: ['Deep pothole causing accidents', 'Broken traffic signal', 'Faded zebra crossing', 'Damaged road divider', 'Construction debris blocking road'], dept: 'Works Dept' },
    { cat: 'Electrical', desc: ['Streetlight not working', 'Leaning electric pole', 'Exposed wires near footpath', 'Transformer sparking', 'Dark street causing safety issue'], dept: 'Electrical Dept' },
    { cat: 'Sanitation', desc: ['Garbage not collected for 3 days', 'Overflowing public dustbin', 'Dead animal on roadside', 'Clogged drainage causing smell', 'Illegal dumping of waste'], dept: 'Sanitation Dept' },
    { cat: 'Water Supply', desc: ['Pipeline leakage wasting water', 'Contaminated water supply', 'No water supply for 24 hours', 'Low water pressure', 'Broken public tap'], dept: 'Water Dept' },
    { cat: 'Parks & Greenery', desc: ['Fallen tree blocking path', 'Overgrown weeds in park', 'Broken play equipment', 'Dried up fountain', 'Illegal cutting of trees'], dept: 'Horticulture Dept' }
];

const STATUSES = ['Submitted', 'In Progress', 'Pending', 'Resolved'];
const NAMES = ['Arsheer', 'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Kevin', 'Mohammed', 'Lakshmi'];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomCoord(center, spread = 0.05) {
    return center + (Math.random() - 0.5) * spread;
}

const complaints = [];

for (let i = 1; i <= 65; i++) { // Generating 65 complaints to be safe > 50
    const city = getRandom(CITIES);
    const issue = getRandom(ISSUES);
    const status = getRandom(STATUSES);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days

    const idNum = i.toString().padStart(3, '0');

    complaints.push({
        id: `CMP-2023-${idNum}`,
        description: getRandom(issue.desc),
        category: issue.cat,
        location: `${['Main Road', '1st Cross', 'Market Area', 'Near School', 'Station Road'][Math.floor(Math.random() * 5)]}, ${city.name}`,
        coordinates: {
            lat: getRandomCoord(city.lat),
            lng: getRandomCoord(city.lng)
        },
        status: status,
        submittedAt: date.toISOString(),
        imageUrl: `https://via.placeholder.com/150?text=${issue.cat.split(' ')[0]}`,
        department: issue.dept,
        ward: `Ward ${Math.floor(Math.random() * 50) + 1} (${city.short})`,
        userName: getRandom(NAMES)
    });
}

const fileContent = `
export const complaints = ${JSON.stringify(complaints, null, 2)};

export const users = [
    {
        id: 'USR-001',
        phone: '9876543210',
        role: 'citizen',
        language: 'English'
    },
    {
        id: 'ADM-001',
        username: 'admin',
        password: '',
        role: 'admin',
        department: 'Central'
    }
];

export const addComplaint = (newComplaint) => {
    complaints.unshift(newComplaint);
};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'utils', 'mockData.js'), fileContent);
console.log('Mock data generated successfully!');
