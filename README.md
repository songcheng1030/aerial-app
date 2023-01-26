[![Node.js CI Lint](https://github.com/tianhuil/aerial-app/actions/workflows/lint.yaml/badge.svg)](https://github.com/tianhuil/aerial-app/actions/workflows/lint.yaml)
[![Node.js CI Lint](https://github.com/tianhuil/aerial-app/actions/workflows/lint.yaml/badge.svg)](https://github.com/tianhuil/aerial-app/actions/workflows/lint.yaml)

# Getting Started
First, add the following to `.env.local` (which is not commited to git):

```
MONGODB_URI=stub
MONGODB_DB=stub
AWS_S3_ACCESS_KEY_ID=stub
AWS_S3_SECRET_KEY=stub
AWS_S3_BUCKET=stub
PDF_TRON_SECRET=stub
VERCEL_URL=localhost:3000
```

Now you can run the development server:

```bash
pnpm install && pnpm run dev
```

There are also

```bash
pnpm run build
pnpm run test
```

## Firestore
For development, we use the firestore emulator.  To use it:
1. Run the `emulator` script: `pnpm run emulator`.  This will continue to run in the window.
2. Seed the emulator by running `pnpm run seed`.
3. The development server should be able to connect.


# Branches
The `main` branch only contains the marketing page and deploys to https://app.aerialops.io.  Be careful when pushing to main because this is the primary branch.
The `staging` branch contains both the marketing page (an outdated version) and the demo code, which can be found https://app-staging.aerialops.io.  Feel free to update it as it's used as an internal resource.

# Database Structure
The database is composed of three types of objects:
1. `Doc` [lib/schema/docs.ts]: each document has a `type` and some basic information about the document.  Each doc has a (possibly empty) array of foreign keys `Counterparty`.
2. `Counterparty`: these are the people who sign the doc.  They consist of a required non-empty name field and an optional email field. 
3. `Relation` [lib/schema/relation.ts]: These represent a legal relationship (e.g. employment agreement or business license to operate in a US state).  Relations may have counterparties (like docs).  They will have
    - Relation-specific `Metadata` fields.  Metadata is stored on on `Relation` (not `Doc`) but each instance points (foreign key) to a `Doc` (the source of the data).
    - A list of `Doc`s (foreign keys) that are associated with the `Relation`.
    - The logic about which metadata is necessary, which doc are required as stored on a singleton object that corresponds to each `Relation`.
For the specifics about `Relation` and `Doc`, see this [Notion Document](https://www.notion.so/Database-Design-2b938a5dddd54ea08b95a1294ecfd963).

### Performance considerations
Documents are primarily viewed by `Relation` and secondarily viewed by `Doc`.  However, the information for a `Relation` is updated from a `Doc` view (the use case is that a person will see lots of new docs and need to label them, creating the associated `Relation` with time).

### Example
For example, the 409A valuation Relation has two documents: a Board Consent and the actual 409A valuation document.  It has a `startDate` and a `price` (which both derive from the valuation document).  The board consent is necessary but does not really provide metadata.

### Corner cases
- Almost every `Doc` has one and only one function.  The exception are Board and Stockholder consents.  These are effectively free-form documents that can perform multiple actions at multiple times.  For example, a single board consent document can simultaneously elect an officer to take office next week or ratify an advisor from last month.  By storing `Metadata` on the `Relation` not `Doc`, we can guarantee the type of the metadata more strongly (e.g. `OfficerRelation` knows what ).
- Most information is associated with a specific relation except corporate information is just about the company (e.g. EIN number of company founding date).  There is a singleton `Corporation` object that holds this information.

### Schema
We are using `zod` slightly beyond its intended purpose.  Objects are serialized (stored in Firestore / sent from the backend to the frontend) via is a parsimonious format.  They are enriched when programmers need to use them on the client.  To enrich the objects, we use the transform method to add fields:
```ts
const Relation = z.object(...).transform(async (obj) => ({...obj, fullName: obj.firstName + ' ' + obj.lastName, doc: await a.docRef}))

const parsedData = await Relation.parseAsync(data)
```
Notice that the sub-objects in a relation may also have their own transforms.  Calling `parseAsync` on the parent object will execute `transform` recursively on both the parent `transform` as well as the sub object `transform`.  We keep track of both the input (pre-transform) and output (post-transform) objects (see `FirestoreCrud` in `lib/crud/index.ts`) so that we can verify the 

See `lib/schema/relation.ts` for examples of how we create and transform such `Relation`s, in particular `class RelationEnricher`.  Notice that we use this mechanism to both
1. add helper methods data (e.g. `fullName = obj.firstName + ' ' + obj.lastName`)
2. add actual documents by performing a database fetch (`doc = await a.docRef`).

## Inexplicable
- You cannot add an `<ActionIcon>` to the icons on Navbar.  It puts the `<main/>` tag twice.  This was fixed in commit 8e33d603beb779ec20d27d683ce3d19c3153bebd (which partially reverted) commit ac2e2aad23316e76f5055cd33928a01c621bb14b.  `<ActionIcon>` is used elsewhere so I'm not sure what's going on.

- You cannot centralize setting of the random seed, they must be set per page (see archive/set-random-seed-once).  The server and client do not compute through files in the same order so the randomness will yield different keys on the client and server.

- `<LoginRequired>` must be placed in `_app.tsx`, not in `Layout` (fixed in [this PR](https://github.com/tianhuil/aerial-app/pull/18)).  It appears to have something to do with keeping state between navigation changes (see the advantages of `_app.tsx` from [NextJS](https://nextjs.org/docs/advanced-features/custom-app)).


# Mantine Next Template

Get started with Mantine + Next with just a few button clicks.
Click `Use this template` button at the header of repository or [follow this link](https://github.com/mantinedev/mantine-next-template/generate) and
create new repository with `@mantine` packages. Note that you have to be logged in to GitHub to generate template.

## Features

This template comes with several essential features:

- Server side rendering setup for Mantine
- Color scheme is stored in cookie to avoid color scheme mismatch after hydration
- Storybook with color scheme toggle
- Jest with react testing library
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## npm scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `export` – exports static website to `out` folder
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
