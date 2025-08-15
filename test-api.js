// Simple Node.js script to test the widget API endpoint
// Run with: node test-api.js

const fetch = require('node-fetch');

async function testWidgetAPI(widgetId, description) {
  const baseUrl = 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/widget/${widgetId}`;
  
  console.log(`\n=== Testing ${description} ===`);
  console.log('Widget ID:', widgetId);
  console.log('URL:', apiUrl);
  console.log('---');
  
  try {
    const response = await fetch(apiUrl);
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Success! Response Data:');
      console.log('  - ID:', data.id);
      console.log('  - Type:', data.type);
      console.log('  - Testimonials count:', data.testimonials?.length || 0);
      
      if (data.testimonials && data.testimonials.length > 0) {
        console.log('  - First testimonial:');
        const first = data.testimonials[0];
        console.log('    * Name:', first.customerName);
        console.log('    * Company:', first.customerCompany);
        console.log('    * Content:', first.content.substring(0, 50) + '...');
        console.log('    * Rating:', first.rating);
      }
    } else {
      const errorText = await response.text();
      console.log('✗ Error Response:', errorText);
    }
  } catch (error) {
    console.error('✗ Request failed:', error.message);
  }
}

// Also test if the embed script is accessible
async function testEmbedScript() {
  const baseUrl = 'http://localhost:3000';
  const scriptUrl = `${baseUrl}/widget/embed-v2.js`;
  
  console.log('\n\nTesting Embed Script...');
  console.log('URL:', scriptUrl);
  console.log('---');
  
  try {
    const response = await fetch(scriptUrl);
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    if (response.ok) {
      const script = await response.text();
      console.log('Script length:', script.length, 'characters');
      console.log('Contains "Boostfen Widget":', script.includes('Boostfen Widget'));
      console.log('Contains "BoostfenWidget":', script.includes('BoostfenWidget'));
    } else {
      console.log('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// Run tests
async function runAllTests() {
  // Test different widget ID types
  await testWidgetAPI('abc123', 'Group Widget (6-char slug)');
  await testWidgetAPI('xyz789', 'Individual Testimonial Widget (6-char slug)');
  await testWidgetAPI('test-project-slug', 'Project Widget (long slug)');
  await testWidgetAPI('nonexistent', 'Non-existent Widget (should fail)');
  
  // Test embed script
  await testEmbedScript();
}

runAllTests();