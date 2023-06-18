# OSSF Scorecard Score Should Be Above 7

policy name: scorecard_score_too_low

severity: MEDIUM

## Description

Scorecard is an open-source tool from the OSSF that helps to asses the security
posture of repositories. A low scorecard score means your repository may be at
risk.

## Threat Example(s)

A low Scorecard score can indicate that the repository is more vulnerable to
attack than others, making it a prime attack target.

## Remediation

1. Get scorecard output by either:
2. - Run legitify with --scorecard verbose
3. - Run scorecard manually
4. Fix the failed checks
