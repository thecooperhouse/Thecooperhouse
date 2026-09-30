# Motorsport website maintenance

The following owner-authorised instructions are the durable operating brief. Use the current repository and connected cloud access on every run. Do not depend on a previous chat or local user credentials.

Maintain my Formula 1 and MotoGP website every Monday at 12:00 noon in Australia/Brisbane (AEST, UTC+10).

Repository: https://github.com/thecooperhouse/Thecooperhouse
Branch: main
Main page: motorsport/index.html
Published website: https://thecooperhouse.xyz/motorsport/

Run entirely in the cloud using connected GitHub access and available cloud tools. Do not depend on my computer, its files, or credentials stored locally. Treat the repository and these instructions as the durable source of context.

I authorise the recurring research, corrections, photo changes, probability recalculation, archiving, commits and pushes necessary to maintain this website. Make routine decisions independently. Observe platform permissions and report any access or approval that prevents completion.

On every run:

1. Inspect the current repository and fetch the latest main before making changes. Read any repository instructions. Preserve unrelated changes and existing archives. Never force-push. Confirm that the available GitHub tools can write to this repository; if they cannot, complete the research and prepare downloadable updated files, then explain the missing capability.

2. Verify and update both series using current official sources wherever possible: race and Sprint results, final classifications, penalties, podiums, fastest laps, championship standings, points, calendars, remaining events, teams, drivers/riders and upcoming session times. Convert viewing times to Australia/Brisbane and show the correct date and day. Identify the current season and latest completed weekend independently for each series. Check points arithmetic and distinguish official race lap records from other records.

3. Refresh the news with concise original summaries and direct source links. Prefer official organiser and team announcements. Check publication dates and whether earlier reports have been superseded. Clearly distinguish confirmed facts, reporting and rumours. Resolve discrepancies using additional reliable sources. Mark or omit facts that cannot be verified. Do not claim that all details were checked unless they actually were.

4. Replace one Formula 1 photo and one MotoGP photo each week when suitable, verifiably licensed alternatives are available. Prefer Wikimedia Commons images with CC0 or CC BY licences. Check each individual image’s licence and creator; a search result alone is insufficient. Include visible creator credit, source link, exact licence name/version and licence link, plus any modification disclosure. Honour all applicable licence conditions. Label historical photographs with their event and year. Use modest image sizes and unique filenames, update motorsport/photos/CREDITS.md, and preserve images and credits needed by archived pages. If no suitable replacement is available, retain the existing licensed photograph and report the exception.

5. Actually recalculate the championship probabilities using executable, reproducible code. The earlier page contained inherited percentages that had not been independently validated; do not treat those as a working simulation. Inspect the repository for an existing model. Validate and reuse it when credible. Otherwise implement a documented model using reliable historical/current inputs, the remaining calendar, current scoring rules including Sprints, retirements and championship tie-breaks. Explain assumptions and uncertainty. Run at least 200,000 simulations per championship with a recorded seed. Save the code, inputs, model version, seed, simulation count, calculation time and outputs in the repository so future runs can reproduce them. Check model invariants and historical performance where sufficient data exists. Calculate mathematical eligibility and maximum possible points separately from simulated chances. Do not equate zero simulated wins with mathematical elimination. Avoid false precision. If a credible calculation cannot be completed, clearly label the probabilities unavailable or last calculated, and report why; never invent percentages or claim a simulation was run when it was not.

6. Preserve the simple layout and one “watched” checkbox per series. By default, protect the latest completed weekend’s race and Sprint results, standings, championship analysis and revealing news until the visitor marks that series as watched. Keep older race results accessible. Store the watched choice against the specific event so a previous choice cannot reveal a newly completed race. Check photo captions, headings, footer, notes, tooltips and accessibility text for spoiler leaks. During weeks without a race, continue protecting the existing latest weekend.

7. Before replacing the page, archive the exact previous index under a unique version/date filename within motorsport. Preserve its referenced assets and existing archives. Update the version/date and provide an archive link with a warning about spoilers and superseded information. Limit changes to the dashboard and its necessary supporting files.

8. Validate the update before publishing: source consistency, points arithmetic, probability calculations, JavaScript, image loading, licence credits, links, desktop/mobile layout, keyboard navigation, tabs and spoiler defaults/reveal/hide/persistence. Use available automated checks and visual inspection where supported. Report material checks that could not be performed.

9. Commit and push verified changes to main. Recheck the remote branch before pushing to avoid overwriting concurrent work. Confirm the remote commit, deployment status and live page/assets. If validation fails, leave the last working publication intact. If deployment fails after the push, report the failure accurately and preserve the work for recovery.

After publication, give me a concise update with the live link, the main changes, the probability model’s calculation date and any unresolved limitations. Keep the notification spoiler-free: do not disclose winners, podiums, championship leaders or revealing headlines in it.

Report failures or anything requiring my action. Stay quiet if there is no meaningful change and no required action. Do not create additional schedules or message other people.

## Repository notes for future runs

- The scheduled task already exists. Update that task if needed; do not create a duplicate. Schedule: Mondays at 12:00 in `Australia/Brisbane` (UTC+10).
- GitHub Pages publishes `main` automatically. Inspect the latest main and repository instructions, then recheck the remote parent before a non-forced branch update.
- v16 introduced the first independently executed, saved probability model. See `model/README.md`. Earlier archived percentages are not validated inputs.
- `model/inputs-2026-09-30.json` preserves the verified result facts, source URLs and downloaded source hashes used in this edition. Refresh the factual inputs and review model assumptions on every future run.
- The watched storage key is `raceboard:watched:v3`; choices are boolean values under the exact series, season and event identifier. New events must have new identifiers. Keep one checkbox per series and retain protection in non-race weeks.
- Preserve old photos, credits and all archived pages. Before replacing `index.html`, archive its exact bytes under a new unique filename; the existing v15 archive is an exact copy of the prior published blob.
- Keep all maintenance changes within `motorsport/` and its necessary supporting files. Verify deployment and the public page/assets before reporting publication.

## Known limitations of v16

- F1 Sprint fastest laps were not independently verified; they are explicitly omitted. GP fastest laps and MotoGP GP/Sprint fastest laps were checked.
- Penalties reflected by the final result sheets and the explicitly cited announcements were checked. There was no separate exhaustive audit of every stewards' decision.
- The empirical probability model has five rolling held-out GP diagnostics, but no completed-season championship calibration. Its finite observed outcomes, injury/entry assumptions and exchangeable-track assumption limit interpretation.
