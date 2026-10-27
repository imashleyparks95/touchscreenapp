# Little Big Arcade 5.6.0 — Math Quest breadth and challenge

October 25, 2026. Updates only Math Quest and its shared release/instruction integration. Other game implementations are unchanged.

## Content expansion

Selectable skills increased from 89 to 199. Each practice skill has a working question generator, hints and worked steps; additions are not menu-only labels.

| Grade | Selectable skills |
|---|---:|
| Kindergarten | 21 |
| 1 | 21 |
| 2 | 22 |
| 3 | 29 (including eight individually tracked times tables) |
| 4 | 22 |
| 5 | 21 |
| 6 | 21 |
| 7 | 20 |
| 8 | 22 |

Subject categories organize Number & place value, Operations & problem solving, Fractions & decimals, Measurement & time, Geometry, Ratios & percentages, Algebra & patterns, Data & probability, and explicitly labeled extra practice. A grade shows only relevant categories. Practice can target an entire subject or an individual skill. Mixed questions rotate subjects before repeating them.

New examples include teen numbers, number bonds, solid shapes, position, three-addend sums, regrouping, expanded form, elapsed time, fraction number lines, mixed numbers, decimal multiplication/division, composite volume, unit rates, part-to-whole ratios, percent reversal, inequalities, signed fraction operations, dependent compound probability, function tables, exponent rules, root estimation, dilations and solid volumes.

## Challenge correction

- Ingredient ratios always use unequal quantities. Normal uses fractional scaling; Hard adds part-to-whole and multi-step reasoning. Grade 7 Hard includes ratios of fractional quantities.
- Existing higher-grade story questions now use grade-specific decimal, rate and signed-money reasoning instead of repeating elementary marker-box stories.
- New Adaptive skills begin at standard complexity (level 1). Mistakes can lower complexity; independent correct answers support advancement. Hints alone do not promote a skill, including multiplication fact families.
- Normal/Hard basic arithmetic avoids zero-addend and self-subtraction shortcuts where appropriate. Grade 6 equations include permitted one-step decimal coefficients.
- Existing skill IDs, progress, scores, multiplayer, handwriting and backup compatibility remain. New settings are optional additions to the existing profile schema.

## Checks

```bash
npm test
node tests/math-expansion.mjs
node tests/quest-games.mjs
node tests/quest-controllers.mjs
node tests/offline.mjs
git diff --check
```

All 20 suites passed. Focused suites passed again after final taxonomy and tutorial-label refinements.

The new suite exercises 119,400 questions (199 skills × 3 levels × 200 samples), including 54,600 independent answer audits. It checks numeric formulas, fraction equivalence, quotient/remainder reconstruction, elapsed-time arithmetic, GCF/LCM, root bounds, function-table validity, sign reversal in inequalities, unique correct choices, finite diagrams, no 1:1 ingredient ratios, adaptive behavior, preserved IDs, subject filtering and mixed rotation. The existing question suite additionally checks 47,760 grade/skill/level questions and the unchanged gladiator career.

Browser checks covered all nine grade menus and counts, subject filtering, mandatory instructions, a correctly scored multi-step Hard Grade 6 ratio (4:7, 44 cups total, add 5 cups milk → 33), minute-by-minute clock controls, keypad time entry (4:05 + 36 minutes → 4:41), and solid-shape illustration/selection. No application-origin console errors were observed.

Physical Windows touchscreen/stylus and actual device speech/speaker output were not tested in the cloud browser.

## Curriculum reference

Selected skills use the NC DPI 2017 SCOS currently used for instruction. The expansion also corrects the Grade 6 percent standard identifier to NC.6.RP.4. Grade 3 customary measures and within-hour elapsed time are distinguished from Grade 4 metric conversions and across-hour time.

https://www.dpi.nc.gov/documents/publications/catalog/ma196-vertical-progression-math/open
