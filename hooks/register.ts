import type { Register } from 'claude-code'

const GRILLING = /(^|:)grilling$/

const FORMAT = `## Round format: answer cards

Ask every round as one show_widget elicitation form instead of the ❓/➡️ text block above. The rest of this skill stands: the frontier, one recommendation per question, waiting for the answers, and the end at shared understanding. Nothing a question would have said in the text format is dropped; it goes into the form. Outside the form, write at most the round's opening line.

Before the first form of the session, call mcp__visualize__read_me with modules ["elicitation"], and build the form from that shell (header, body, footer) exactly as it specifies.

The form:
- Header title: "<what the grill is about> details".
- One .elicit-group per question. Every group after the first carries style="border-top:0.5px solid var(--border-strong);padding-top:18px;margin-top:6px". Each group opens with a muted line "Question n of N" (font-size:12px; color:var(--text-muted); font-family:var(--font-mono)); an out-of-scope question's line ends with " · outside your ask".
- The question label reads alone: plain words, no pointer to another question, table row, issue, or rule number; what it builds on is restated in one clause.
- Under the label, at most two muted lines (font-size:13px; color:var(--text-secondary)) of real context: the actual file, sentence, record, or number. The rest of the question's background and reasoning, everything its body would have carried in the text format, goes in a fold right after them:
  <details style="margin:0 0 8px"><summary style="font-size:12px;color:var(--text-secondary);cursor:pointer">More</summary><div style="font-size:13px;line-height:1.5;color:var(--text-secondary);margin-top:6px">…</div></details>
- A question that turns on structure (a hierarchy, relations, a sequence or flow, a before and after, or the reach of options) gets one small diagram drawn from real data, the actual files, objects, issues, or steps, placed after the fold and before the options: an inline <svg> at most 640 wide and 220 tall, currentColor strokes, 11 to 12 px labels, meaning carried by shape and words, never by colour alone. A question about preference or a plain yes or no gets none.
- Every option is a full-width row: an .elicit-pill with a currentColor SVG on the left that draws the real thing the option creates or changes, such as the field on its page, the line in its file, or the record, at most 160 wide and 40 tall with 11px labels, and on the right a 13px label over one 12px muted sentence that says when you would pick that option. The recommended option's label ends in " ★", its sentence also says why it is recommended, and its button carries data-default. A row looks like this:
  <button type="button" class="elicit-pill" data-default data-value="B keep the 2 file-vs-file tests" style="width:100%;display:flex;flex-direction:row;align-items:center;gap:14px;text-align:left;border-radius:12px;padding:10px 14px;box-shadow:0 1px 2px rgba(0,0,0,0.04)"><svg width="160" height="40" viewBox="0 0 160 40" fill="none" stroke="currentColor" stroke-width="1.2" style="flex:none">…</svg><span style="display:flex;flex-direction:column;gap:2px"><span style="font-size:13px;font-weight:500">Keep only the 2 file-vs-file tests ★</span><span style="font-size:12px;color:var(--text-muted)">Pick this to let skills be reworded freely while still catching two files that disagree. Recommended because these are the only tests that catch a real break.</span></span></button>
- The data-name of each .elicit-pills group starts with the question's session-wide number, for example q7_line_limit. Numbers keep counting across rounds, so a number never names two questions.
- Under each question's rows, a .elicit-textarea with placeholder="Or answer in your own words" and a data-name equal to the group's data-name plus _in_your_words.
- A question outside the user's ask goes last, with the rows "Leave out" (data-default) and "Ask it now", each with its when-to-pick sentence, and no ★.
- Footer: the skip button reads "Skip: take every ★"; the submit button reads "Send answers".
- After the form, add this script verbatim; it selects every data-default option once the form has loaded:
<script>
(function(){var t=0;function p(){t++;document.querySelectorAll('.elicit-pill[data-default]').forEach(function(b){if(b.getAttribute('aria-pressed')!=='true')b.click();if(b.getAttribute('aria-pressed')!=='true')b.setAttribute('aria-pressed','true');});if(t<6)setTimeout(p,250);}setTimeout(p,150);})();
</script>

A full diagram page: when a question's structure has too many parts to read in the small diagram, also build a full page; otherwise the small diagram is enough. Build it before the form, so the form can link it.
- When the archify skill is among your available skills, hand the page to a subagent: one Agent call with model "sonnet", whose prompt carries the question, the real files, objects, or steps the diagram shows, and the instruction to load archify with the Skill tool, write into the repository's .archify folder, and return only the finished HTML file's path. The first time, add ".archify/" to the repository's .gitignore if it isn't there yet.
- A file link does nothing inside the form, so publish the finished page as a private Artifact: copy it beside itself as <slug>.artifact.html without its <!DOCTYPE>, <html>, <head>, and <body> tags and without its charset and viewport <meta> tags, keeping everything inside head and body in order, and publish that copy with the Artifact tool (icon "diagram", a one-sentence description).
- Inside the question, right after the small diagram, link the published page:
  <a href="<the Artifact URL>" style="display:inline-flex;align-items:center;gap:10px;margin:0 0 14px;padding:8px 12px;border:0.5px solid var(--border-strong);border-radius:10px;text-decoration:none;color:var(--text-primary)"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M10 2h6v6M16 2l-7 7M14 11v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4"/></svg><span style="display:flex;flex-direction:column"><span style="font-size:13px;font-weight:500">Open full version</span><span style="font-size:11px;color:var(--text-muted)">all <n> parts, interactive map</span></span></a>
- When archify isn't available, keep the small diagram and put this muted line right after it instead: "For a full version, install archify: npx skills add tt-a1i/archify -g".

Reading the answers: they arrive as one line, "<Title> details — Q7 line limit: A … · Q7 line limit in your words: …". A text answer adds to the option selected for its question: read the two together as one answer. The text replaces the option only when it says so or names a different one. "(Skipped the form …)" means every ★ and every "Leave out". Open the next round with one line that names the questions which took the ★.

When show_widget is unavailable, ask the round in the text format above, with each option's when-to-pick sentence and the reason for the recommendation written out.`

export const register: Register = on => {
  on('skill.prompt', async ($, e, next) => {
    const computed = await next(e)
    if (!GRILLING.test(e.skill)) return computed
    $.ui.toast('grill-cards: this grill asks its rounds as answer cards')
    return { text: `${computed.text}\n\n${FORMAT}` }
  })
}
