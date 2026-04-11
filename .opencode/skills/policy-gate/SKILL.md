---
name: policy-gate
description: Check if action complies with arif-sites policy and constitution
description: Validate actions against deployment policy
version: 1.0.0
permission: planning
---

# policy-gate

Check if a proposed action complies with arif-sites deployment policy and arifOS constitutional constraints.

## When to Use

- Before any deployment action
- When uncertain about permissions
- Escalation decisions
- Risk assessment

## Checks

1. **Agent Permission**
   - Does agent have required role?
   - Is action within agent's lane permissions?

2. **Constitutional Floors**
   - F1: Is action reversible?
   - F2: Is action grounded in committed code?
   - F7: Is uncertainty quantified?
   - F9: Any deception or hidden state?
   - F11: Is action auditable?

3. **Deployment Lane**
   - Is target lane appropriate for site?
   - Are prerequisites met?

## Output

```yaml
verdict: [PROCEED|HOLD|VOID]
verdict_code: "888_PROCEED|888_HOLD|888_VOID"

checks:
  permission:
    agent_allowed: boolean
    lane_allowed: boolean
  constitution:
    f1_reversible: { passed: boolean, details: "..." }
    f2_grounded: { passed: boolean, details: "..." }
    f7_humility: { passed: boolean, uncertainty: "..." }
    f9_anti_hantu: { passed: boolean, details: "..." }
    f11_auditable: { passed: boolean, details: "..." }
    
blockers: ["List of constitutional violations"]
escalation_path: "What to do if HOLD"
```

## On HOLD

If verdict is 888_HOLD:
1. Do not proceed
2. Log the hold reason
3. Escalate to appropriate authority
4. Await clearance
