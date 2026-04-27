# Backend Documentation

The backend is built with springboot and Java 21 following a MVC model architecture.

There are four folders for differing architectural layers

Use http://localhost:8080/swagger-ui/index.html to see Swagger UI Documentation of RESTful and Schemas

## Controller Layer
- `/api/jobs` - CRUD endpoints for job applications
- `/api/jobs/resume/upload` - Accepts multipart file upload for resumes, returns filename
- `/api/jobs/resume/{filename}` - Deletes resume file if no job applications reference it
- `/api/jobs/cover-letter/upload` - Accepts multipart file upload for cover letters, returns filename
- `/api/jobs/cover-letter/{filename}` - Deletes cover letter file if no job applications reference it
- `/api/jobs/resumes/list` - Returns list of all uploaded resume files with original names
- `/api/jobs/cover-letters/list` - Returns list of all uploaded cover letter files with original names
- `/api/users/{id}` - GET and PUT endpoints for user profile data
- `/api/jobs/company` - GET endpoint for filtering jobs by company

## Service Layer
- `FileStorageService` - Handles file storage and deletion for both resumes and cover letters
- Uses MD5 content hashing to prevent duplicate files
- Files stored in `uploads/resumes/` and `uploads/cover-letters/`
- Filenames stored as `{hash}_{originalFilename}` to preserve original name for display
- Files only deleted when no job applications reference them (reference counting)

## Repository Layer
- `countByResumeUsed(filename)` - Returns count of job applications referencing a resume file
- `countByCoverLetterUsed(filename)` - Returns count of job applications referencing a cover letter file
- `UserRepository` - Provides CRUD operations for User model
- `findByCompanyNameIgnoreCase` - Returns a list of jobs for a specific company
## Model Layer
- Defines SQL schema.

Run the Backend
```
cd backend
./mvnw spring-boot:run
```
