# NoteCraft UI Generation Prompt

Copy the prompt below into your UI-generation tool. It is tailored to the existing NoteCraft project and its requested direction.

---

## Prompt

Design and implement a polished, responsive web application UI for **NoteCraft**, a personal notes and knowledge-organizing product. Work inside the existing project rather than generating a separate application.

### Existing project context

- The project is currently a React 19 application built with Vite 7, Tailwind CSS 3, React Router, Redux Toolkit, Lucide React, and React Hot Toast.
- Existing routes and screens are: `/` for the Home note/paste editor, `/pastes` for the saved-item list, `/pastes/:id` for viewing an item, and a not-found page.
- Existing components include `Home`, `Paste`, `ViewPaste`, `Navbar`, and `NotFound`. The current editor and list use browser localStorage through Redux; there is no authentication flow, server API, database, or backend in this project yet.
- Evolve the current “Home / Pastes” experience into a coherent notes product. Use “Notes” in user-facing navigation and copy rather than “Pastes.” Preserve the useful create, edit, view, delete, copy, share, and search concepts already present.
- Do not imply that authentication, cloud sync, real-time collaboration, or server persistence already works. Build UI states and integration-ready boundaries; use clearly identified mock/demo data only where necessary.

### Product goal

Create a calm, focused workspace where a signed-in user can securely create, organize, search, edit, share, and delete personal notes. The interface should feel fast and approachable for daily use, not like an admin dashboard or a generic template.

### Visual direction

- Use a refined, contemporary productivity-app aesthetic: generous whitespace, clear typography, restrained surfaces, subtle borders, and a confident indigo/violet accent.
- Keep the existing dark slate/indigo visual identity as a starting point, but improve contrast, hierarchy, consistency, and spacing. Support a polished light theme and a dark theme if practical; make the default appearance cohesive rather than mixing unrelated styles.
- Use Lucide icons consistently. Avoid emoji as interface icons, excessive gradients, heavy blur, tiny text, and oversized decorative elements.
- Establish reusable styles for buttons, inputs, cards, menus, dialogs, badges, toast notifications, focus rings, and loading placeholders.
- Keep animations brief and purposeful, respect `prefers-reduced-motion`, and provide visible hover, focus, active, disabled, loading, success, and error states.
- Ensure layouts adapt cleanly to desktop, tablet, and mobile. No fixed minimum-width layouts or horizontal overflow.

### Application shell and navigation

For authenticated pages, create an application shell with:

- A compact NoteCraft wordmark and a clear primary navigation.
- Desktop sidebar links for **All notes**, **Favorites**, and **Recently deleted** (only show features that have a meaningful UI state). Include a visible **New note** action.
- A top bar with global note search, an optional shortcut hint, a theme control if themes are implemented, and a user avatar/menu.
- The avatar menu should include **Profile**, **Settings**, and **Sign out**.
- On small screens, collapse the sidebar into an accessible drawer or compact navigation and keep the primary create action easy to reach.
- Clearly show the active navigation item and use semantic links and buttons.

### Screens and flows

#### 1. Sign up

- Create a welcoming, responsive registration page with NoteCraft branding and a concise value proposition.
- Include name, email, password, and confirm-password inputs; show labels, helpful validation, password visibility toggle, and a password-strength or requirements hint.
- Include a consent/terms checkbox if appropriate, a primary **Create account** button, a link to sign in, and pending/success/error states.
- Provide an optional third-party sign-in button only as a visual placeholder; do not claim it is wired to a provider.
- On mobile, prioritize the form and avoid decorative content pushing it below the fold.

#### 2. Sign in

- Include email and password fields, password visibility toggle, remember-me option if supported, **Forgot password?** link, primary **Sign in** action, and a link to create an account.
- Design invalid-credentials, required-field, submitting, and service-error states accessibly.
- Keep authentication screens visually consistent with each other and clearly separate from the authenticated app shell.

#### 3. Notes dashboard / All notes

- Welcome the user by name when available, with a clear **New note** action.
- Show a useful overview without clutter: total notes and a compact recent-activity summary, followed by search, sort, filter, and the notes collection.
- Provide list and/or grid layouts with note title, short content preview, last-updated date, optional tags, and favorite status.
- Support search by title and content; include sort options such as recently updated, created date, and title, plus useful tag filters if tags are included.
- Each note should expose clear actions for open, edit, favorite/unfavorite, copy/share where applicable, and delete. Use accessible menus or buttons with descriptive labels.
- Add thoughtful empty, no-search-results, loading/skeleton, and error states. The empty state should invite the user to create their first note.
- Confirm destructive deletion in a dialog or provide a recoverable undo pattern. Never silently delete a note.

