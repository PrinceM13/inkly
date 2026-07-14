# Technical Specification — Note Taking Web Application

Version: 1.0 (MVP)

---

# 1. Project Overview

## Objective

Build a modern web-based note-taking application that allows authenticated users to create, edit, organize, search, and share notes.

The application should prioritize:

- Simplicity
- Fast performance
- Type safety
- Minimal dependencies
- Clean architecture
- Future extensibility

This document defines the MVP architecture and implementation details.

---

# 2. Technology Stack

## Frontend

- Framework: Next.js (App Router)
- Language: TypeScript
- Package manager: pnpm
- Styling: Tailwind CSS
- UI components: shadcn/ui
- Icons: lucide-react

## Backend

- Runtime: Next.js Server Actions + Route Handlers
- Authentication: better-auth
- Validation: Zod

## Rich Text Editor

- Editor: TipTap

Supported formatting:

- Paragraph
- Heading 1
- Heading 2
- Heading 3
- Bold
- Italic
- Inline code
- Code block
- Bullet list
- Horizontal rule

## Database

Development:

- SQLite
- better-sqlite3

Production:

- Turso (libSQL)

ORM:

- Drizzle ORM

---

# 3. Project Goals

Users must be able to:

- Register an account
- Login/logout
- Login with Google
- Create notes
- View notes
- Update notes
- Delete notes
- Restore deleted notes
- Search notes
- Pin notes
- Duplicate notes
- Share notes publicly
- Disable public sharing
- Autosave note changes

Non-goals for MVP:

- Real-time collaboration
- Comments
- Teams/workspaces
- Nested folders
- Version history
- AI features

---

# 4. Functional Requirements

## Authentication

Anonymous users:

- Can view shared notes only

Authenticated users:

- Can manage only their own notes

Supported providers:

- Email/password
- Google OAuth

---

## Notes

A note contains:

- Title
- Rich text content
- Generated excerpt
- Pin state
- Public sharing state
- Creation date
- Update date

Users can:

- Create notes
- Edit notes
- Delete notes
- Restore notes
- Duplicate notes
- Pin/unpin notes
- Share/unshare notes

---

## Public Sharing

When a note is shared:

- A unique public ID is generated.
- The note becomes accessible via URL.
- The note remains read-only.
- Search engines must not index shared pages.

Example:

```text
/shared/abc123xyz
```

Requirements:

- Public users cannot edit.
- Public users cannot view private notes.
- Public URLs should be difficult to guess.

---

## Trash System

Deleting a note performs a soft delete.

Behavior:

- Set `deletedAt`.
- Remove from active notes list.
- Move into Trash.
- User may restore note.

Retention policy:

- Permanently delete after 30 days.

Cleanup strategy:

- Cleanup runs periodically using Vercel Cron.

---

## Search

Users can search:

- Note titles
- Generated excerpts
- Full note content

Search should:

- Ignore formatting.
- Work across TipTap JSON.
- Support partial matches.

Implementation:

- SQLite FTS5.

---

# 5. Non-Functional Requirements

## Performance

- Initial page load < 2 seconds.
- Search response < 300 ms.
- Autosave latency < 500 ms.

## Security

- Users can access only their own notes.
- Shared notes are read-only.
- Protected routes require authentication.
- Inputs must be validated using Zod.

## Scalability

Architecture should support future features:

- Tags
- Folders
- Collaboration
- Version history
- AI integration

---

# 6. Database Design

## Auth Tables (better-auth)

These tables are owned and managed by better-auth via the Drizzle adapter
(generated with `npx auth@latest generate`, applied with `npx auth@latest
migrate`). Table names are **singular** and column names are **camelCase** —
this matches better-auth's default schema exactly, so it must not be renamed
to `users`/`snake_case` or hand-edited without regenerating.

### user

```ts
user;
```

