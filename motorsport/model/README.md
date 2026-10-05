# Reproducible championship estimates

v17 continues the independently executed **experimental empirical Bayesian weekend bootstrap**, version `weekend-bootstrap-1.0.1`. Version 1.0.1 adds the scored Japanese GP substitute to the documented future-seat mapping; the underlying method is unchanged.

The estimates are conditional on the documented model and entry assumptions. They have not been calibrated against completed historical championships. Finite observed outcomes cannot represent every mathematically possible upset. **Zero simulated titles is not mathematical elimination.**

## Reproduce the saved edition

Use Python 3.12.14 and NumPy 2.3.5 for the recorded environment. From this directory:

```bash
python -m pip install -r requirements.txt
python championship_model.py --inputs inputs-2026-10-05.json --output reproduced.json --simulations 200000 --seed 20261005 --half-life 5 --concentration 15 --batch-size 10000
```

F1 uses seed `20261005`; MotoGP uses `20261006`. Each championship runs 200,000 trials. F1 constructors use the same 200,000 driver-outcome paths. The generator is NumPy `PCG64`; batch size is part of the reproducibility parameters. Calculation timestamps and elapsed time change on a rerun; entrant title counts, probabilities, eligibility and diagnostics must match for the recorded environment and inputs.

The output records model version, UTC calculation time, elapsed seconds, Python/NumPy versions, code and input SHA-256 hashes, seeds, simulation count, parameters, checks and results. Inputs preserve result facts, official source URLs, downloaded-source hashes, calendars, scoring-rule references, viewing-time conversions and entry assumptions. Full organiser pages and PDFs are not republished.

## Inputs and rules

- Sixteen completed 2026 GPs per series, five completed F1 Sprints and sixteen MotoGP Sprints. All published session points reconcile with current standings; F1 driver and constructor totals also reconcile. Final results and penalties are used, including the Monaco appeal outcome and the final Catalunya restart sheet.
- F1 GP scoring: 25, 18, 15, 12, 10, 8, 6, 4, 2, 1. Sprint: 8 through 1. No fastest-lap bonus. Source: FIA 2026 General Provisions issue 03, articles A2.1–A2.2; Sporting Regulations issue 08 for classification rules.
- MotoGP GP scoring: 25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1. Sprint: 12, 9, 7, 6, 5, 4, 3, 2, 1. Source: FIM Grand Prix Sporting Regulations updated 13 September 2026, article 1.28.
- F1 championship ties compare counts of GP first places, then second places and so on, followed by qualifying counts under article A2.1.4(c). MotoGP compares GP finishing counts, excluding Sprint placings, then the latest date of the highest achieved GP place under article 1.28.7. Any unresolved simulated tie is explicitly counted rather than randomly assigned.
- Seven F1 GPs and one F1 Sprint remain in these inputs; six MotoGP GPs and six Sprints remain. All sessions are assumed to run for full points. Reduced-distance points and future calendar changes require refreshed inputs/model handling.

## How the simulation works

1. Build complete finishing-position vectors from official classified results. Unclassified, retired or absent entrants receive position zero and no points; a classified F1 retirement retains the official place. Historical countbacks keep the entrant/team that actually scored the result.
2. Map historical substitute outcomes to the regular seat for future scenarios. F1 Lawson/Red Bull maps to Hadjar; Tsunoda/Racing Bulls maps to Lawson. Gresini replacements map to the absent regular Gresini rider in that session. The code explicitly maps the other observed substitutes. Wildcards without a regular seat are removed and the remaining classified places compacted. A regular rider absent without a substitute remains a non-scoring sampled outcome. This introduces uncertainty when injury recovery differs from the observed season.
3. Give recent weekends more weight, with a five-weekend half-life. For each simulated remainder, draw one vector of weekend weights from a Dirichlet distribution with concentration 15. This produces persistent form uncertainty across that simulated season.
4. Draw each future weekend from those weights. GP/Sprint/qualifying results from the same observed weekend stay linked, preserving empirical retirement and incident correlations. An F1 Sprint weekend draws from the five observed Sprint weekends; ordinary F1 GPs draw from all sixteen. MotoGP draws from all sixteen linked GP/Sprint weekends.
5. Apply official points and countbacks. MotoGP substitute Somkiat Chantra’s Motegi result maps to Joan Mir’s regular seat only for future-scenario sampling; Chantra’s three actual points remain his. Mir is confirmed absent from Indonesia, so the round-17 override forces him to zero without inventing an unconfirmed replacement. Other future entries assume the regular grid unless inputs supply an explicit override.

## Mathematical eligibility

Maximum remaining points are calculated independently of simulation. Every listed entrant receives an upper bound assuming a start and maximum score in every remaining session, even when the simulation does not plan that entrant's participation.

If that maximum exceeds the current highest points total, the entrant is eligible on points; if lower, eliminated. Equality checks maximum possible future GP wins against current leader GP wins, with an unresolved boundary labelled for further countback. These are mathematical possibilities under the stated full-calendar/full-points assumption, not forecasts of attendance or performance. Constructor maximums use 43 GP points and 15 Sprint points per round; a team can win only one GP per round for countback.

## Validation and limits

The code checks entrant uniqueness, official scoring, session/standings arithmetic, F1 constructor/driver conservation, per-entrant point bounds, one champion or an explicit unresolved tie per trial, no simulated titles for mathematically eliminated entrants, and constructed tie-break cases. The integer mask used in countback has a dedicated regression check after an invariant caught a NumPy int16 sentinel overflow during development. No failed development run is reported as a completed calculation.

Five rolling held-out GPs are checked against forecasts trained only on preceding weekends. Output records the multiclass winner Brier score and mean absolute race-points error. These are small-sample diagnostics of race forecasts; they do **not** establish championship calibration or prove that the model outperforms another forecast. There is no completed-championship backtest in this dataset.

Tracks are exchangeable; there is no track-specific pace forecast, weather model, explicit development trend, future grid penalty forecast, team-order model or medical forecast. The observed retirement/incident distribution and injury absences recur in sampled outcomes. A Dirichlet form draw expresses some uncertainty but does not repair missing scenarios or validate the half-life and concentration choices. Monte Carlo sampling error is much smaller than these structural uncertainties; the dashboard rounds displayed chances to whole percentages and groups values below 1%.

Future runs must refresh official inputs, review substitute mappings and calendar/rules changes, rerun at least 200,000 trials per championship, archive dated inputs/outputs, and repeat meaningful checks before publishing.
