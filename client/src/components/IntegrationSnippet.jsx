import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

const IntegrationSnippet = ({ apiKey = 'your-api-key-here' }) => {
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1.0';
  
  const codeExamples = {
    curl: `curl -X POST ${baseUrl}/auth/login \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"email": "user@example.com", "password": "yourpassword"}'`,
    javascript: `// Using fetch API
fetch('${baseUrl}/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey}'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'yourpassword'
  })
})
.then(res => res.json())
.then(data => console.log(data));`,
    python: `import requests

url = '${baseUrl}/auth/login'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey}'
}
data = {
    'email': 'user@example.com',
    'password': 'yourpassword'
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`,
    java: `// Using HttpClient (Java 11+)
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${baseUrl}/auth/login"))
    .header("Content-Type", "application/json")
    .header("x-api-key", "${apiKey}")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\\"email\\":\\"user@example.com\\",\\"password\\":\\"yourpassword\\"}"
    ))
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
      <div className="card-header bg-dark text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <Code size={18} />
            <span className="fw-semibold">Integration Example</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <select 
              className="form-select form-select-sm bg-dark text-white border-secondary"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ width: 'auto', cursor: 'pointer' }}
            >
              <option value="curl">cURL</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <button 
              onClick={handleCopy} 
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-success" /> 
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} /> 
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="card-body bg-dark p-4">
        <pre className="mb-0 text-white" style={{ fontSize: '0.875rem', overflowX: 'auto' }}>
          <code>{codeExamples[selectedLanguage]}</code>
        </pre>
      </div>
    </div>
  );
};

export default IntegrationSnippet;