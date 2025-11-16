export default function handler(req, res) {
    console.log('✅ Test API called!');
    res.status(200).json({
        message: 'API is working!',
        success: true,
        timestamp: new Date().toISOString()
    });
}