#### 4. Create and edit note

- Replace the current plain paste editor with a comfortable note editor while retaining the existing create/edit workflow.
- Include a title field, rich-text editing area, formatting controls for common operations (bold, italic, headings, lists, links, blockquote, undo/redo where supported), and a clean reading/writing surface.
- Show a save state such as **Saving…**, **Saved**, or **Unsaved changes**. Avoid suggesting server autosave if the app is not connected to a backend; label local/demo persistence accurately.
- Include useful actions such as back to notes, favorite, copy, share, and delete/edit as contextually appropriate.
- Prevent accidental loss of unsaved edits; show a confirmation before navigating away when needed.
- Make the toolbar keyboard-accessible and provide accessible names/tooltips.

#### 5. Note detail / read view

- Present the note title, formatted content, tags if present, and created/updated metadata in a distraction-free reading layout.
- Provide clear **Edit**, **Copy**, **Share**, **Favorite**, and **Delete** actions as appropriate.
- Handle an unavailable note with a friendly not-found state and a route back to All notes.

#### 6. Profile and settings

- Provide a profile view with editable display name and email presentation, plus an account/security section that can accommodate password changes.
- Keep settings focused: theme, account, and sign-out at minimum. Do not expose fake controls that have no behavior or documented placeholder state.
- Include confirmation and success/error feedback for user actions.

#### 7. Recently deleted and favorites

- If included, make Favorites a filtered view of a user's notes.
- Recently deleted should clearly indicate that items are deleted, offer restore and permanent-delete actions, and ask for confirmation before permanent deletion.
- Include empty and loading states; do not create screens that look complete but have no usable action.

#### 8. Not found and general errors

- Replace the current 404 presentation with a consistent NoteCraft-branded page and actions to return to the dashboard or create a note.
- Provide a reusable error/notification treatment for failed saves, failed loads, and network/service errors. Keep messages clear and avoid exposing technical stack traces.

### Responsive and accessibility requirements

- Use semantic landmarks, heading order, form labels, and native button/link elements.
- Ensure keyboard navigation, visible focus, sufficient color contrast, and meaningful accessible names for icon-only controls.
- Associate validation and error text with inputs; announce status changes politely where appropriate.
- Make dialogs keyboard-operable, trap focus appropriately, and return focus when closed.
- Test layouts at narrow phone, tablet, and desktop widths; keep content readable and controls touch-friendly.

### Data and interaction expectations

- Treat each note as belonging to the currently signed-in user. Design the UI so a future API can enforce that ownership; do not rely on UI filtering as authorization.
- Use a consistent note shape in mock data, for example: `id`, `title`, `content`, `createdAt`, `updatedAt`, `tags`, and `isFavorite`.
- Keep API/auth integration points explicit. The requested eventual system may use a Node.js backend, a relational MySQL or PostgreSQL database, Pino logging, centralized error handling, and authenticated CRUD APIs; these are not currently present in this frontend repository.
- Do not put credentials, tokens, or secrets in source code or localStorage. Do not log passwords or sensitive note content.
- Preserve existing routing/state conventions where practical, but refactor the current app where necessary for a consistent authenticated shell and note-oriented naming.
- Reuse installed dependencies where possible. Avoid adding large dependencies without a clear need; if rich-text editing requires a package that is not installed, state the choice and keep the editor integration isolated.
- Implement real interactions for visible controls within the frontend's available capabilities. Where a backend is required, provide an explicit, clearly labeled demo/mock boundary rather than a success-shaped fake.

### Quality bar and deliverables

- Deliver a cohesive end-to-end UI, not just isolated screenshots or a landing page.
- Include the sign-up and sign-in flows, authenticated dashboard, notes list/search, create/edit editor, note read view, profile/settings, and responsive navigation.
- Keep components maintainable and consistent with the existing React/Vite/Tailwind setup.
- Update page metadata/title and remove Vite starter branding where relevant.
- Ensure routes render without runtime errors, controls have sensible behavior, and the existing Vite production build and ESLint checks pass.
- Do not implement backend/database/logging/testing/SonarQube infrastructure as if it already exists; keep the UI ready for those later integrations and clearly report any mock-only behavior.

---

## Screen-wise prompts

Use the shared context first, then give the UI generator the individual screen prompt(s) you want it to work on. For a multi-screen implementation, provide the prompts in the order listed and ask it to reuse one shared design system and application shell.

