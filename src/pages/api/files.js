let files = []; // In production, use a database or JSON file

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Add new file
        const newFile = {
            id: Date.now().toString(),
            ...req.body
        };
        files.push(newFile);
        res.status(200).json({ success: true, file: newFile });
    }
    else if (req.method === 'GET') {
        // Get all files
        res.status(200).json(files);
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}