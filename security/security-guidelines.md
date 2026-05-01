# Security guidelines

This repository is public. Keep this document high-level.

Project-specific security details must stay in private project documentation.

## General rules

- Do not commit secrets.
- Do not expose environment values in documentation.
- Do not document private infrastructure details in public docs.
- Use least-privilege access where possible.
- Remove access when people leave a project.
- Keep dependencies updated.
- Validate user input.
- Protect admin interfaces and privileged actions.

## Project documentation

Each project should privately document:

- authentication model
- authorization model
- sensitive integrations
- required secrets
- deployment access
- data handling concerns
- backup and recovery expectations, when applicable
