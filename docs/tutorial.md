# Homepage tutorial

The home page opens a native video player in the existing tutorial dialog. Spanish is the default; `/en` selects the English recording. Both cuts are 81-second, 1080p videos of the real application, with text and instrumental music. No narration. Localized captions are available through the video controls.

Media is requested only after the dialog opens. Playback requires the visitor to press Play. Closing the dialog unmounts the player and stops playback. Reopening starts a new viewing attempt. Native controls support seeking, volume, fullscreen and inline mobile playback. A media error offers retry and a direct link to the same localized file.

## Analytics

Events share `schema_version`, `ui_language`, `tutorial_language`, `tutorial_provider: self_hosted` and `tutorial_version: 2026-10-v1`. They contain no viewer identifiers, room/player data or private URLs.

| Event | Meaning |
| --- | --- |
| `tutorial_opened` | The visitor opened the dialog. |
| `tutorial_begin` | The browser entered actual playback, once per opening. |
| `tutorial_engaged` | At least 80% of distinct media time was played, once per opening. Includes `watched_percent: 80`. |
| `tutorial_complete` | Playback ended after at least 99% of distinct media time was played, once per opening. |
| `tutorial_error` | The browser reported a media loading/playback failure. |

Use `tutorial_engaged` count divided by `tutorial_begin` count to estimate the fraction of playback attempts that watched most of the tutorial. Segment both counts by `tutorial_language` and `tutorial_version`. This measures attempts, not unique people or attention. Pausing/resuming does not duplicate milestones. Replaying a segment does not add coverage; seeking past a segment does not mark it watched. Browser playback speed remains user-controlled. Counts depend on analytics being available and can span reporting windows.

The existing `tutorial_begin`, `tutorial_complete`, `tutorial_opened` and `tutorial_error` names are retained. Filter provider/version when comparing against the previous YouTube tutorial; the new completion condition excludes skips. Custom events reach GA4 without a provider configuration change. Any new report or custom-dimension registration in GA4 is a separate account action.

## Assets and caching

`utils/tutorials.ts` maps locales to MP4, JPEG poster and WebVTT assets in `public/tutorials/`. Filenames contain the first 12 hex characters of the file's SHA-256 digest. The dedicated path receives `Cache-Control: public, max-age=31536000, immutable` through `next.config.js`; other assets and pages retain their existing policy. MP4 files contain their metadata before media data for progressive playback and support byte-range requests.

Publish changed content under a new digest filename and update the mapping. Never overwrite a cached filename. Preserve existing versioned assets when publishing later revisions so cached pages can still load their referenced videos. Native controls and the player replace the previous YouTube dependency.

The Spanish cut is the approved v05; the English cut uses the same composition with localized text and fresh English application recordings. Captures, render sources and detailed QA remain in the primary checkout's ignored `research/onetake-video/`. Music is original synthesized audio; fonts use their existing open font licenses. No third-party music recording was added.

## Validation

Run `npm run lint:check`, `npm run build`, `npm run validate-analytics` and `npm run ui-tests -- tests/ui/tutorial.spec.ts`. The UI suite exercises actual local MP4 playback, locale selection, deferred media requests, pause/resume, seeking/repeated ranges, engagement/completion, error recovery, close/reopen and mobile fit. Verify the deployed Preview's MP4 content type, range response and immutable cache header before delivery.
