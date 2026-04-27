# Frontend Documentation

The frontend is a modern React Application built with Vite.

## Styling
- CSS styling files are stored in the styles folder

## Files and Folder Structure

### Folder Structure
- Pages are stored in src folder.
- src folder has assets for images.
- Components is for the modular components like sidebar and ResumeInput.
- styles folder is for the css

### app
- React Router manages navigation between pages from this file

### AddJob
- For adding a job application
- Includes resume file upload via ResumeInput component

### Dashboard
- For observing the Job Application list and state of the applications
- For adding/deleting/editing the applications
- Includes sorting functionality (by date and status) for better organization
- Edit modal supports resume and cover letter upload and removal
- Resume and cover letter files are cleaned up from disk when a job application is deleted
- Dropdown to select existing resumes and cover letters from file library

### ResumeInput (Component)
- Reusable component for resume file upload and removal
- Validates file type (PDF, DOC, DOCX) and size (10MB limit)
- Uploads file to backend on selection and returns stored filename to parent
- Displays upload status and allows removal of uploaded file
- Used in AddJob and Dashboard, available for teammates to import

### DataAnalytics
- For depicting the status of job applications on a monthly chart in the timeframe of a year

### DetailedJobInformation
- For showing detailed job information including the notes

### HomePage
- The main landing page and provides navigation to other sections of the application

### main
- Entry point that renders the React application into the DOM and initializes BrowserRouter

### ProfilePage / PersonalInformation
- Displays user profile information (name, email, address, years in school)
- Allows users to edit and update their information
- Stores data using localStorage so it persists after refresh

### CoverLetterInput (Component)
- Reusable component for cover letter file upload and removal
- Validates file type (PDF, DOC, DOCX) and size (10MB limit)
- Uploads file to backend on selection and returns stored filename to parent
- Supports resetAfterUpload mode for forms vs profile page log
- Used in AddJob, Dashboard, and PersonalInformation

### CompanyFilter (Component)
- Filters the dashboard job list by company name
- Dynamically populates company options as jobs are added

### ProfilePage / PersonalInformation
- Displays and edits user profile information (name, email, city, university)
- Persists profile data to backend via UserController (not localStorage)
- Displays uploaded resume log with original filenames and upload dates
- Displays uploaded cover letter log with original filenames and upload dates
- Handles resume and cover letter removal

Run the Frontend
```
cd frontend
npm install
npm run dev
```
