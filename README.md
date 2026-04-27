```markdown
# Job Application Tracker

A full-stack web application for tracking job applications, built with React and Java Spring Boot.

## Features

- **Track Applications**: Add, edit, and delete job applications with company name, role, status, and follow-up dates
- **File Management**: Upload and manage resumes and cover letters with automatic duplicate detection
- **Analytics Dashboard**: View total applications, rejections, and interviews at a glance
- **Filtering & Sorting**: Filter by company and sort by date or status
- **Detailed Job View**: See all information for each application including notes and attached files

## Tech Stack

**Frontend:**
- React 18
- React Router
- Axios
- React Icons

**Backend:**
- Java Spring Boot
- Spring Data JPA
- H2 Database (in-memory)
- Maven

## Project Structure

```
job-application-tracker/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── styles/          # CSS files
│   │   └── main.jsx         # Entry point
│   └── package.json
├── backend/                  # Spring Boot backend
│   ├── src/main/java/
│   │   ├── controller/      # REST controllers
│   │   ├── model/           # Entity models
│   │   ├── repository/      # JPA repositories
│   │   └── service/         # Business logic
│   └── pom.xml
└── doc/                     # Sprint documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- Java JDK 17+
- Maven 3.8+

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run the Spring Boot application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. **Add Application**: Click "+ Add Application" to create a new job entry
2. **Upload Files**: Attach resumes and cover letters when adding or editing applications
3. **Track Status**: Update application status (Applied → Interviewing → Accepted/Rejected)
4. **Filter & Sort**: Use the dropdown filters to organize your applications
5. **View Analytics**: Check your dashboard stats for quick insights

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all job applications |
| POST | `/api/jobs` | Create new application |
| GET | `/api/jobs/{id}` | Get application by ID |
| PATCH | `/api/jobs/{id}` | Update application |
| DELETE | `/api/jobs/{id}` | Delete application |
| POST | `/api/jobs/resume/upload` | Upload resume |
| DELETE | `/api/jobs/resume/{filename}` | Delete resume |
| POST | `/api/jobs/cover-letter/upload` | Upload cover letter |
| DELETE | `/api/jobs/cover-letter/{filename}` | Delete cover letter |
| GET | `/api/jobs/resumes/list` | List all resumes |
| GET | `/api/jobs/cover-letters/list` | List all cover letters |

## File Storage

Files are stored using MD5 content hashing to prevent duplicates:
- Resumes: `backend/uploads/resumes/`
- Cover Letters: `backend/uploads/cover-letters/`
## Screenshots

<img width="1913" height="1112" alt="Application Dashboard" src="https://github.com/user-attachments/assets/a5c06404-9d81-4001-ab34-5bf86561e19a" />

## License

This project is developed for educational purposes as part of EECS3311.
```