### Shared context for every screen

> You are designing a screen for NoteCraft, an existing React 19 + Vite + Tailwind CSS 3 application using React Router, Redux Toolkit, Lucide React, and React Hot Toast. The app currently has a Home editor, a Pastes listing, a paste detail page, and a 404 screen; saved content is currently stored in localStorage. There is no working authentication, API, database, or cloud persistence yet. Convert user-facing “Paste(s)” language into “Note(s)” while retaining useful create, edit, view, copy, share, delete, and search behavior.
>
> Use a cohesive productivity-app design: calm slate/neutral surfaces, accessible text contrast, indigo/violet accent, clean typography, restrained borders, consistent spacing, and Lucide icons. Match the same design system across screens. Make the layout responsive from mobile to desktop, keyboard accessible, semantic, and usable with visible focus and disabled/loading/error/success states. Avoid fixed-width overflow and fake controls. Any backend-dependent behavior must be marked as a demo/mock or left behind an explicit integration boundary; never present mock authentication or remote saving as real.

### 1. Sign-up screen

> Create the NoteCraft account registration screen at `/signup`. Use a focused centered form with the NoteCraft wordmark, short headline and supporting copy, and a subtle decorative accent that does not compete with the form. Include labeled full-name, email, password, and confirm-password inputs; password visibility toggles; inline required/format/mismatch validation; and a concise password requirements hint. Add a terms/privacy consent checkbox if required by the product design, a primary **Create account** button, and a clear link to `/signin`. Include pending, validation-error, and service-error states with accessible messages. Make it comfortable on mobile and consistent with the sign-in screen. Do not imply account creation works unless connected to a real auth service; clearly label any demo behavior.

### 2. Sign-in screen

> Create the NoteCraft sign-in screen at `/signin`, visually consistent with `/signup`. Include the brand, welcoming headline, labeled email and password inputs, password visibility toggle, a **Remember me** option only if its behavior is implemented, a **Forgot password?** link with a clear placeholder/integration state if password recovery is not available, a primary **Sign in** button, and a link to `/signup`. Show accessible required-field, invalid-credentials, submitting, and service-error states. Keep the form clear and compact on mobile. Do not claim authentication works when it is only a mock.

### 3. Notes dashboard / All notes

> Design the authenticated NoteCraft dashboard at `/` (or the existing home route). Use the shared app shell: desktop sidebar with NoteCraft branding, **All notes**, **Favorites**, and **Recently deleted** navigation plus a prominent **New note** action; top bar with global search and a user avatar/menu; responsive drawer/navigation on small screens. In the main area show a personal greeting, a concise notes overview, and a collection header with note count, sort control, and grid/list toggle if both layouts are implemented. Display note cards/rows with title, readable excerpt, updated date, optional tags, and favorite control. Add a useful empty state with a create-note call to action, a no-results state with a clear-search action, and skeleton/loading/error states. Ensure search works against titles and content and controls have meaningful accessible names. Use demo data only when explicitly identified.

### 4. Create note screen

> Design the NoteCraft create-note experience at `/notes/new` (or adapt the existing Home route without breaking existing routes). Keep the authenticated shell but give the editor a focused writing layout. Include breadcrumb/back-to-notes navigation, a title input, a rich-text editing surface, and a compact accessible formatting toolbar for bold, italic, headings, bullet/numbered lists, links, blockquote, and undo/redo when supported. Include autosave/save status only if its actual persistence behavior is clear; for local/demo persistence say so. Provide actions for save, cancel/back, favorite only if meaningful, and a delete action only when editing an existing note. Handle blank title/content, unsaved changes, saving, saved, and save-error states. Do not silently discard unsaved work. Design toolbar controls for keyboard and touch use.

### 5. Edit note screen

> Design the NoteCraft edit-note screen at `/notes/:id/edit` using the same editor as create-note, prefilled with the selected note's title and formatted content. Show a subtle updated timestamp and save status. Provide save changes, cancel/back, favorite, and delete actions with appropriate confirmation. Handle missing notes with a friendly not-found state, and prevent accidental loss of unsaved changes. Keep create and edit layouts consistent rather than inventing a separate editor style.

### 6. Note detail / reading screen

> Design the NoteCraft read-only note page at `/notes/:id`. Present the note title, formatted rich content, tags if present, and created/updated metadata in a clean reading column with comfortable line length. Include clear **Edit**, **Copy**, **Share**, **Favorite**, and **Delete** actions where available; icon-only buttons need accessible labels and tooltips. Give copy/share actions feedback and use a confirmation dialog or recoverable undo for deletion. Include a back-to-notes link. If the note ID is missing or unavailable, show a friendly empty/not-found state with a route back to All notes instead of a broken screen.

