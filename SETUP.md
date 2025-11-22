# SkilioPay PayLater - Setup Instructions

## Installation Steps

### 1. Install Dependencies

```powershell
npm install
```

This will install:

- React 18.2 + React DOM
- TypeScript 5.2
- Vite 5.0
- Tailwind CSS 3.3
- Lucide React (icons)
- ESLint + plugins

### 2. Start Development Server

```powershell
npm run dev
```

The app will automatically open at `http://localhost:3000`

### 3. Test the Application

#### Test Scenario 1: Happy Path (Eligible User)

1. Select **User**: Alya Pratama (U001)
2. Select **Cart**: Premium Headphones Bundle ($120.00)
3. Click "Pay in 3 months" button
4. Review payment plan (3 × $40.00)
5. Click "Confirm PayLater Plan"
6. See success screen with first payment confirmed
7. Click "View My PayLater Plans" to see dashboard

#### Test Scenario 2: Ineligible User (No Payment Method)

1. Select **User**: Bao Nguyen (U002)
2. Select **Cart**: Mechanical Keyboard ($85.00)
3. Hover over greyed-out "Pay in 3 months" button
4. See tooltip: "No payment method linked to account."

#### Test Scenario 3: Below Threshold

1. Select **User**: Kai Chen (U004)
2. Select **Cart**: USB Cable Set ($29.99)
3. See PayLater option is disabled
4. Hover to see: "Order total must be at least $30.00."

#### Test Scenario 4: Payment Failure & Retry

1. Select **User**: Alya Pratama (U001)
2. Select **Cart**: Wireless Mouse & Pad ($45.50)
3. **Enable**: "Simulate Payment Failure on Retry" checkbox
4. Complete checkout → First payment succeeds
5. Go to Dashboard → Click "Retry" button
6. See payment fails (simulated)
7. **Disable** the failure toggle
8. Click "Retry" again → Payment succeeds!

### 4. Explore Features

#### Dashboard View

- Shows all active PayLater agreements
- Displays installment schedule with statuses
- Activity log shows all payment events

#### Test All Users

Try each user (U001-U008) to see different eligibility scenarios:

- ✅ U001 (Alya) - Eligible, 3 prior transactions
- ❌ U002 (Bao) - No payment method
- ❌ U003 (Nur) - Not verified
- ⚠️ U004 (Kai) - Eligible but cart below threshold
- ❌ U005 (Thao) - No prior successful transactions
- ✅ U006 (Rizky) - High-value cart eligible ($999.99)
- ✅ U007 (Maricar) - Edge case: exactly $30 threshold
- ✅ U008 (Minh) - Complex cart eligible

---

## Project Structure

```
src/
├── components/
│   └── SkillioPayPresentation.tsx  # All UI screens
├── services/
│   └── paylaterService.ts          # Business logic
├── data/
│   └── mockData.ts                 # Test data
├── App.tsx                         # Root
├── main.tsx                        # Entry
└── index.css                       # Styles
```

---

## Available Scripts

```powershell
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

---

## Troubleshooting

### Issue: Dependencies not installing

**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Issue: Port 3000 already in use

**Solution**: Edit `vite.config.ts` and change port number, or stop other apps using port 3000

### Issue: Styles not loading

**Solution**: Make sure Tailwind CSS is properly configured and `npm install` completed successfully

### Issue: TypeScript errors in editor

**Solution**:

1. Ensure all dependencies are installed
2. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
3. Check `tsconfig.json` is properly configured

---

## Next Steps

### For Development

1. Review code in `src/services/paylaterService.ts` for business logic
2. Check `src/components/SkillioPayPresentation.tsx` for UI components
3. Modify test data in `src/data/mockData.ts` if needed

### For Production

1. Replace mock data with real API calls
2. Add authentication/authorization
3. Implement backend service (Node.js + Express suggested)
4. Add database (PostgreSQL/MongoDB)
5. Deploy frontend to Vercel/Netlify
6. Deploy backend to AWS/GCP/Azure

---

## Git Workflow

### Initialize Repository

```powershell
git init
git add .
git commit -m "feat: Initial commit - SkilioPay PayLater MVP"
```

### Create Feature Branches

```powershell
git checkout -b feat/paylater-ui
git checkout -b feat/eligibility-logic
git checkout -b feat/retry-flow
```

### Merge to Main & Tag Release

```powershell
git checkout main
git merge feat/paylater-ui
git merge feat/eligibility-logic
git merge feat/retry-flow
git tag -a v1.0-mvp -m "MVP Release"
git push origin main --tags
```

---

## Support

Check the main **README.md** for:

- Feature documentation
- Test scenarios
- Business rules
- Architecture details

---

**Happy coding! 🚀**
