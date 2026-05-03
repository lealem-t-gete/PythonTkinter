import re

with open('index.html', 'r') as f:
    html = f.read()

# Update sidebar
html = html.replace('<h4>Radio & Text</h4>\n                            <p>Choices & essays</p>',
                    '<h4>Radio, Text, Check</h4>\n                            <p>Options & essays</p>')

# Replace Step 5 header
html = html.replace('<h3>Step 5 — Radio Buttons &amp; Text Area <span class="new-tag">new</span></h3>\n                            <p>Radio buttons let the user pick exactly one option. They share a single <code style="font-family:var(--font-code);color:var(--blue)">tk.StringVar()</code>. A <code style="font-family:var(--font-code);color:var(--blue)">tk.Text()</code> widget allows multi-line typing for essays.</p>',
                    '<h3>Step 5 — Radio, Text &amp; Checkbox <span class="new-tag">new</span></h3>\n                            <p>Radio buttons let the user pick exactly one option. A <code style="font-family:var(--font-code);color:var(--blue)">tk.Text()</code> widget allows multi-line typing. A <code style="font-family:var(--font-code);color:var(--blue)">Checkbutton</code> needs a <code style="font-family:var(--font-code);color:var(--blue)">tk.BooleanVar()</code> to store its True/False state.</p>')

# Replace Step 5 code
html = html.replace('<span class="line-new">text_essay.place(x=<span class="num">30</span>, y=<span class="num">180</span>)</span><br>',
                    '<span class="line-new">text_essay.place(x=<span class="num">30</span>, y=<span class="num">180</span>)</span><br>\n                                <span class="line-new"></span><br>\n                                <span class="line-new"><span class="cm"># Checkbox for Terms</span></span><br>\n                                <span class="line-new">terms_var = tk.<span class="cls">BooleanVar</span>()</span><br>\n                                <span class="line-new">tk.<span class="cls">Checkbutton</span>(root, text=<span class="str">"I agree to the terms of the club."</span>, variable=terms_var).place(x=<span class="num">30</span>, y=<span class="num">260</span>)</span><br>')

# Replace Step 6 code (we will just add a line for the terms)
html = html.replace('<span class="line-new">frame_essay.place(x=<span class="num">20</span>, y=<span class="num">220</span>, width=<span class="num">460</span>, height=<span class="num">140</span>)</span><br>',
                    '<span class="line-new">frame_essay.place(x=<span class="num">20</span>, y=<span class="num">220</span>, width=<span class="num">460</span>, height=<span class="num">120</span>)</span><br>\n                                <span class="line-new"></span><br>\n                                <span class="line-new">frame_terms = tk.<span class="cls">LabelFrame</span>(root, text=<span class="str">"Agreement"</span>, padx=<span class="num">10</span>, pady=<span class="num">5</span>)</span><br>\n                                <span class="line-new">frame_terms.place(x=<span class="num">20</span>, y=<span class="num">350</span>, width=<span class="num">460</span>, height=<span class="num">60</span>)</span><br>')

# Replace Step 7 code
# First, update geometry to make it a bit taller to fit
html = html.replace('root.geometry(<span class="str">"500x550"</span>)', 'root.geometry(<span class="str">"500x600"</span>)')

# Then add the terms block
terms_html = """
                                <span class="cm"># ── Agreement ────────────────────────────────</span><br>
                                frame_t = tk.<span class="cls">LabelFrame</span>(root, text=<span class="str">"Agreement"</span>, padx=<span class="num">10</span>, pady=<span class="num">5</span>)<br>
                                frame_t.pack(padx=<span class="num">20</span>, pady=<span class="num">5</span>, fill=<span class="str">"x"</span>)<br><br>
                                
                                terms_var = tk.<span class="cls">BooleanVar</span>()<br>
                                tk.<span class="cls">Checkbutton</span>(frame_t, text=<span class="str">"I agree to the terms of the IT club."</span>, variable=terms_var).pack(anchor=<span class="str">"w"</span>)<br><br>
"""

html = html.replace('                                <span class="cm"># ── Submit Button ────────────────────────────</span><br>',
                    terms_html + '                                <span class="cm"># ── Submit Button ────────────────────────────</span><br>')

with open('index.html', 'w') as f:
    f.write(html)
print("Updated successfully.")
