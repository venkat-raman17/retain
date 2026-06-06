# Research Integration Checklist

This checklist helps the Retain team integrate the wisdom traditions research into app content and development.

---

## Phase 1: Review & Familiarity (1–2 hours)

- [ ] **Product Lead:** Read RESEARCH_SUMMARY.md (5 min overview)
- [ ] **Content Writers:** Read WISDOM_TRADITIONS_RESEARCH.md (full research; 30–45 min)
- [ ] **Content Writers:** Read CONTENT_LINEAGES_GUIDE.md (templates and examples; 20–30 min)
- [ ] **Content Safety Reviewer:** Review the Guardrail Library and Checklist in CONTENT_LINEAGES_GUIDE.md
- [ ] **Team Sync:** Discuss key findings and raise questions (30 min)

---

## Phase 2: Content Planning (1–2 hours)

- [ ] **Content Lead:** Decide which 3–5 traditions to prioritize for initial Studies/Rites
  - *Recommendation:* Start with Stoicism, Buddhist Sense Restraint, Sufism, Daoism (strongest alignment with Retain's framing)
- [ ] **Content Writers:** Draft outlines for 3 new Studies using CONTENT_LINEAGES_GUIDE.md templates
- [ ] **Content Lead:** Review outlines for philosophical accuracy and guardrail coverage
- [ ] **Assign writers and deadlines** for first Studies (target: 1 new Study per week)

---

## Phase 3: Content Development (2–4 weeks)

### Study #1: [Tradition Name]
- [ ] Draft Study using template from CONTENT_LINEAGES_GUIDE.md
- [ ] Self-check against Content Safety Checklist
- [ ] Submit for peer review (another writer or product person)
- [ ] Revise based on feedback
- [ ] Add to `src/content/bundled/studies/index.ts`
- [ ] Run `pnpm run verify` (typecheck, lint, test)
- [ ] Run content-safety scanner (`src/testing/content-safety.ts`)
- [ ] Final review before merge

### Study #2, #3, etc.
- [ ] Repeat Study #1 process

---

## Phase 4: Content Expansion (Optional, 4–8 weeks)

### Rites (Longer-form teachings)
- [ ] Plan 1–2 Rites (cross-tradition or deep-dive on one tradition)
- [ ] Draft using templates from CONTENT_LINEAGES_GUIDE.md
- [ ] Follow same review process as Studies
- [ ] Add to `src/content/bundled/rites/index.ts`

### Codex Enhancement
- [ ] Add lineage background to each Daily Codex day (7 days)
- [ ] Link to full Studies for optional deep-dive
- [ ] Verify cross-tradition resonances are highlighted
- [ ] Test content-safety scanner

### Principles
- [ ] Review existing principles in `src/content/bundled/principles/index.ts`
- [ ] Add new principles grounded in traditions (e.g., "The gap between impulse and choice is where freedom lives" — Stoicism)
- [ ] Ensure guardrails are present

---

## Phase 5: Safety & Quality (1–2 weeks)

- [ ] **Content Safety Scan:** Run automated scanner on all new bundled content
  - Command: `pnpm test src/content/content.test.ts`
  - Check passes with no degrading language detected
- [ ] **Guardrail Audit:** Every Study/Rite carries a guardrail line
  - Use guardrail library from CONTENT_LINEAGES_GUIDE.md or write custom if needed
- [ ] **Philosophical Accuracy Review:** Expert review (can be external scholar or trusted advisor)
  - Verify no medical claims
  - Verify no shame language
  - Verify no explicit sexual technique
  - Verify no misogyny
  - Verify no religious authority claims
  - Verify tradition is presented as inspiration, not proof
- [ ] **Copy Review:** Final pass for tone, clarity, accessibility
  - Does it sound like Retain (warm, direct, mystical but not medical)?
  - Is it understandable to a 18–40-year-old man without philosophy background?
  - Does it inspire action or just philosophy?

---

## Phase 6: Testing & Iteration (Ongoing)

- [ ] **A/B Test:** If possible, compare engagement with new tradition-based Studies vs. existing Studies
  - Which traditions resonate most with your user base?
  - Which practices do users report trying?
- [ ] **User Feedback:** Gather qualitative feedback
  - "Which Study spoke to you most?"
  - "Did any tradition change how you think about the practice?"
  - "Did any tradition feel off or not align with your experience?"
- [ ] **Iterate:** Use feedback to refine future Studies and decide which traditions to expand
  - If Stoicism resonates, deepen it (add 2–3 more Studies)
  - If a tradition falls flat, deprioritize it

---

## Phase 7: Documentation & Reference (Ongoing)

- [ ] **Update CONTENT_SAFETY.md** if guardrail rules change
  - Add any new disallowed phrases discovered
  - Add any new allowed phrases that emerge from research
- [ ] **Archive Research in Source Control**
  - These three documents are version-controlled in `docs/`
  - Add them to the project README or codebase index
- [ ] **Update Codebase Comments**
  - When adding a Study, comment the `studies/index.ts` entry with the source tradition(s)
  - Example: `// Stoicism + Buddhist sense-restraint: on the moment of choice`
- [ ] **Create a "Lineages" Reference Document**
  - Optional: A simple map of which Studies draw from which traditions
  - Useful for product roadmap and content planning

---

## Key Files & References

| File | Purpose | Audience |
| --- | --- | --- |
| WISDOM_TRADITIONS_RESEARCH.md | Full research on all 8 traditions | Content writers, researchers, scholars |
| CONTENT_LINEAGES_GUIDE.md | Templates, examples, guardrails | Content writers, product leads |
| RESEARCH_SUMMARY.md | Executive summary & key findings | Product leads, non-writers |
| RESEARCH_INTEGRATION_CHECKLIST.md | This document | Project managers, content leads |
| docs/CONTENT_SAFETY.md | Retain's existing safety rules | All writers, reviewers |
| src/testing/content-safety.ts | Automated scanner | CI/CD, testing |
| src/content/bundled/studies/index.ts | Where Studies live in code | Developers |
| src/content/bundled/rites/index.ts | Where Rites live in code | Developers |
| src/content/bundled/codex/index.ts | Daily Codex content | Content writers |

---

## Timeline Estimate

| Phase | Duration | Output |
| --- | --- | --- |
| Phase 1: Review | 1–2 hours | Team understanding |
| Phase 2: Planning | 1–2 hours | Content roadmap (3–5 Studies) |
| Phase 3: Development | 2–4 weeks | 3 new Studies |
| Phase 4: Expansion | 4–8 weeks | 1–2 Rites; enhanced Codex |
| Phase 5: Safety | 1–2 weeks | All content passes safety scan |
| Phase 6: Testing | Ongoing | User feedback, iteration |
| Phase 7: Documentation | Ongoing | Updated references, archived research |
| **Total** | **~6–10 weeks** | **3+ new Studies; 1+ Rite; 100% safety coverage** |

---

## Success Metrics

After integrating this research, Retain's content should:

1. **Philosophical Authenticity:** Draws on genuine wisdom traditions with scholarly accuracy; cites sources where appropriate.

2. **Safety Compliance:** 100% of Studies/Rites pass content-safety scanner; zero degrading language; all guardrails in place.

3. **Accessibility:** A user without philosophy background understands the teaching and can do the practice today.

4. **Inspiration Over Prescription:** Content invites exploration and practice, not obedience or belief; frames traditions as inspiration, not proof.

5. **User Engagement:** Users report that tradition-based Studies help them understand the practice more deeply and sustain motivation.

6. **Consistency:** All new content aligns with Retain's core principles (the energy is the ally, the compulsion is the enemy, the man is never the enemy).

---

## Troubleshooting

### "This feels too academic / hard to understand"
- Simplify language; use modern examples
- Reduce historical detail; focus on the practice
- Add a concrete exercise the reader can do today
- See examples in CONTENT_LINEAGES_GUIDE.md

### "What if a user doesn't believe in [tradition]?"
- Frame as inspiration, not truth
- Emphasize the practice, not the metaphysics
- Use multiple traditions so no single worldview is required
- Example guardrail: "This is philosophical inspiration, not a belief system you must adopt."

### "What if the content-safety scanner flags something?"
- Check against disallowed list in CONTENT_SAFETY.md
- If it's a false positive, document it and update the scanner
- If it's a real issue, rewrite the copy
- Escalate to content lead if unclear

### "A user says this tradition offended them"
- Take feedback seriously
- Review the content against the Guardrail Checklist in CONTENT_LINEAGES_GUIDE.md
- Rewrite if needed; aim for neutrality and philosophical grounding
- Document the issue for future content reviewers

---

## Questions to Ask Before Publishing

1. **Is this philosophical inspiration or religious authority?** (Should be the former)
2. **Is there a guardrail line?** (Should be yes)
3. **Does it contain any medical claims?** (Should be no)
4. **Does it contain shame, purity, or punishment language?** (Should be no)
5. **Does it contain explicit sexual technique?** (Should be no)
6. **Does it contain misogyny or grievance?** (Should be no)
7. **Is the practice concrete and doable today?** (Should be yes)
8. **Does it align with Retain's core principles?** (Should be yes)

If you can answer "yes" / "no" / "yes" / "no" / "no" / "no" / "yes" / "yes" — publish.

---

## Contact & Questions

- **Philosophical accuracy:** [Designated researcher or external scholar]
- **Content safety:** [Content safety lead]
- **Product strategy:** [Product lead]
- **Development / integration:** [Engineering lead]

---

## Final Note

This research is a resource, not a mandate. The goal is to deepen Retain's content and provide practitioners with access to genuine wisdom traditions. If a tradition doesn't fit the app's voice or user base, it's okay to skip it. Quality over quantity.

The best Studies are those that:
1. Reflect authentic tradition
2. Are joyfully written (not dry)
3. Inspire action (not just thinking)
4. Align with Retain's ethos (the energy is the ally; discipline is freedom)
5. Can be practiced by someone today

---

**Version:** 1.0  
**Created:** June 6, 2026  
**Status:** Ready for team implementation
