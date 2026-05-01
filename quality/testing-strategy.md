# Testing strategy

This document defines the default testing philosophy.

Testing strategy may vary by project. Project documentation must describe the actual test setup used by that project.

## Goals

Testing should reduce risk and increase confidence.

Tests should protect important behavior, not only increase coverage numbers.

## Types of tests

### Unit tests

Used for isolated logic, utilities, business rules, and predictable functions.

### Integration tests

Used when multiple parts of the system must work together.

### End-to-end tests

Used for critical user flows.

End-to-end tests are valuable but should be used intentionally because they are slower and more fragile.

## Manual testing

Manual testing may still be necessary for design review, content review, browser checks, accessibility check, client acceptance, or complex workflows.

Manual testing notes should be included in pull requests when relevant.

## Documentation

Each project should document:

- how to run tests
- what test tools are used
- which flows are considered critical
- what is tested manually
- known testing gaps
