---
name: rollback-recovery
description: Execute rollback to previous known-good state
description: Recover from failed deployments
version: 1.0.0
permission: runtime
---

# rollback-recovery

Execute rollback to previous known-good state when deployment fails or constitution violations detected.

## When to Use

- Health checks failing after deploy
- Error rate spike detected
- 888_HOLD issued post-deploy
- User reports critical breakage

## Rollback Methods

### Static Sites
```bash
git revert HEAD
git push origin main
```

### WebMCP Sites
```bash
# Rollback static part
git revert HEAD
git push

# MCP bridge rollback (if needed)
docker compose down
docker compose up -d --rollback
```

### Edge Functions
```bash
wrangler rollback
```

### Runtime (Docker)
```bash
# Tag-based rollback
docker pull <image>:<last-good-tag>
docker compose up -d
```

## Verification

After rollback:
```
□ Health check passes
□ Error rate returns to baseline
□ Trinity nav loads
□ No 5xx errors
```

## Output

```yaml
rollback:
  status: [SUCCESS|FAILURE|PARTIAL]
  method: "Which rollback was used"
  time_to_recovery: "seconds"
  
verification:
  health_check: [PASS|FAIL]
  error_rate: "current %"
  
incident_log:
  trigger: "What caused rollback"
  deployment: "Failed deployment SHA"
  rollback_to: "Good deployment SHA"
  duration: "Time from trigger to recovery"
```

## Post-Rollback

1. Log incident to docs/deployments/incidents.log
2. Notify relevant agents
3. Hold further deploys until root cause analyzed
4. Schedule post-mortem
