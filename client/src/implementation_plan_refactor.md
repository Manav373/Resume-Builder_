# Refactor Resume Form Flow

## Goal
Split the resume creation into 5 logical steps, with a robust template selector at the beginning.

## Steps

### 1. Fix Lint Error
*   Start by fixing the `>` character in `Tech.tsx` (Line 102).

### 2. Update `resume-form.tsx`
*   **Navigation**: Update step counters (1-5).
*   **Step 1**: Render only `title` input and `templateId` selector grid (5 cards).
*   **Step 2**: Render `personalInfo` fields.
*   **Step 3**: Render `experience` fields.
*   **Step 4**: Render `education` fields.
*   **Step 5**: Render `skills` and `summary` input + Save/Preview actions.
*   **Logic**: Update `nextStep` / `prevStep` guards.

## Template Selector Grid (Step 1)
Will show 5 cards:
1.  Modern Sidebar
2.  Classic Professional
3.  Minimalist
4.  Creative (New)
5.  Tech / Terminal (New)
