import fetch from 'node-fetch';

async function testInterviewStart() {
    console.log('Testing /start endpoint...');
    
    const response = await fetch('http://localhost:3000/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jobRole: 'Software Engineer',
            domain: 'Technology',
            interviewType: 'Technical'
        })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
        const data = await response.json();
        console.log('Success! Response:', JSON.stringify(data, null, 2));
    } else {
        const errorText = await response.text();
        console.log('Error Response:', errorText);
    }
}

testInterviewStart().catch(console.error);
