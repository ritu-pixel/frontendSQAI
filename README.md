# Sensitive Data Processor

A web application for uploading CSV files and performing sensitive data transformations such as anonymization, synthesis, and balancing. The app features a modern UI with a video background and supports previewing and downloading processed data.

## Features

- **User Authentication:** Register and login with secure forms.
- **CSV Upload:** Upload your CSV files for processing.
- **Transformations:**
  - **Anonymize:** Remove or mask sensitive information.
  - **Synthesize:** Generate synthetic data based on your dataset.
  - **Balance:** Balance your dataset by a target column.
- **Automatic Model Selection:** Detects data type (finance, health, education) based on columns.
- **Preview:** View processed data in a scrollable table.
- **Download:** Download the result as a CSV file.
- **Modern UI:** Video background, transparent content boxes, and glowing buttons for a sleek look.

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone Sensitive-Data-Processor
   cd Sensitive-Data-Processor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Place your background video as `public/background.mp4` (or update the path in the code).

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Ensure your backend API is running at `http://localhost:5000`.

## Usage

1. Register a new account or login.
2. Upload a CSV file.
3. Select a transformation and (if needed) specify the target column.
4. Click **Process** to preview the result.
5. Download the processed data as a CSV file.

## Project Structure

- `app/` - Main Next.js app directory
  - `dashboard/` - Dashboard page for data processing
  - `login/` - Login page
  - `page.js` - Registration page
- `public/` - Static files (place your video here)
- `README.md` - Project documentation

## Customization

- **Video Background:** Replace `public/background.mp4` with your own video.
- **Styling:** Tailwind CSS is used for styling. Adjust classes as needed.

## License

MIT

---

