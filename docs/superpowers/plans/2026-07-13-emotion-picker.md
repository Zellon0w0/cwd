# Emotion Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add configurable OwO-style emotion packs to backend settings, admin settings UI, and the frontend comment widget.

**Architecture:** Store the emotion JSON string as a feature setting, expose it through the existing public config endpoint, and parse/render it inside the widget. Do not ship a runtime default emotion pack; empty or invalid `emotionJson` means the widget hides the emotion button.

**Tech Stack:** Cloudflare Workers, Hono, D1 Settings table, Vitest, Vue 3, Vite, vanilla JS widget components.

## Global Constraints

- Use the existing `FeatureSettings` path instead of adding new settings endpoints.
- Do not execute or trust custom JSON beyond data parsing.
- Preserve existing Markdown and XSS sanitization.
- Do not add dependencies.
- Follow `.prettierrc`: tabs, semicolons, single quotes, LF.

---

### Task 1: Backend Emotion Setting

**Files:**
- Modify: `cwd-api/src/utils/featureSettings.ts`
- Modify: `cwd-api/src/api/admin/featureSettings.ts`
- Test: `cwd-api/src/utils/featureSettings.spec.ts`

**Interfaces:**
- Produces: `FeatureSettings.emotionJson?: string`
- Produces: `FEATURE_EMOTION_JSON_KEY = 'comment_feature_emotion_json'`
- Produces: `assertValidEmotionJson(value: string): string`

- [ ] Write failing tests for loading/saving `emotionJson` and rejecting invalid JSON.
- [ ] Run `cd cwd-api && pnpm test src/utils/featureSettings.spec.ts` and verify failure.
- [ ] Add the setting key, type field, load/save behavior, and validation helper.
- [ ] Validate `body.emotionJson` in `updateFeatureSettings`.
- [ ] Run `cd cwd-api && pnpm test src/utils/featureSettings.spec.ts`.

### Task 2: Admin Feature Settings UI

**Files:**
- Modify: `cwd-admin/src/api/admin.ts`
- Modify: `cwd-admin/src/views/SettingsView/index.vue`
- Modify: `cwd-admin/src/locales/*.json`

**Interfaces:**
- Consumes: `FeatureSettingsResponse.emotionJson?: string`
- Produces: `saveFeatureSettings({ emotionJson })`

- [ ] Add `emotionJson?: string` to admin API types and save payload.
- [ ] Add a textarea to the feature settings tab.
- [ ] Load and save `emotionJson` with the existing feature settings flow.
- [ ] Add locale keys `emotionJson` and `emotionJsonHint` to all admin locale files.
- [ ] Run `cd cwd-admin && npm run build`.

### Task 3: Widget Emotion Picker

**Files:**
- Create: `docs/widget/src/utils/emotions.js`
- Create: `docs/widget/src/components/EmotionPicker.js`
- Modify: `docs/widget/src/components/CommentForm.js`
- Modify: `docs/widget/src/components/ReplyEditor.js`
- Modify: `docs/widget/src/components/CommentList.js`
- Modify: `docs/widget/src/components/CommentItem.js`
- Modify: `docs/widget/src/core/CWDComments.js`
- Modify: `docs/widget/src/styles/main.css`
- Modify: `docs/widget/src/index.d.ts`

**Interfaces:**
- Produces: `parseEmotionGroups(emotionJson): Array`
- Produces: `insertTextAtCursor(textarea, value): string`
- Consumes: `props.emotionGroups`

- [ ] Add parser helpers that accept OwO group JSON and derive image URLs from item `url`, group `baseUrl`, or `/emotion/<pack>/<icon>.png`.
- [ ] Add an `EmotionPicker` component with tabs and item buttons.
- [ ] Add picker support to `CommentForm` and insert at the textarea cursor.
- [ ] Add picker support to `ReplyEditor` and propagate content updates.
- [ ] Pass `emotionGroups` from `CWDComments` through `CommentList` to each reply editor.
- [ ] Add CSS for the toolbar, popover, tabs, and image/text grid.
- [ ] Add `emotionJson?: string` to widget config types.
- [ ] Run `cd docs/widget && npm run build`.

### Task 4: Static Emotion Assets and Final Verification

**Files:**
- Modify if needed: `docs/build.js`
- Verify: optional generated emotion JSON and static image assets

**Interfaces:**
- Ensures: deployed docs can serve `/emotion/<pack>/<icon>.png` when a configured emotion JSON references the copied static assets.

- [ ] Check whether docs build copies `emotion/` into the docs public output.
- [ ] If needed, update `docs/build.js` to copy `emotion/` without `.DS_Store`.
- [ ] Run `node emotion/generate-owo.cjs`.
- [ ] Run `cd cwd-api && pnpm test`.
- [ ] Run `cd cwd-admin && npm run build`.
- [ ] Run `cd docs/widget && npm run build`.
