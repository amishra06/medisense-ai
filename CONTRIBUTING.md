# Contributing to MediSense AI

First off, thank you for considering contributing to MediSense AI! It's people like you that make MediSense AI a great tool for democratizing healthcare access.

## 🌟 Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive environment for all contributors. We're all here to improve healthcare technology together.

---

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

**Required Information:**
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the behavior
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable, add screenshots
- **Environment**:
  - OS: [e.g. Windows 11, macOS 13]
  - Browser: [e.g. Chrome 120, Safari 17]
  - Version: [e.g. 1.0.0]

**Example:**
```markdown
**Bug**: Firebase authentication fails on mobile devices

**Steps to Reproduce:**
1. Open site on mobile browser
2. Click "Sign in with Google"
3. Authorize in popup
4. Return to app

**Expected**: User should be logged in
**Actual**: Returns to login screen
**Environment**: iOS 17, Safari
```

---

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title**: Concise description of the enhancement
- **Detailed description**: Explain the feature and why it would be useful
- **Use cases**: Provide examples of how this would be used
- **Mockups/Examples**: If applicable, add wireframes or examples

**Example:**
```markdown
**Feature**: Multi-language support for reports

**Description**: 
Generate clinical reports in multiple languages (Spanish, Hindi, Mandarin, etc.)

**Use Case**:
Healthcare providers in multilingual regions can generate reports in 
patients' native languages for better understanding.

**Implementation Ideas**:
- Add language selector in settings
- Use Gemini's translation capabilities
- Store language preference per user
```

---

### Pull Requests

We actively welcome your pull requests!

**Before Starting:**
1. Check existing issues and PRs to avoid duplicates
2. For major changes, open an issue first to discuss
3. Fork the repo and create your branch from `main`

**Development Process:**

1. **Fork & Clone:**
```bash
git clone https://github.com/YOUR_USERNAME/medisense-ai.git
cd medisense-ai
```

2. **Create Branch:**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Convention:**
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/add-tests` - Adding tests

3. **Install Dependencies:**
```bash
npm install
```

4. **Set Up Environment:**
```bash
cp .env.example .env.local
# Add your API keys to .env.local
```

5. **Make Your Changes:**
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

6. **Test Your Changes:**
```bash
# Run development server
npm run dev

# Build to check for errors
npm run build

# Run type checking
npm run type-check
```

7. **Commit Your Changes:**
```bash
git add .
git commit -m "feat: add multi-language support"
```

**Commit Message Convention:**
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no code change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(voice): add support for multiple languages
fix(auth): resolve Firebase authentication timeout
docs(readme): update installation instructions
refactor(report): improve PDF generation performance
```

8. **Push to Your Fork:**
```bash
git push origin feature/your-feature-name
```

9. **Open Pull Request:**
- Go to the original repository
- Click "New Pull Request"
- Select your fork and branch
- Fill in the PR template (see below)

---

## 📋 Pull Request Template

When creating a PR, include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Fixes #(issue number)

## How Has This Been Tested?
- [ ] Local development environment
- [ ] Manual testing on multiple browsers
- [ ] Tested on mobile devices
- [ ] Unit tests added/updated

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] My code follows the project's code style
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes thoroughly
- [ ] Any dependent changes have been merged and published
```

---

## 💻 Development Guidelines

### Code Style

**TypeScript:**
```typescript
// ✅ Good - Clear type definitions
interface PatientData {
  name: string;
  age: number;
  symptoms: string;
}

const analyzePatient = async (data: PatientData): Promise<Assessment> => {
  // Implementation
};

// ❌ Avoid - Any types
const analyzePatient = async (data: any): Promise<any> => {
  // Implementation
};
```

**React Components:**
```typescript
// ✅ Good - Functional components with TypeScript
interface DashboardProps {
  user: User;
  reports: Report[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, reports }) => {
  // Implementation
};

// ✅ Good - Named exports for components
export { Dashboard };
```

**File Organization:**
```
src/
  components/     # Reusable UI components
  pages/          # Page-level components
  services/       # API services and utilities
  contexts/       # React contexts
  hooks/          # Custom hooks
  types/          # TypeScript type definitions
  utils/          # Helper functions
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `Dashboard.tsx`)
- Services: `camelCase.ts` (e.g., `firebaseService.ts`)
- Types: `camelCase.ts` or `types.ts`
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)

**Variables & Functions:**
```typescript
// ✅ Good
const userReports = getUserReports();
const isLoading = true;
const handleSubmit = () => {};

// ❌ Avoid
const data = getData();
const flag = true;
const submit = () => {};
```

**Components:**
```typescript
// ✅ Good - Descriptive names
<ResultDisplay assessment={assessment} />
<PatientForm onSubmit={handleSubmit} />

// ❌ Avoid - Generic names
<Display data={data} />
<Form onSubmit={handleSubmit} />
```

### Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Gemini requires base64 encoding for image analysis
const imageData = convertToBase64(file);

// ✅ Good - Complex logic explanation
/**
 * Extracts structured patient data from voice recording
 * using Gemini's multimodal capabilities. Falls back to
 * manual entry if extraction confidence is low.
 */
async function extractPatientData(audioUrl: string) {
  // Implementation
}

// ❌ Avoid - Obvious comments
// Set loading to true
setLoading(true);
```

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

**Authentication:**
- [ ] Google sign-in works
- [ ] Sign-out works
- [ ] Protected routes redirect to login

**New Diagnosis:**
- [ ] Voice recording captures audio
- [ ] AI extracts patient data correctly
- [ ] Image upload works (drag & drop and click)
- [ ] Camera capture works
- [ ] Analysis generates report
- [ ] Report displays correctly

**Dashboard:**
- [ ] Recent reports display
- [ ] Stats are accurate
- [ ] Navigation works

**Settings:**
- [ ] Theme toggle works (light/dark/system)
- [ ] Settings save to Firebase
- [ ] Settings persist after refresh

**Responsive Design:**
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)

**Cross-Browser:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🎨 Design Guidelines

### UI/UX Principles

1. **Consistency**: Follow existing design patterns
2. **Accessibility**: Maintain WCAG 2.1 AA compliance
3. **Responsive**: Mobile-first design
4. **Performance**: Optimize images and assets

### Color Palette

```css
/* Primary Colors */
--teal-50: #f0fdfa;
--teal-600: #0d9488;
--teal-700: #0f766e;

/* Urgency Levels */
--blue-600: #2563eb;    /* Low */
--orange-600: #ea580c;   /* Medium/High */
--red-600: #dc2626;      /* Emergency */

/* Neutrals */
--slate-50: #f8fafc;
--slate-800: #1e293b;
--slate-900: #0f172a;
```

### Tailwind Classes

Prefer Tailwind utility classes over custom CSS:

```tsx
// ✅ Good
<div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">

// ❌ Avoid (unless necessary)
<div className="custom-card">
```

---

## 🔒 Security Guidelines

### Sensitive Data

**Never commit:**
- ❌ API keys
- ❌ Environment variables
- ❌ Firebase config with real credentials
- ❌ Personal data
- ❌ Passwords or tokens

**Always:**
- ✅ Use environment variables
- ✅ Add sensitive files to `.gitignore`
- ✅ Use `.env.example` as template
- ✅ Validate user input
- ✅ Sanitize data before display

### Firebase Security

```typescript
// ✅ Good - Check authentication
if (!user) {
  throw new Error('Unauthorized');
}

// ✅ Good - Validate data
if (!isValidPatientData(data)) {
  throw new Error('Invalid patient data');
}
```

---

## 📚 Documentation

### When to Update Documentation

Update documentation when:
- Adding new features
- Changing existing functionality
- Fixing bugs that affect usage
- Updating dependencies
- Changing environment variables

### What to Document

**README.md:**
- Installation steps
- Environment setup
- Usage examples
- Deployment instructions

**Code Comments:**
- Complex algorithms
- Non-obvious logic
- API integrations
- Workarounds

**Inline Documentation:**
```typescript
/**
 * Analyzes medical case using Gemini 3 Pro multimodal analysis
 * 
 * @param patientData - Patient information and symptoms
 * @param mediaFiles - Medical images/documents
 * @returns Preliminary assessment with urgency level
 * @throws {Error} If Gemini API fails or returns invalid data
 */
async function analyzeMedicalCase(
  patientData: PatientData,
  mediaFiles: DiagnosticMedia[]
): Promise<PreliminaryAssessment> {
  // Implementation
}
```

---

## 🐛 Issue Labels

We use these labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - This will not be worked on
- `duplicate` - Duplicate issue
- `priority: high` - High priority
- `priority: low` - Low priority

---

## 🎯 Areas Needing Contribution

We especially welcome contributions in:

### High Priority
- [ ] Unit and integration tests
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Performance optimizations
- [ ] Error handling improvements
- [ ] Mobile responsiveness fixes

### Medium Priority
- [ ] Multi-language support
- [ ] Additional medical imaging support (DICOM)
- [ ] Batch processing for multiple patients
- [ ] Export formats (PDF improvements, CSV)
- [ ] Analytics dashboard

### Low Priority
- [ ] Additional themes
- [ ] Customizable dashboards
- [ ] Email notifications
- [ ] Social sharing features

---

## 📞 Getting Help

**Questions?** Feel free to:
- Open an issue with the `question` label
- Join discussions in existing issues
- Check the [README](README.md) for setup help

**Found a Security Issue?**
Please DO NOT open a public issue. Email: [your-email@example.com]

---

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in the project

Thank you for making MediSense AI better! 🎉

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.