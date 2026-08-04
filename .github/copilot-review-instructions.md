Focus exclusively on code and functionality changes. Ignore all documentation changes including:
- README files
- CHANGELOG files
- JSDoc/TSDoc comments
- Markdown files
- License files
- Contributing guides

When reviewing code changes:
- Flag potential bugs, logic errors, and edge cases
- Check for type safety issues
- Identify missing error handling
- Look for performance concerns
- Verify test coverage for new functionality
- Check for breaking changes to public APIs

Review run protocol:
- Start with a metadata header in every review request:
	- `Repository: <owner/repo>`
	- `Branch: <branch>`
	- `PR: <url-or-number-or-none>`
	- `Goal: <one sentence>`
- Include only variable inputs in prompts (changed files, branch, risk focus). Do not paste reusable boilerplate if this file already covers it.

Preflight before analysis:
- Confirm the working directory and repository root before searching.
- Verify all referenced paths exist before reading or grepping.
- If a path is missing, stop and report exactly which path failed instead of continuing with broad fallback searches.

Execution rules:
- Prefer a single focused query per check over repeated broad scans.
- If a search returns no matches, report the exact query and scope once, then move to the next highest-signal check.
- Avoid repeating the same skill/setup sequence unless new evidence requires it.

Output contract (must include all):
- `Findings`: prioritized list of concrete issues with file paths.
- `Evidence`: key command/query output snippets that support findings.
- `Coverage`: what was checked and what was not checked.
- `Decision`: `approve` or `request changes` with one-sentence rationale.

Definition of done for each review:
- At least one explicit pass/fail statement for bug risk, type safety, and test coverage.
- A final one-line summary that can be used as the session summary.