| Column        | Type          |
| ------------- | ------------- |
| id            | text          |
| name          | text          |
| email         | text          |
| emailVerified | boolean       |
| image         | text nullable |
| createdAt     | datetime      |
| updatedAt     | datetime      |

### session

```ts
session;
```

| Column    | Type          |
| --------- | ------------- |
| id        | text          |
| userId    | text          |
| token     | text          |
| expiresAt | datetime      |
| ipAddress | text nullable |
| userAgent | text nullable |
| createdAt | datetime      |
| updatedAt | datetime      |

### account

Stores both the email/password credential (`password`) and linked OAuth
identities such as Google (`providerId: "google"`), one row per provider per
user.

```ts
account;
```

| Column                | Type              |
| --------------------- | ----------------- |
| id                    | text              |
| userId                | text              |
| accountId             | text              |
| providerId            | text              |
| password              | text nullable     |
| accessToken           | text nullable     |
| refreshToken          | text nullable     |
| idToken               | text nullable     |
| accessTokenExpiresAt  | datetime nullable |
| refreshTokenExpiresAt | datetime nullable |
| scope                 | text nullable     |
| createdAt             | datetime          |
| updatedAt             | datetime          |

### verification

Used for email verification and password reset tokens.

```ts
verification;
```

| Column     | Type              |
| ---------- | ----------------- |
| id         | text              |
| identifier | text              |
| value      | text              |
| expiresAt  | datetime          |
| createdAt  | datetime nullable |
| updatedAt  | datetime nullable |

---

## Note Table

App-owned table (not managed by better-auth), joined to auth via `user_id`
referencing `user.id`.

```ts
notes;
```

| Column         | Type              |
| -------------- | ----------------- |
| id             | text              |
| user_id        | text              |
| title          | text              |
| content        | json              |
| excerpt        | text              |
| search_content | text              |
| is_pinned      | boolean           |
| is_public      | boolean           |
| public_id      | text nullable     |
| deleted_at     | datetime nullable |
| created_at     | datetime          |
| updated_at     | datetime          |

---

## Search Table (FTS5)

```sql
CREATE VIRTUAL TABLE notes_fts USING fts5(
    note_id,
    title,
    content
);
```

Purpose:

- Fast search.
- Search inside editor content.
- Search inside titles.

---

# 7. Data Models

## User

Shape of the `user` record returned by better-auth (e.g. `session.user` from
`auth.api.getSession`).

```ts
type User = {
  id: string;

  name: string;

  email: string;

  emailVerified: boolean;

  image: string | null;

  createdAt: Date;

  updatedAt: Date;
};
```

---

## Note

```ts
type Note = {
  id: string;

  userId: string;

  title: string;

  content: JSON;

  excerpt: string;

  searchContent: string;

  isPinned: boolean;

  isPublic: boolean;

  publicId: string | null;

  deletedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
};
```

---

# 8. TipTap Configuration

Install extensions:

```txt
StarterKit
Heading
Bold
Italic
Code
CodeBlock
BulletList
ListItem
HorizontalRule
Placeholder
```

Toolbar actions:

- Paragraph
- H1
- H2
- H3
- Bold
- Italic
- Inline code
- Code block
- Bullet list
- Horizontal rule

Storage format:

```json
{
  "type": "doc",
  "content": []
}
```

---

# 9. Autosave

Autosave strategy:

## Debounced save

Save after:

- 2 seconds of inactivity

## Backup save

Save every:

- 30 seconds

UI states:

```text
Saving...
Saved
Unsaved changes
```

No manual save button is required.

---

# 10. Application Routes

## Public Routes

```text
/
```

Landing page.

```text
/login
```

Login page.

```text
/register
```

Registration page.

```text
/shared/[publicId]
```

Public shared note.

---

## Protected Routes

```text
/notes
```

Notes list.

```text
/notes/[id]
```

Editor page.

```text
/trash
```

Deleted notes.

```text
/settings
```

User settings.

---

# 11. UI Components