### 7. Favorites screen

> Design the NoteCraft Favorites screen at `/favorites` within the shared authenticated shell. Reuse the dashboard note card/list components and show only notes marked favorite. Include a page title, result count, search/filter/sort if supported, clear favorite toggles, and a helpful empty state explaining how to favorite a note. Include loading and error states. Do not duplicate the whole dashboard or show fake data as live user content.

### 8. Recently deleted screen

> Design the NoteCraft Recently deleted screen at `/trash` within the shared shell. Visually distinguish deleted notes from active notes and briefly explain the retention/restore behavior without inventing a retention period. Each deleted item should expose **Restore** and **Delete permanently**. Require confirmation before permanent deletion, show action feedback, and provide clear empty/loading/error states. If trash/restore is not implemented, identify this as a demo or do not present nonfunctional actions.

### 9. Profile screen

> Design the NoteCraft Profile screen at `/profile` within the shared shell. Include a page heading, profile avatar/initials, editable display name, email address, and clearly labeled save/cancel actions. Add an account security section that can support password changes, but do not expose a fake password-update interaction. Include loading, validation, save success, and service-error states. Keep personal information private and avoid displaying unnecessary account data.

### 10. Settings screen

> Design the NoteCraft Settings screen at `/settings` within the shared shell. Use a simple grouped layout for appearance (light/dark/system only if implemented), account preferences, and security options. Every visible setting must either work or be clearly marked as unavailable/demo; do not use decorative toggles that cannot change state. Provide save/confirmation feedback if settings persist, accessible toggle labels, and responsive layout. Keep sign-out in the user menu or account section and include a confirmation only if the product requires it.

### 11. Shared navigation, mobile menu, and user menu

> Build reusable NoteCraft navigation for all authenticated screens. On desktop use a compact sidebar with active-route state, All notes, Favorites, Recently deleted, and a prominent New note link. The top bar should include global search and a user avatar menu with Profile, Settings, and Sign out. On mobile, replace the sidebar with an accessible drawer or compact menu; support escape-to-close, focus visibility, and return focus to the trigger. Keep the create action visible and convenient. Use real links for navigation, buttons for actions, and do not show authenticated navigation on sign-in or sign-up pages.

### 12. Not-found and unavailable-note screens

> Design a NoteCraft-branded not-found screen consistent with the rest of the product. Use a concise heading and explanation, a primary action to return to All notes, and a secondary action to create a note. For an unavailable note, preserve the note context with a helpful message when appropriate. Avoid a dead end, unnecessary decoration, or showing authenticated routes as accessible to a signed-out user.

### 13. Shared dialogs, toasts, and UI states

> Create reusable NoteCraft UI patterns for confirmation dialogs, toast notifications, form errors, loading skeletons, empty states, and recoverable errors. Use a confirmation dialog for destructive actions unless an undo pattern is provided. Dialogs must be keyboard accessible, manage focus, close appropriately, and return focus to their trigger. Toasts should be concise and not be the only way important errors are communicated. Include success, warning, and failure variants with adequate contrast, reduced-motion support, and consistent spacing.

### Suggested implementation order

1. Establish shared tokens, typography, buttons, form controls, cards, and responsive app shell.
2. Implement sign-up and sign-in layouts.
3. Implement dashboard and reusable note item/card.
4. Implement create/edit editor and note detail.
5. Add Favorites, Recently deleted, Profile, Settings, and not-found states.
6. Connect interactions to the existing Redux/localStorage behavior where it fits, label demo-only behavior, and verify routes, mobile layouts, accessibility, build, and lint.

---

## Existing project areas reviewed

- `src/App.jsx` — routes for Home, Pastes, paste detail, and not-found.
- `src/components/Home.jsx` — current paste create/edit form and text area.
- `src/components/Paste.jsx` — paste listing, title search, copy/share, edit, view, and delete actions.
- `src/components/Navbar.jsx` — current Home/Pastes navigation.
- `src/components/ViewPaste.jsx` — current paste detail view.
- `src/components/NotFound.jsx` — current 404 screen.
- `src/store.js` and `src/redux/pasteSlice.js` — Redux state with browser localStorage persistence.
- `src/index.css` and `src/App.css` — current global and app styling.
- `package.json` — React/Vite/Tailwind/Redux/Router/Lucide dependencies; no auth, rich-text editor, backend, or test runner dependencies are configured.
