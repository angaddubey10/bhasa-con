# Workflow Template

- Start with analysis. Read the codebase, identify relevant files, and clarify requirements.
- Document all planning, task lists, implementation notes, and reviews in a single workflow.md file per branch.
- Location: `copilotdocs/<gitbranchname>/workflow.md` (e.g., branch `user/foo/bar` → `copilotdocs/user/foo/bar/workflow.md`). Use clear sections (Plan, Implementation Notes, Tasks, Review, Decisions, etc.)
- Always resume by reading the latest `copilotdocs/<gitbranchname>/workflow.md` for context.
- The plan should have a list of todo items that you can check off as you complete them. Plan must factor in unit testing, edge cases and defensive programming.
- Before you begin working, check in with me and I will verify the plan
- Mark a task complete only when all relevant tests pass and the code is validated in a real build.
- Please every step of the way just give me a high-level explanation of what changes you made
- Never combine refactoring with features or bug fixes.
- Avoid over-engineering and massive changes. Small, incremental improvements only.
- You can never do git push, commit or anything which can impact remote repositories.

## Tech Stack

Python, FastAPI, React, Docker

### Example sections:
- Backend (language, framework, database)
- Frontend (framework, build tools, styling)
- Infrastructure (containerization, deployment, CI/CD)
- Third-party services

## Build System

docker compose

### Example sections:
- Development setup
- Build commands
- Testing commands
- Deployment procedures



### Example sections:
- Unit testing framework and coverage requirements
- Integration testing approach
- E2E testing strategy
- Performance testing considerations



### Example sections:
- Language-specific style guides
- Naming conventions
- Error handling patterns
- Security best practices
- Documentation requirements

## Project Context

[Provide project-specific context]

- Product description
- Performance requirements
- Critical workloads
- Architecture overview
- Key features

## Key Directories

[Document your project structure]

```text
project-root/
├── src/           # Source code
├── tests/         # Test files
├── copilotdocs/          # Documentation
└── ...            # Other directories
```

## Troubleshooting & Tips

### Common Issues

[List project-specific troubleshooting tips]

### Performance Considerations

[Document performance guidelines and optimization strategies]

## Safe Refactoring Rules

- Ensure adequate test coverage exists and passes before any refactoring
- Make smallest possible change, test, commit, repeat
- Rename only after structure is stable
- Don't combine refactoring with feature additions or bug fixes

## Knowledge & Context Management

- Track all in-progress work and decisions in `copilotdocs/<gitbranchname>/workflow.md` files. Keep them up to date.
- Add or update README.md as needed.
- Every README must clearly state the module's purpose, key responsibilities, build or usage instructions, and any critical design constraints in a concise, readable format. For non-trivial modules, include a high-level architecture diagram. If the module interacts with other subsystems, provide a dependency or interaction diagram.
- **Context drift**: If losing track, refer back to `copilotdocs/<gitbranchname>/workflow.md` files and original task requirements. Always start sessions by reading existing documentation to rebuild context.

## Development Checklist

Before marking any task complete:

- [ ] Code builds successfully
- [ ] Tests pass with adequate coverage
- [ ] Code follows style guidelines
- [ ] Changes are minimal and focused
- [ ] Logging & error handling added where appropriate
- [ ] Documentation is current
- [ ] Performance impact assessed
- [ ] Security considerations reviewed
- [ ] Review section in `copilotdocs/<gitbranchname>/workflow.md` files is updated
- [ ] Dependencies are up to date and secure

## Key Principles

- Simplicity and safety over cleverness.
- Test everything, document only what matters, minimize change.
- Keep `copilotdocs/<gitbranchname>/workflow.md` files current—this is the single source of truth.