## Layout

```text
AppLayout
├── Sidebar
├── Header
└── MainContent
```

---

## Components

### Sidebar

Features:

- Notes
- Trash
- Settings

---

### Notes List

Features:

- Search input
- Create button
- Pinned section
- Notes section

---

### Note Card

Display:

- Title
- Excerpt
- Updated date
- Pin indicator
- Public indicator

Actions:

- Open
- Duplicate
- Share
- Delete

---

### Editor Toolbar

Actions:

- H1
- H2
- H3
- Bold
- Italic
- Code
- Code block
- Bullet list
- Horizontal rule

---

### Share Modal

Features:

- Enable sharing
- Disable sharing
- Copy public link

---

# 12. API / Server Actions

## Authentication

```text
POST /api/auth/*
```

Handled by better-auth.

---

## Notes

```text
GET /api/notes
```

Get user notes.

---

```text
POST /api/notes
```

Create note.

---

```text
GET /api/notes/:id
```

Get note.

---

```text
PATCH /api/notes/:id
```

Update note.

---

```text
DELETE /api/notes/:id
```

Soft delete note.

---

```text
POST /api/notes/:id/restore
```

Restore note.

---

```text
POST /api/notes/:id/share
```

Enable sharing.

---

```text
DELETE /api/notes/:id/share
```

Disable sharing.

---

```text
POST /api/notes/:id/duplicate
```

Duplicate note.

---

```text
GET /api/shared/:publicId
```

Get public note.

---

# 13. Validation Rules

## Note Title

```txt
Minimum: 1 character
Maximum: 200 characters
```

---

## Note Content

```txt
Maximum JSON size: 1 MB
```

---

## Public ID

Requirements:

- Random
- URL-safe
- At least 24 characters

Example:

```text
Vg82fKXQa1Qj8LMcNyPzWtR4
```

---

# 14. Folder Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   └── shared/
│
├── components/
│   ├── editor/
│   ├── notes/
│   ├── layout/
│   └── ui/
│
├── db/
│   ├── schema/
│   ├── migrations/
│   └── index.ts
│
├── lib/
│   ├── auth/
│   ├── tiptap/
│   ├── search/
│   └── utils/
│
├── server/
│   ├── actions/
│   └── services/
│
├── types/
└── hooks/
```

---

# 15. Environment Variables

```env
DATABASE_URL=

BETTER_AUTH_SECRET=

BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=
```

Development:

```env
DATABASE_URL=file:./local.db
```

Production:

```env
DATABASE_URL=libsql://...
```

---

# 16. Deployment

## Development

```text
Next.js
    ↓
Drizzle ORM
    ↓
SQLite
```

---

## Production

```text
Vercel
    ↓
Drizzle ORM
    ↓
Turso
```

---

# 17. Development Roadmap

## Phase 1

- Project setup
- Tailwind setup
- Drizzle setup
- SQLite setup
- better-auth setup

---

## Phase 2

- Database schema
- Authentication flow
- Protected routes

---

## Phase 3

- TipTap editor
- Create/update notes
- Autosave

---

## Phase 4

- Search
- Trash
- Pin notes

---

## Phase 5

- Public sharing
- Shared pages
- SEO protection

---

## Phase 6

- Deployment
- Monitoring
- Cleanup jobs

---

# 18. Future Enhancements

Potential future features:

- Tags
- Folders
- Note history
- Markdown import/export
- Real-time collaboration
- Comments
- AI summary
- AI search
- Dark mode
- Mobile application

---

# Success Criteria

The MVP is complete when:

- Users can authenticate.
- Users can create and edit notes.
- Notes are autosaved.
- Users can search notes.
- Users can share notes publicly.
- Deleted notes can be restored.
- The application is deployed on Vercel.
- The application uses Turso in production.
- All code is fully typed with TypeScript.
- All database access uses Drizzle ORM.
- The application works on desktop and mobile devices.
