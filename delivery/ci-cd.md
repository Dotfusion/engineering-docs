# CI/CD

This document describes the default delivery principles.

Project-specific deployment details belong in each project repository.

## Principles

CI/CD should make delivery safer, more repeatable, and less dependent on individual memory.

A project should document:

- hosting provider
- build command
- output directory
- deployment trigger
- environment variables
- preview environment behavior
- rollback process
- production access requirements

## Hosting platforms

Common hosting providers:

- Vercel
- Netlify
- Amazon Web Services

Project documentation must clearly identify where each project is hosted.

## Deployment notes

A project is not properly documented until a developer can answer:

- how does this deploy?
- how do I know deployment succeeded?
- how do I rollback?
- what environment variables are required?
- where do build logs live?
