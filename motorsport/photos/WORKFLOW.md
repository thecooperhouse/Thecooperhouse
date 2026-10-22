# Photo replacement through connected cloud GitHub access

The GitHub connection has a binary-safe Git blob operation. The UTF-8-only `create_file` and `update_file` tools are not the appropriate operations for photographs. On 22 October 2026, uploading the existing 196,934-byte JPEG through `create_blob` with `encoding: "base64"` returned its original blob SHA, `eadb950104071df4978a76c537537eab87fee065`. This verified byte-preserving binary writes without changing a branch or duplicating the photograph. It did not verify a new photograph's licence or download availability.

For each replacement:

1. Open the individual Wikimedia Commons file page and verify the creator, event/year and exact licence. Prefer CC0 or CC BY. Record the source page, licence URL, date checked and any modifications. A search snippet is not a licensing record.
2. Download a modest thumbnail to the cloud workspace through an available permitted download tool. Check the decoded image, dimensions, file size and SHA-256. Use a unique filename under `motorsport/photos/`. Do not depend on the owner's machine or credentials. If source download fails, report that specific failure; do not call GitHub binary publishing unavailable.
3. Base64-encode the exact image bytes and call the connected GitHub `create_blob` with the repository name, `encoding: "base64"` and that content. Compare its returned SHA with the Git blob hash of the original bytes (`SHA1("blob " + byte_length + NUL + bytes)`). Do not send the base64 text through a UTF-8 file-write tool: that would store text rather than a photograph.
4. Build a Git tree on the latest base tree, using the image blob SHAs at their unique paths. Include the updated page, appended `CREDITS.md` entries, the exact previous-page archive and supporting files in the same candidate commit. Preserve all old tree entries, archived pages and their assets. The archive entry can reference the previous `index.html` blob directly to preserve exact bytes.
5. Put the candidate commit on a maintenance branch and run the browser validation workflow. Check that the page's images decode and inspect screenshots. Visible captions must include creator, source link, exact licence/version and licence link, event/year for historical photos, and modification disclosure. Check alt text and captions for spoilers.
6. After validation, re-read `main`, verify the expected parent and update its ref with `force: false`. If it moved, incorporate the concurrent changes and test the new candidate. Confirm the remote commit, deployment and live image URLs after publication.

Use the connected GitHub tools' declared schemas rather than guessing arguments. No personal access token, new image host or new recurring schedule is needed for this approach. If suitable licensed replacements cannot be verified and downloaded, retain the current licensed photos and accurately report the exception.

References: [GitHub Git blob API](https://docs.github.com/en/rest/git/blobs), [Commons re-use guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia). The recorded licence and creator for each individual file remain authoritative for that file.
