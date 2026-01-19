# Moving .env File to Correct Location

## Important: .env File Location

The `.env` file **MUST** be in the `backend/` folder, not in the root directory.

## Why?

The backend code runs `dotenv.config()` which looks for `.env` in the current working directory. When you run `npm run dev` from the `backend/` folder, it expects `.env` to be there.

## How to Move It

### Option 1: Using File Explorer
1. Find your `.env` file (wherever you pasted it)
2. Copy it
3. Navigate to: `aniparadise/backend/`
4. Paste the `.env` file there

### Option 2: Using Command Line (PowerShell)
If your `.env` is in the root directory:
```powershell
cd "C:\Users\Sreehari S Madhavan\aniparadise\aniparadise"
Move-Item .env backend\.env
```

If your `.env` is somewhere else, provide the full path:
```powershell
Move-Item "C:\path\to\your\.env" "C:\Users\Sreehari S Madhavan\aniparadise\aniparadise\backend\.env"
```

### Option 3: Copy Instead of Move
If you want to keep a backup:
```powershell
Copy-Item "C:\path\to\your\.env" "C:\Users\Sreehari S Madhavan\aniparadise\aniparadise\backend\.env"
```

## Verify Location

After moving, verify it's in the right place:
```powershell
cd "C:\Users\Sreehari S Madhavan\aniparadise\aniparadise\backend"
Test-Path .env
# Should return: True
```

## File Structure Should Be:

```
aniparadise/
├── backend/
│   ├── .env          ← MUST BE HERE
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/
├── database/
└── ...
```

## After Moving

1. Verify `.env` is in `backend/` folder
2. Check that it has all required variables (see `ENV_SETUP.md`)
3. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```
