# Branch Archive Plan — arif-sites

| Branch | Status | Recommendation | Reason |
|--------|--------|----------------|--------|
| `main` | active | keep | primary |
| `master` | archive | archive only | 292 behind |
| `consolidation-backup` | active | keep | manual backup |

## Cleanup Commands
```bash
# To archive a branch locally before deletion:
git checkout <branch>
git tag archive/<branch>
git checkout main
git branch -D <branch>

# To delete remote (888_HOLD):
# git push origin --delete <branch>
```
