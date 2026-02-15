# AI Usage Notes

## AI Tools Used in Development

### Primary AI Assistant: Claude (Anthropic)
- **Model**: Claude Sonnet 4
- **Platform**: claude.ai
- **Usage**: Full project architecture, code generation, documentation

## What I Used AI For

### 1. Project Architecture & Setup (100% AI)
- **What**: Project structure, folder organization, tech stack selection
- **Why**: AI knows Next.js 14 best practices and modern patterns
- **Verification**: Manually reviewed structure, tested build process

### 2. Code Generation (95% AI, 5% Manual)
- **What**: 
  - React components (VendorForm, ComparisonTable)
  - API routes (shortlist creation, health checks)
  - Database schema (Prisma models)
  - TypeScript types and interfaces
  - Utility functions
- **Why**: Faster development, consistent patterns
- **Verification**: 
  - Tested all components manually
  - Verified TypeScript types compile
  - Checked API responses match schema
  - Validated database queries work

### 3. Integration Code (90% AI)
- **What**:
  - Brave Search API integration
  - Anthropic Claude API wrapper
  - Web scraping with Cheerio
  - Database operations with Prisma
- **Why**: AI knows API documentation better than manual reading
- **Verification**:
  - Tested each API with real keys
  - Verified error handling works
  - Checked rate limiting behavior
  - Validated data parsing

### 4. UI/UX Design (80% AI, 20% Manual)
- **What**:
  - Tailwind CSS styling
  - Component layouts
  - Color scheme and gradients
  - Responsive design
  - Animations
- **Why**: AI can generate modern, accessible designs quickly
- **Manual Adjustments**:
  - Tweaked colors for better contrast
  - Adjusted spacing for visual balance
  - Added custom animations
  - Refined mobile breakpoints

### 5. Documentation (100% AI, Reviewed Manually)
- **What**: README, this file, code comments
- **Why**: AI writes clear, structured documentation
- **Verification**: Read through all docs for accuracy

## What I Checked/Verified Myself

### Code Quality
- ✅ All TypeScript errors resolved
- ✅ No console errors in browser
- ✅ ESLint warnings reviewed
- ✅ Build process succeeds
- ✅ No unused dependencies

### Functionality
- ✅ Form validation works correctly
- ✅ API calls return expected data
- ✅ Database operations commit properly
- ✅ Error states display correctly
- ✅ Loading states show appropriately
- ✅ Export functionality creates valid Markdown

### API Integrations
- ✅ Brave Search returns relevant results
- ✅ Claude AI parses responses correctly
- ✅ Web scraping extracts useful data
- ✅ Health checks accurately report status

### User Experience
- ✅ Responsive on mobile, tablet, desktop
- ✅ Loading indicators prevent user confusion
- ✅ Error messages are helpful
- ✅ Navigation is intuitive
- ✅ Results are easy to read

### Security
- ✅ API keys not committed to repo
- ✅ .env.example provided
- ✅ Input validation prevents injection
- ✅ Error messages don't leak secrets

## LLM Choice: Anthropic Claude

### Why Claude for This Project?

**1. Superior for This Use Case**
- Claude excels at structured data extraction
- Better at citing sources and providing evidence
- More reliable JSON output formatting
- Stronger reasoning for requirement matching

**2. Free Tier Availability**
- $5 free credit to start (no card required)
- Enough for ~50-100 shortlists in testing
- API access from day one

**3. Technical Capabilities**
- 200K context window (handles long scraped content)
- Better at following complex instructions
- More accurate at comparing vendor features
- Consistent JSON schema adherence

**4. API Quality**
- Simple, well-documented API
- Predictable pricing
- Good error messages
- Fast response times (~2-5 seconds)

### Alternatives Considered

**GPT-4 (OpenAI)**
- ❌ Requires credit card for API access
- ❌ No free tier for API
- ✅ Good at general tasks
- ❌ Less consistent with structured outputs

**GPT-3.5 Turbo**
- ✅ Cheaper option
- ❌ Lower quality analysis
- ❌ Worse at complex comparisons
- ❌ Less reliable JSON formatting

**Gemini (Google)**
- ✅ Free tier available
- ❌ Less mature API
- ❌ Weaker at citation/evidence
- ❌ API documentation less clear

## AI Best Practices Followed

### 1. Verification Process
- Never blindly copy-pasted AI code
- Always tested functionality manually
- Reviewed TypeScript types for correctness
- Validated API responses match expectations

### 2. Prompt Engineering
- Clear, specific prompts for each component
- Included context about tech stack
- Requested error handling explicitly
- Asked for TypeScript types
- Specified UI/UX requirements

### 3. Iterative Development
- Generated base code first
- Refined based on testing
- Fixed bugs with AI assistance
- Added features incrementally

### 4. Documentation
- Asked AI to explain complex logic
- Reviewed AI-generated comments
- Added clarifying notes where needed

## Learning Outcomes

### What I Learned
1. How Next.js 14 App Router works
2. Prisma ORM database patterns
3. Anthropic API integration
4. Brave Search API usage
5. Web scraping with Cheerio
6. shadcn/ui component library

### Skills Developed
- API integration best practices
- Error handling strategies
- Database schema design
- React component patterns
- TypeScript type safety
- Deployment configuration

## Honesty Statement

**AI Usage Level**: ~90% AI-generated, 10% manual verification/adjustment

This project heavily leverages AI, which is:
- ✅ Encouraged by the assignment ("Please use AI tools")
- ✅ Reflects real-world development (AI is a tool)
- ✅ Demonstrates prompt engineering skills
- ✅ Shows ability to verify and test AI output

**Key Point**: I understand what I'm submitting. Every file has been:
- Read completely
- Tested manually
- Verified for correctness
- Adjusted where needed

I can explain any part of this codebase because I've actively worked with all of it, even if AI generated the initial code.

## AI Usage Philosophy

**AI as a Tool, Not a Replacement**

AI was used to:
- ⚡ Speed up boilerplate code
- 📚 Learn best practices quickly
- 🔍 Discover modern patterns
- 📝 Write clear documentation

AI was NOT used to:
- ❌ Skip understanding the code
- ❌ Avoid testing
- ❌ Bypass verification
- ❌ Reduce code quality

The result is production-ready code that I understand, can maintain, and can extend.
