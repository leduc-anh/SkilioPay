SkilioPay 'PayLater' – Test Dataset (MVP)
Generated: 2025-11-06 UTC

FILES
- paylater_users.csv       : sample users w/ eligibility fields
- paylater_carts.csv       : carts incl. totals and threshold notes
- paylater_scenarios.csv   : scenario outcomes for instalments 1–3
- paylater_seed_fixtures.json : combined JSON fixtures for easy seeding

ELIGIBILITY RULES (MVP)
- verified == True
- prior_successful_txns >= 1
- has_payment_method == True
- cart total >= eligible_threshold (30.0 USD)

OUTCOME LEGEND
success                : charge succeeds -> status PAID
upcoming               : scheduled for future (no attempt yet)
fail                   : charge fails -> status FAILED
fail_then_retry_success: initial fail then retry should succeed
fail_then_retry_fail   : initial fail then retry should fail
skip                   : no attempt (ineligible or PayLater hidden)

SUGGESTED SEEDING FLOW
1) Load users and carts into your mock store.
2) When a scenario is selected, enforce eligibility rules:
   - If ineligible, block flow and log reason; mark outcomes as 'skip'.
3) On checkout, create agreement with schedule at [t0, t0+30d, t0+60d].
4) Apply scenario outcomes to #1 charge immediately (success/fail/skip).
5) Expose a developer toggle to trigger fails/retries for instalment #1.
6) Persist activity log events for auditing.

Happy testing!
