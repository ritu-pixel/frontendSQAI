import './globals.css';

export const metadata = {
  title: 'Dataset Transformer',
  description: 'Upload, transform, preview, and download CSV files easily.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans">{children}</body>
    </html>
  );
}
