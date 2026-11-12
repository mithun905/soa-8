# Campus Complaint & Maintenance Management System

React + Spring Boot + MongoDB + JWT. **Phase 1 (this drop): project structure + authentication module.**

```
campus-cms/
├── backend/   (Spring Boot 3, Java 17, Maven)
│   └── src/main/java/com/campus/cms/{config,controller,dto,exception,model,repository,security,service}
└── frontend/  (React 18 + Vite)
    └── src/{components,context,pages,services}
```

## Prerequisites
Java 17+, Maven 3.9+, Node 18+, MongoDB running locally (or an Atlas URI).

## Run the backend
```bash
cd backend
export MONGODB_URI="mongodb://localhost:27017/campus_cms"
export JWT_SECRET="$(openssl rand -base64 48)"
export BOOTSTRAP_ADMIN_NAME="Campus Admin"
export BOOTSTRAP_ADMIN_EMAIL="admin@yourcampus.edu"
export BOOTSTRAP_ADMIN_PASSWORD="ChooseAStrongPassw0rd"
mvn spring-boot:run
```
(Windows PowerShell: `$env:MONGODB_URI="..."`.) The bootstrap variables create the FIRST admin only when
no admin exists; remove them afterwards. Further admins are created by admins in the UI/API.

## Run the frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev      # http://localhost:5173
```

## How to test authentication
1. **Student registration** – open /register, fill the form -> you land on /student. In MongoDB, `users` has the
   doc with `role: "STUDENT"` and a `$2a$12$...` BCrypt hash.
2. **Duplicates** – register again with same email or roll number -> 409 error message shown.
3. **Validation** – password `abc` -> field error (min 8, letter + digit).
4. **Student login** – /login. Student creds on /admin/login -> rejected (and vice versa).
5. **Admin login** – /admin/login with the bootstrap admin -> /admin dashboard.
6. **Role protection** – logged in as student, open /admin -> redirected to /student.
   API check:
   ```bash
   curl -i localhost:8080/api/auth/me                         # 401
   curl -i -H "Authorization: Bearer <STUDENT_TOKEN>" -X POST localhost:8080/api/admin/users \
     -H 'Content-Type: application/json' -d '{"name":"x","email":"x@x.com","password":"abcdefg1"}'   # 403
   ```
7. **Admin creation** – as admin, Profile -> "Create another admin account" -> new admin can log in.
8. **Role tampering** – registering with `"role":"ADMIN"` in the JSON is ignored (field doesn't exist; role is set server-side).
9. **Session restore** – refresh the page; you stay logged in. Logout clears the token.

## Roadmap
- Phase 2: complaint submission (Cloudinary), student complaint history/detail
- Phase 3: admin complaint management (status updates)
- Phase 4: resolution proofs + status synchronisation (polling)
