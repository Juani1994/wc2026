# Audit and Fix Group Random Results Logic

I need you to REVIEW the current implementation of the **"Random Results" button** for group stage simulations.

Do NOT assume the current implementation is correct.

The generated results are producing unrealistic outcomes too frequently.

Example of suspicious output:

```txt
Group L

1 Ghana
2 Panama
3 England
4 Croatia
```

This type of result should be possible, but extremely uncommon.

Currently it appears much more often than expected.

Your task is to AUDIT the algorithm and determine why.

---

# Goal

The simulator should use **weighted probabilities based on FIFA team strength**.

Higher-ranked national teams should generally perform better.

Underdogs must still be able to upset stronger teams.

However:

The simulation should NOT behave like uniform random.

---

# Required Audit

First:

inspect the CURRENT implementation.

Identify:

1. how team strength is currently calculated
2. how FIFA ranking is incorporated
3. how match probabilities are generated
4. how goals are generated
5. whether weighting is actually influencing results correctly

Do not rewrite immediately.

First explain what the existing algorithm does.

---

# Expected Behaviour

Desired characteristics:

## Strong teams

Examples:

England
France
Brazil
Argentina
Spain

Should:

* win more often
* finish 1st/2nd more frequently
* still occasionally disappoint

---

## Mid-tier teams

Examples:

Croatia
Denmark
Japan
Mexico

Should:

* be competitive
* sometimes beat favorites
* usually perform around expectation

---

## Underdogs

Examples:

Panama
Ghana
New Zealand
etc

Should:

* occasionally pull surprises
* rarely dominate a group consistently

---

# Simulation Model Requirements

Use a probabilistic approach.

Suggested model:

Convert FIFA ranking into a **strength score**.

Example:

```ts
strength =
    MAX_RANK -
    fifaRank
```

or use normalized Elo-like scaling.

Then derive:

```ts
win probability
draw probability
loss probability
```

from relative strengths.

The probability gap between:

```txt
England vs Panama
```

must be substantially larger than:

```txt
England vs Croatia
```

---

# Important Calibration Requirement

The model currently appears too noisy.

Please verify whether:

* upset probability is too high
* ranking effect is too weak
* randomization overwhelms weights
* normalization is broken
* goal generation ignores strength

---

# Diagnostic Output Required

Before changing code, provide:

## Current implementation summary

Explain how the algorithm currently works.

## Problem diagnosis

Explain WHY unrealistic outcomes are happening.

## Proposed fix

Explain the new weighting model.

Only then implement.

---

# Validation Requirement

After implementing, run a statistical sanity check.

Simulate:

```txt
England vs Panama
```

1000 times.

Show approximate percentages.

Expected behavior:

England should clearly dominate.

Example target range (not exact):

```txt
England wins: ~65–85%
Draws: ~10–20%
Panama wins: ~5–20%
```

---

Then run:

```txt
Group simulation
```

1000 times.

Verify:

England qualifies significantly more often than Panama.

Not necessarily always.

But clearly more often.

---

# Important Constraint

Do NOT make outcomes deterministic.

The simulator must still feel like football.

Favorites must still fail sometimes.

But FIFA ranking weights must be meaningfully visible in the generated results.
