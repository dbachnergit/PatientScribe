# Summary Command

Create a comprehensive session summary and save it to Summary.md.

## Instructions for Claude

When the user runs `/summary`, you should:

1. **Analyze the current session** and create a detailed summary including:
   - Overview of what was accomplished
   - Key technical implementations
   - Files created, modified, or deleted
   - Errors encountered and how they were resolved
   - Testing results and outcomes
   - Cost analysis (if applicable)
   - Key decisions made and rationale
   - Next steps or future enhancements

2. **Read the existing Summary.md file** to understand the format and structure used in previous session summaries

3. **Update Summary.md** by either:
   - Replacing it with the new session summary (if this was a major milestone)
   - OR appending a new dated section to document this session's work

4. **Include these key sections** in the summary:
   - **Date**: Current date
   - **Overview**: 2-3 sentence summary of session goals
   - **Achievements**: Bulleted list with checkmarks (✅)
   - **File Changes**: List of files created, modified, or deleted with descriptions
   - **Technical Implementation**: Details of workflow changes, new nodes, code modifications
   - **Errors Fixed**: Problems encountered and solutions applied
   - **Testing Results**: Output from test runs with metrics
   - **Cost Analysis**: If relevant, include cost comparisons and projections
   - **Key Decisions**: Important choices made and reasoning
   - **Next Steps**: Future enhancements or pending tasks

5. **Use consistent formatting**:
   - Markdown with proper headers
   - Code blocks for JSON, JavaScript, or command examples
   - Tables for comparisons
   - File references as markdown links: `[filename.ext](filename.ext)`
   - Checkmarks for completed items: ✅
   - Cross marks for issues: ❌
   - Pending items: [ ]

6. **After creating the summary**, inform the user that Summary.md has been updated and provide a brief 2-3 sentence overview of what was documented.

## Example Summary Structure

```markdown
# PatientScribe - Session Summary
**Date**: November 23, 2025

## Overview
[2-3 sentence summary of session]

## Achievements
- ✅ [Achievement 1]
- ✅ [Achievement 2]

## File Changes
- **[file1.json](file1.json)**: Description
- **[file2.md](file2.md)**: Description

## Technical Implementation
[Details of changes]

## Errors Fixed
### Error 1: [Error Name]
**Symptom**: [Description]
**Fix**: [Solution]

## Testing Results
[Outcomes and metrics]

## Cost Analysis
[If applicable]

## Key Decisions
[Important choices and rationale]

## Next Steps
- [ ] [Future task 1]
- [ ] [Future task 2]
```

Remember: The summary should be comprehensive enough that someone reading it weeks later can understand exactly what was accomplished in this session.
