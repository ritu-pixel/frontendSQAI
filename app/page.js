'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError('Registration failed: ' + err.message);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 px-4 overflow-hidden">
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
      {/* White overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/30 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-black/70 p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-blue-100"
      >
        <h2 className="text-3xl font-extrabold text-blue-450 mb-6 text-center">
          Register for Sensitive Data Processor
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 p-2 rounded">
            {success}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-white-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition text-white-800"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

<div className="mb-6">
  <label className="block text-sm font-medium text-white-700 mb-1">
    Password
  </label>
  <input
    type={showPassword ? 'text' : 'password'} // Toggle here
    placeholder="Enter your password"
    className="w-full px-4 py-2 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition text-white-800"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <div className="mt-2">
    <label className="text-sm text-white-600 cursor-pointer">
      <input
        type="checkbox"
        className="mr-2"
        checked={showPassword}
        onChange={() => setShowPassword(!showPassword)}
      />
      Show Password
    </label>
  </div>
</div>


        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-2 rounded-lg transition duration-500 shadow-none hover:shadow-[0_0_24px_8px_rgba(255,255,255,0.7)]"
        >
          Register
        </button>
        <p className="mt-4 text-center text-sm text-white-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-300 hover:underline hover:shadow-[0_0_16px_4px_rgba(59,130,246,0.5)] transition-shadow rounded"
          >
            Login
          </a>
        </p>
      </form>
    </main>
  );
}