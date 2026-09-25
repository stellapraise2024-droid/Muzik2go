# BETA CHECKLIST (Phase 5 exit)

## Must pass
- [ ] Airplane mode record → reconnect → auto-upload, 0 loss
- [ ] Incoming call during record → take kept + resumable
- [ ] Low storage (<200MB) → quota warning, guided error, no crash
- [ ] Denied mic → primer + settings link, no dead end
- [ ] Delete project/account → R2 + DB purged (verify keys gone)
- [ ] AI consent shown before first Analyze; disclosure per report
- [ ] 10–20 testers complete Practice→Record→Analyze→Improve→Export unaided
- [ ] Crash-free >99.5%, analysis p95 <20s (60s vocal)

## Privacy (§28)
Private-by-default audit done. No public link unless explicit export. Training-data opt-out documented.

## Telemetry
Funnel instrumented: project_created → practice_done → record_saved → analysis_done → improve_done → export_done.
