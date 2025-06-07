'use client';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [transformation, setTransformation] = useState('');
  const [preview, setPreview] = useState('');
  const [token, setToken] = useState('');
  const [targetColumn, setTargetColumn] = useState('');
 
useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Handle file upload
  const handleUpload = (e) => {
    setFile(e.target.files[0]);
    setPreview('Preview of processed data will appear here.');
  };

  // Process file with selected transformation
  const handleProcess = async () => {
    if (!file || !transformation) {
      setPreview('Please upload a file and select a transformation.');
      return;
    }
    if (!token) {
      setPreview('Please login first.');
      return;
    }
    if (transformation === 'balance' && !targetColumn) {
      setPreview('Please enter a target column for balancing.');
      return;
    }

    setPreview('Processing...');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors && results.errors.length > 0) {
          setPreview('CSV parsing error: ' + results.errors[0].message);
          return;
        }
        const data = results.data;
        let endpoint = '';
        if (transformation === 'anonymize') endpoint = '/anonymize';
        else if (transformation === 'synthesize') endpoint = '/synthesize';
        else if (transformation === 'balance') endpoint = '/balance';
        else {
          setPreview('Transformation not supported.');
          return;
        }

        // Auto-select model based on column names
        const columns = data.length > 0 ? Object.keys(data[0]).map(col => col.toLowerCase()) : [];
        let model = 'finance'; // default

        const healthKeywords = ['patient', 'diagnosis', 'medical', 'hospital', 'doctor', 'health'];
        const educationKeywords = ['student', 'school', 'grade', 'teacher', 'passed_exam', 'class'];

        if (columns.some(col => healthKeywords.some(keyword => col.includes(keyword)))) {
          model = 'health';
        } else if (columns.some(col => educationKeywords.some(keyword => col.includes(keyword)))) {
          model = 'education';
        }

        const configs = { model };
        if (transformation === 'balance') {
          configs.target_column = targetColumn;
        }

        try {
          const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data, configs }),
          });
          const result = await response.json();
          let resultData = result.anonymized_data || result.synthesized_data || result.balanced_data || result;

          // Try to parse if it's a string
          if (typeof resultData === 'string') {
            try {
              const parsed = JSON.parse(resultData);
              if (Array.isArray(parsed)) {
                resultData = parsed;
              }
            } catch (e) {
              // leave as string if not JSON
            }
          }
          setPreview(Array.isArray(resultData) ? resultData : JSON.stringify(resultData, null, 2));

        } catch (error) {
          setPreview('Error processing file.');
        }
      },
      error: (err) => {
        setPreview('CSV parsing failed: ' + err.message);
      }
    });
  };

  // Download function
  const handleDownload = async () => {
    if (!preview || !Array.isArray(preview) || preview.length === 0) {
      alert('No data to download.');
      return;
    }

    // Convert preview data to CSV
    const csvRows = [];
    const headers = Object.keys(preview[0]);
    csvRows.push(headers.join(','));

    preview.forEach(row => {
      const values = headers.map(header => {
        const val = row[header] ?? '';
        // Escape quotes and commas
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-100 to-white px-6 py-10 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* White overlay (no blur) */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/30 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto bg-black/70 shadow-xl rounded-xl p-8 border border-white-700">
        <h1 className="text-3xl font-bold text-white-700 mb-6">
          🛠️ Sensitive Data Processor
        </h1>

        <div className="mb-4">
          <label className="block text-base font-medium text-white-900 mb-1">Upload CSV File:</label>
          <input type="file" accept=".csv" onChange={handleUpload} className="w-full p-2 border border-white-700 rounded text-sm text-white-900" />
        </div>

        <div className="mb-4">
          <label className="block text-base font-medium text-black-900 mb-1">Select Transformation:</label>
          <select
            onChange={(e) => setTransformation(e.target.value)}
            value={transformation}
            className="w-full p-2 border border-white-800 rounded text-sm text-black bg-white"
            style={{ colorScheme: 'light' }} // Ensures consistent color on all platforms
          >
            <option value="" className="text-black bg-white">--Choose--</option>
            <option value="anonymize" className="text-black bg-white">Anonymize</option>
            <option value="synthesize" className="text-black bg-white">Synthesize</option>
            <option value="balance" className="text-black bg-white">Balance</option>
          </select>
        </div>

        {transformation === 'balance' && (
          <div className="mb-4">
            <label className="block text-base font-medium text-white-900 mb-1">Target Column:</label>
            <input
              type="text"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="w-full p-2 border border-white-800 rounded text-sm text-white-800 bg-white"
              placeholder="Enter target column name"
            />
          </div>
        )}

        <button
          onClick={handleProcess}
          className="w-full bg-black text-white py-2 rounded mb-6 transition duration-200 shadow-none hover:shadow-[0_0_24px_8px_rgba(255,255,255,0.4)]"
        >
          Process
        </button>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-white-900">Result Preview:</label>
          <div className="bg-white-800 p-4 rounded h-48 overflow-auto text-sm whitespace-pre-wrap text-white-100">
            {Array.isArray(preview) && preview.length > 0 ? (
              <table className="min-w-full border border-white-700 text-white-900">
                <thead>
                  <tr>
                    {Object.keys(preview[0]).map((col) => (
                      <th key={col} className="border px-2 py-1">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="border px-2 py-1">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span>{typeof preview === 'string' ? preview : 'No data to preview.'}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-black text-white py-2 rounded mb-6 transition duration-200 shadow-none hover:shadow-[0_0_24px_8px_rgba(255,255,255,0.4)]"
        >
          Download Result
        </button>
      </div>
    </main>
  );
}
