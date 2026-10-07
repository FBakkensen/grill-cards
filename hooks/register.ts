import type { Register } from 'claude-code'

const GRILLING = /(^|:)grilling$/

const FORMAT = `## Round format: answer cards

Ask every round as one show_widget elicitation form instead of the ❓/➡️ text block above. The rest of this skill stands: the frontier, one recommendation per question, waiting for the answers, and the end at shared understanding. Nothing a question would have said in the text format is dropped; it goes into the form. Outside the form, write at most the round's opening line.

Before the first form of the session, call mcp__visualize__read_me with modules ["elicitation"], and build the form from that shell (header, body, footer) exactly as it specifies.

The form:
- Header title: "<what the grill is about> details".
- Right under the header, before the first question, the big-picture button (see "The big picture" below), or its install line. It is not a question: no number, no data-name, nothing in the answers.
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

The big picture: one optional full-page diagram of how this round's questions and their parts connect. Every form carries a button for it, so you can ask for it in any round. Build nothing before the form, and never build it unasked.
- Recommend it with a ★ in the button label when the round has at least one of these: a small diagram would need 9 or more text labels (about 5 boxes of two lines); a question's fold lists 5 or more steps, items, or dependencies; the questions depend on each other across 3 or more separate components, files, tickets, or modules; or the picture changed materially since the last big picture. Without any of them the button has no ★. When the ★ is there, the muted line under the label names the reason in real terms, for example "8 tickets with dependencies, too many for a small diagram"; without it the line reads "One page showing how this round's questions connect".
- When the archify skill is among your available skills, the button is this row, with no data-default and no data-name, so "Skip: take every ★" never starts a build. In data-prompt, write in one sentence what the page should show, naming the real files, objects, or steps, with straight quotes escaped:
  <button type="button" id="bp-btn" data-prompt="<what the page shows>" style="width:100%;display:flex;flex-direction:row;align-items:center;gap:14px;text-align:left;border:0.5px solid var(--border-strong);border-radius:12px;padding:10px 14px;margin:0 0 18px;background:var(--surface-2);color:var(--text-primary);cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,0.04)"><svg width="40" height="28" viewBox="0 0 40 28" fill="none" stroke="currentColor" stroke-width="1.2" style="flex:none"><rect x="2" y="3" width="10" height="8" rx="2"/><rect x="28" y="3" width="10" height="8" rx="2"/><rect x="15" y="18" width="10" height="8" rx="2"/><path d="M12 7h16M7 11l10 7M33 11l-10 7"/></svg><span style="display:flex;flex-direction:column;gap:2px"><span data-bp-label style="font-size:13px;font-weight:500">Draw the big picture ★</span><span data-bp-sub style="font-size:12px;color:var(--text-muted)"><the reason line></span></span></button>
  Add this script verbatim after the form's own script; it sends the click to the chat once and locks the button:
  <script>
  (function(){var b=document.getElementById('bp-btn');if(!b)return;b.addEventListener('click',function(){if(b.disabled)return;b.disabled=true;b.style.opacity='0.6';b.querySelector('[data-bp-label]').textContent='Drawing…';b.querySelector('[data-bp-sub]').textContent='Started. The link arrives in chat; keep answering meanwhile.';sendPrompt('Draw the big picture: '+b.getAttribute('data-prompt'));});})();
  </script>
- When archify isn't available, replace the button with a muted line (font-size:12px; color:var(--text-muted)) in the same place, only in a round that would have had the ★ and only the first time in the session: "For a full-page big picture, install archify: npx skills add tt-a1i/archify -g".
- The click arrives as a chat message, "Draw the big picture: …", while the form stays open. Answer it with one line, then build in the background without waiting. Make one Agent call with model "sonnet" and run_in_background true, whose prompt carries that sentence, the real files, objects, or steps the diagram shows, and these instructions: load archify with the Skill tool; write the page into the repository's .archify folder, adding ".archify/" to the repository's .gitignore first if it isn't there yet; copy the finished page beside itself as <slug>.artifact.html without its <!DOCTYPE>, <html>, <head>, and <body> tags and without its charset and viewport <meta> tags, keeping everything inside head and body in order; publish that copy as a private Artifact (icon "diagram", a one-sentence description); return only the Artifact URL. When the agent's completion notice arrives, tell the user in one line with the link. The form still takes its answers meanwhile, and the answers are read as usual.

Reading the answers: they arrive as one line, "<Title> details — Q7 line limit: A … · Q7 line limit in your words: …". A text answer adds to the option selected for its question: read the two together as one answer. The text replaces the option only when it says so or names a different one. "(Skipped the form …)" means every ★ and every "Leave out"; the big-picture button is never part of it. Open the next round with one line that names the questions which took the ★.

When show_widget is unavailable, ask the round in the text format above, with each option's when-to-pick sentence and the reason for the recommendation written out.`

export const register: Register = on => {
  on('skill.prompt', async ($, e, next) => {
    const computed = await next(e)
    if (!GRILLING.test(e.skill)) return computed
    $.ui.toast('grill-cards: this grill asks its rounds as answer cards')
    return { text: `${computed.text}\n\n${FORMAT}` }
  })
}
