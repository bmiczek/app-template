# Quick Start Guide

This guide will help you get the Esthetically Clear project up and running on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### 1. Node.js (v20 or higher)

**Check if Node.js is installed:**
```bash
node --version
```

**If not installed, choose one of these methods:**

#### Option A: Official Installer (Recommended for beginners)
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Restart your terminal

#### Option B: Using NVM (Recommended for developers)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc  # or ~/.zshrc depending on your shell

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version
npm --version
```

### 2. pnpm (v9 or higher)

**Install pnpm globally:**
```bash
npm install -g pnpm@latest
```

**Verify installation:**
```bash
pnpm --version
```

**Alternative installation methods:**
```bash
# Using Homebrew (macOS)
brew install pnpm

# Using npm (if already installed)
npm install -g pnpm

# Using standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 3. Docker and Docker Compose

**Check if Docker is installed:**
```bash
docker --version
docker compose --version
```

**If not installed:**

#### macOS
1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
2. Install and start Docker Desktop
3. Verify: `docker --version`

#### Windows
1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. Install and start Docker Desktop
3. Verify: `docker --version`

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker
```

---

## Installation Steps

### 1. Clone the Repository (if not already done)
```bash
git clone <repository-url>
cd esthetically-clear
```

### 2. Install Dependencies
```bash
pnpm install
```

This will install all dependencies for all workspaces (frontend, backend, and packages).

**Expected output:**
- Progress bars showing package downloads
- Should complete in 1-3 minutes depending on internet speed
- No errors (warnings are generally okay)

### 3. Set Up Environment Variables

**Backend:**
```bash
cp apps/backend/.env.example apps/backend/.env
```

**Frontend:**
```bash
cp apps/frontend/.env.example apps/frontend/.env
```

**Edit `apps/backend/.env` and update if needed:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/esthetically_clear"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
BETTER_AUTH_SECRET="change-this-to-a-random-32-character-string-in-production"
BETTER_AUTH_URL="http://localhost:3001"
```

**Note:** For development, the default values should work. For production, you MUST change the `BETTER_AUTH_SECRET` to a secure random string.

### 4. Start PostgreSQL Database
```bash
docker compose up -d
```

**Verify database is running:**
```bash
docker compose ps
```

You should see:
```
NAME                      STATUS              PORTS
esthetically-clear-db     Up 5 seconds        0.0.0.0:5432->5432/tcp
```

**View database logs (optional):**
```bash
docker compose logs -f postgres
```

Press `Ctrl+C` to exit logs.

### 5. Start Development Servers

You have two options:

#### Option A: Start All Services at Once (Recommended)
```bash
pnpm dev
```

This starts both frontend and backend in parallel.

#### Option B: Start Services Individually (for debugging)

**Terminal 1 - Backend:**
```bash
pnpm --filter backend dev
```

**Terminal 2 - Frontend:**
```bash
pnpm --filter frontend dev
```

### 6. Verify Everything is Running

Once the servers are started, you should see:

**Backend (Terminal 1):**
```
🚀 Server running on http://localhost:3001
```

**Frontend (Terminal 2):**
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 7. Test the Application

Open your browser and navigate to:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
  - You should see the "Welcome to Esthetically Clear" page

- **Backend Health Check:** [http://localhost:3001/health](http://localhost:3001/health)
  - You should see: `{"status":"ok","timestamp":"..."}`

- **Backend API:** [http://localhost:3001/api](http://localhost:3001/api)
  - You should see: `{"message":"Welcome to Esthetically Clear API","version":"1.0.0"}`

---

## Common Issues and Solutions

### Issue: `pnpm: command not found`
**Solution:** Install pnpm globally
```bash
npm install -g pnpm
```

### Issue: `docker: command not found`
**Solution:** Install Docker Desktop or Docker Engine (see Prerequisites above)

### Issue: Port 5432 already in use
**Solution:** Another PostgreSQL instance is running
```bash
# Find the process using port 5432
lsof -i :5432

# Kill it (replace PID with the actual process ID)
kill -9 <PID>

# Or change the port in docker-compose.yml and DATABASE_URL
```

### Issue: Port 3000 or 3001 already in use
**Solution:** Find and kill the process
```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Repeat for port 3001 if needed
lsof -i :3001
```

### Issue: `Cannot find module` errors after install
**Solution:** Clear cache and reinstall
```bash
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Issue: Docker container won't start
**Solution:** Check Docker Desktop is running
```bash
# View detailed logs
docker compose logs postgres

# Restart container
docker compose restart postgres

# If needed, remove and recreate
docker compose down -v
docker compose up -d
```

### Issue: Permission denied on Docker commands (Linux)
**Solution:** Add user to docker group
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## Stopping the Application

### Stop Development Servers
Press `Ctrl+C` in the terminals running the dev servers

### Stop PostgreSQL
```bash
docker compose down
```

**To stop and remove all data (careful!):**
```bash
docker compose down -v
```

---

## Development Workflow

### Daily Development

1. **Start Docker** (if not running):
   ```bash
   docker compose up -d
   ```

2. **Start dev servers**:
   ```bash
   pnpm dev
   ```

3. **Make your changes** to the code

4. **Servers auto-reload** on file changes (hot module replacement)

5. **Stop when done**:
   ```bash
   # Press Ctrl+C to stop dev servers
   docker compose down  # Stop database (optional)
   ```

### Useful Commands

```bash
# Install a new dependency
pnpm --filter backend add <package-name>      # Backend
pnpm --filter frontend add <package-name>     # Frontend
pnpm --filter shared add <package-name>       # Shared

# Install dev dependency
pnpm --filter backend add -D <package-name>

# Type checking
pnpm type-check

# Linting (when configured)
pnpm lint

# Build for production
pnpm build

# Clean everything
pnpm clean
```

### Database Commands

```bash
# View database in browser (Prisma Studio)
pnpm --filter database db:studio

# Run migrations (after creating Prisma schema)
pnpm --filter database db:migrate

# Generate Prisma client
pnpm --filter database db:generate

# Reset database (careful!)
pnpm --filter database db:reset
```

---

## Next Steps

Now that your development environment is set up:

1. ✅ **Verify everything works** - Check frontend and backend are accessible
2. 📖 **Read the main [README.md](../README.md)** - Understand the project structure
3. 🗺️ **Review [development-roadmap.md](plans/development-roadmap.md)** - See what's planned
4. 🔨 **Start developing!**

### Recommended First Tasks

1. **Set up the Prisma schema** - Define your database models
2. **Run migrations** - Create database tables
3. **Add authentication** - Implement Better Auth
4. **Create your first API endpoint** - Build a CRUD resource
5. **Create frontend pages** - Build UI with TanStack Router

---

## Getting Help

- Check the main [README.md](../README.md) for detailed information
- Review [development-roadmap.md](plans/development-roadmap.md) for planned features
- Check Docker logs: `docker compose logs -f`
- Check application logs in the terminal windows

---

## Summary Checklist

- [ ] Node.js v20+ installed (`node --version`)
- [ ] pnpm v9+ installed (`pnpm --version`)
- [ ] Docker installed and running (`docker --version`)
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment files created (`.env` in backend and frontend)
- [ ] PostgreSQL running (`docker compose up -d`)
- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:3000
- [ ] Can access frontend in browser
- [ ] Backend health check returns OK

**If all checkboxes are ticked, you're ready to start developing! 🚀**
