import re

with open('index.html', 'r') as f:
    html = f.read()

# 1. Update Project Card Details
html = html.replace('<h3>Data Entry Form</h3>', '<h3>IT Club Registry</h3>')
html = html.replace('<p>Build a complete data entry form with text inputs, dropdowns, spinboxes, and checkboxes.</p>',
                    '<p>Build a student registry form with text inputs, dropdowns, radio buttons, and a text area for an essay.</p>')

# 2. Update Builder Header
html = html.replace('<h2>Build the form, step by step</h2>', '<h2>Build the IT Club Registry</h2>')
html = html.replace('<p class="section-intro">Follow the steps to build the complete data entry form.',
                    '<p class="section-intro">Follow the steps to build the club registration form.')

# 3. Update Sidebar links
html = html.replace('<h4>Checkboxes</h4>\n                            <p>BooleanVar ticks</p>',
                    '<h4>Radio & Text</h4>\n                            <p>Choices & essays</p>')
html = html.replace('<h4>Dropdowns</h4>\n                            <p>Spinbox &amp; Combobox</p>',
                    '<h4>Dropdowns</h4>\n                            <p>Combobox lists</p>')

# 4. Replace .step-content-area
start_tag = '<div class="step-content-area">'
end_tag = '</div>\n            </div>\n        </div>\n    </section>\n\n    <!-- ── CHEATSHEET ── -->'

start_idx = html.find(start_tag) + len(start_tag)
end_idx = html.find(end_tag)

new_content = """

                    <!-- Step 1 -->
                    <div class="step-panel active" id="sp-0">
                        <div class="step-card">
                            <h3>Step 1 — Create the window</h3>
                            <p>Every tkinter program has the same skeleton: import, create the window, set its size and
                                title, then call <code
                                    style="font-family:var(--font-code);color:var(--blue)">mainloop()</code> to keep it
                                open.</p>
                            <div class="code-block">
                                <button class="copy-btn" onclick="copyCode(this)">copy</button>
                                <span class="kw">import</span> tkinter <span class="kw">as</span> tk<br>
                                <span class="kw">from</span> tkinter <span class="kw">import</span> ttk<br><br>
                                root = tk.<span class="cls">Tk</span>() <span class="cm"># create the window</span><br>
                                root.geometry(<span class="str">"500x600"</span>) <span class="cm"># width x height</span><br>
                                root.title(<span class="str">"IT Club Registry"</span>) <span class="cm"># title bar text</span><br><br>
                                <span class="cm"># Always the last line — keeps the window open</span><br>
                                root.mainloop()
                            </div>
                            <div class="step-nav">
                                <button class="step-btn primary"
                                    onclick="goStep(1, document.getElementById('si-1'))">Next: Labels →</button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div class="step-panel" id="sp-1">
                        <div class="step-card">
                            <h3>Step 2 — Add labels with <code
                                    style="font-family:var(--font-code);font-size:1.1rem">.place()</code></h3>
                            <p>Labels display text. Use <code
                                    style="font-family:var(--font-code);color:var(--blue)">.place(x=, y=)</code> to put
                                them at exact pixel coordinates.</p>
                            <div class="code-block">
                                <button class="copy-btn" onclick="copyCode(this)">copy</button>
                                <span class="cm"># ... (root setup) ...</span><br><br>
                                <span class="line-new"><span class="cm"># Labels — .place(x, y) sets exact pixel position</span></span><br>
                                <span class="line-new">tk.<span class="cls">Label</span>(root, text=<span class="str">"First Name"</span>).place(x=<span class="num">30</span>, y=<span class="num">30</span>)</span><br>
                                <span class="line-new">tk.<span class="cls">Label</span>(root, text=<span class="str">"Last Name"</span>).place(x=<span class="num">180</span>, y=<span class="num">30</span>)</span><br>
                                <span class="line-new">tk.<span class="cls">Label</span>(root, text=<span class="str">"Middle Name"</span>).place(x=<span class="num">330</span>, y=<span class="num">30</span>)</span><br>
                                <span class="line-new">tk.<span class="cls">Label</span>(root, text=<span class="str">"Grade"</span>).place(x=<span class="num">30</span>, y=<span class="num">90</span>)</span><br>
                                <span class="line-new">tk.<span class="cls">Label</span>(root, text=<span class="str">"Section"</span>).place(x=<span class="num">180</span>, y=<span class="num">90</span>)</span><br>
                                <span class="line-new">tk.<span class="cls">Label</span>(root, text=<span class="str">"Gender"</span>).place(x=<span class="num">330</span>, y=<span class="num">90</span>)</span><br>
                                <span class="line-new">tk.<span class="cls">Label</span>(root, text=<span class="str">"Essay (Why join?)"</span>).place(x=<span class="num">30</span>, y=<span class="num">150</span>)</span><br><br>
                                root.mainloop()
                            </div>
                            <div class="step-nav">
                                <button class="step-btn" onclick="goStep(0, document.getElementById('si-0'))">←
                                    Back</button>
                                <button class="step-btn primary"
                                    onclick="goStep(2, document.getElementById('si-2'))">Next: Entries →</button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div class="step-panel" id="sp-2">
                        <div class="step-card">
                            <h3>Step 3 — Entry boxes</h3>
                            <p><code style="font-family:var(--font-code);color:var(--blue)">tk.Entry()</code> creates a
                                text field. Save it in a variable to read input later with
                                <code style="font-family:var(--font-code);color:var(--blue)">.get()</code>.
                            </p>
                            <div class="code-block">
                                <button class="copy-btn" onclick="copyCode(this)">copy</button>
                                <span class="cm"># ... (labels from Step 2) ...</span><br><br>
                                <span class="line-new"><span class="cm"># Entry: text input box</span></span><br>
                                <span class="line-new">entry_fname = tk.<span class="cls">Entry</span>(root, width=<span class="num">12</span>)</span><br>
                                <span class="line-new">entry_fname.place(x=<span class="num">30</span>, y=<span class="num">50</span>)</span><br>
                                <span class="line-new"></span><br>
                                <span class="line-new">entry_lname = tk.<span class="cls">Entry</span>(root, width=<span class="num">12</span>)</span><br>
                                <span class="line-new">entry_lname.place(x=<span class="num">180</span>, y=<span class="num">50</span>)</span><br>
                                <span class="line-new"></span><br>
                                <span class="line-new">entry_mname = tk.<span class="cls">Entry</span>(root, width=<span class="num">12</span>)</span><br>
                                <span class="line-new">entry_mname.place(x=<span class="num">330</span>, y=<span class="num">50</span>)</span><br>
                            </div>
                            <div class="step-nav">
                                <button class="step-btn" onclick="goStep(1, document.getElementById('si-1'))">←
                                    Back</button>
                                <button class="step-btn primary"
                                    onclick="goStep(3, document.getElementById('si-3'))">Next: Dropdowns →</button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4 -->
                    <div class="step-panel" id="sp-3">
                        <div class="step-card">
                            <h3>Step 4 — Comboboxes</h3>
                            <p><code style="font-family:var(--font-code);color:var(--blue)">ttk.Combobox</code> =
                                dropdown from a list. Provide the options as a tuple in the <code
                                    style="font-family:var(--font-code);color:var(--blue)">values</code> parameter.</p>
                            <div class="code-block">
                                <button class="copy-btn" onclick="copyCode(this)">copy</button>
                                <span class="cm"># ... (previous code) ...</span><br><br>
                                <span class="line-new"><span class="cm"># Combobox: Dropdown list for Grade</span></span><br>
                                <span class="line-new">combo_grade = ttk.<span class="cls">Combobox</span>(root, values=(<span class="str">"9"</span>, <span class="str">"10"</span>, <span class="str">"11"</span>, <span class="str">"12"</span>), width=<span class="num">10</span>)</span><br>
                                <span class="line-new">combo_grade.place(x=<span class="num">30</span>, y=<span class="num">110</span>)</span><br>
                                <span class="line-new">combo_grade.set(<span class="str">"Select..."</span>)</span><br>
                                <span class="line-new"></span><br>
                                <span class="line-new"><span class="cm"># Combobox for Section</span></span><br>
                                <span class="line-new">combo_section = ttk.<span class="cls">Combobox</span>(root, values=(<span class="str">"A"</span>, <span class="str">"B"</span>, <span class="str">"C"</span>, <span class="str">"D"</span>), width=<span class="num">10</span>)</span><br>
                                <span class="line-new">combo_section.place(x=<span class="num">180</span>, y=<span class="num">110</span>)</span><br>
                                <span class="line-new">combo_section.set(<span class="str">"Select..."</span>)</span><br>
                            </div>
                            <div class="step-nav">
                                <button class="step-btn" onclick="goStep(2, document.getElementById('si-2'))">←
                                    Back</button>
                                <button class="step-btn primary"
                                    onclick="goStep(4, document.getElementById('si-4'))">Next: Radio &amp; Text →</button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 5 -->
                    <div class="step-panel" id="sp-4">
                        <div class="step-card">
                            <h3>Step 5 — Radio Buttons &amp; Text Area <span class="new-tag">new</span></h3>
                            <p>Radio buttons let the user pick exactly one option. They share a single <code style="font-family:var(--font-code);color:var(--blue)">tk.StringVar()</code>. A <code style="font-family:var(--font-code);color:var(--blue)">tk.Text()</code> widget allows multi-line typing for essays.</p>
                            <div class="code-block">
                                <button class="copy-btn" onclick="copyCode(this)">copy</button>
                                <span class="cm"># ... (previous code) ...</span><br><br>
                                <span class="line-new"><span class="cm"># Radio Buttons for Gender</span></span><br>
                                <span class="line-new">gender_var = tk.<span class="cls">StringVar</span>(value=<span class="str">"Male"</span>)</span><br>
                                <span class="line-new">tk.<span class="cls">Radiobutton</span>(root, text=<span class="str">"M"</span>, variable=gender_var, value=<span class="str">"Male"</span>).place(x=<span class="num">330</span>, y=<span class="num">110</span>)</span><br>
                                <span class="line-new">tk.<span class="cls">Radiobutton</span>(root, text=<span class="str">"F"</span>, variable=gender_var, value=<span class="str">"Female"</span>).place(x=<span class="num">380</span>, y=<span class="num">110</span>)</span><br>
                                <span class="line-new"></span><br>
                                <span class="line-new"><span class="cm"># Text Widget for Essay</span></span><br>
                                <span class="line-new">text_essay = tk.<span class="cls">Text</span>(root, width=<span class="num">50</span>, height=<span class="num">6</span>)</span><br>
                                <span class="line-new">text_essay.place(x=<span class="num">30</span>, y=<span class="num">180</span>)</span><br>
                            </div>
                            <div class="step-nav">
                                <button class="step-btn" onclick="goStep(3, document.getElementById('si-3'))">←
                                    Back</button>
                                <button class="step-btn primary"
                                    onclick="goStep(5, document.getElementById('si-5'))">Next: Frames →</button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 6 -->
                    <div class="step-panel" id="sp-5">
                        <div class="step-card">
                            <h3>Step 6 — LabelFrame groups <span class="new-tag">new</span></h3>
                            <p>A <code style="font-family:var(--font-code);color:var(--blue)">LabelFrame</code> draws a
                                titled border around a group of widgets. Widgets inside it use the
                                <em>frame</em> as their parent, not <code>root</code>.
                            </p>
                            <div class="code-block">
                                <button class="copy-btn" onclick="copyCode(this)">copy</button>
                                <span class="cm"># ... (root setup) ...</span><br><br>
                                <span class="line-new"><span class="cm"># Create frames to group related widgets</span></span><br>
                                <span class="line-new">frame_personal = tk.<span class="cls">LabelFrame</span>(root, text=<span class="str">"Personal Details"</span>, padx=<span class="num">10</span>, pady=<span class="num">10</span>)</span><br>
                                <span class="line-new">frame_personal.place(x=<span class="num">20</span>, y=<span class="num">20</span>, width=<span class="num">460</span>, height=<span class="num">80</span>)</span><br>
                                <span class="line-new"></span><br>
                                <span class="line-new">frame_academic = tk.<span class="cls">LabelFrame</span>(root, text=<span class="str">"Academic Info"</span>, padx=<span class="num">10</span>, pady=<span class="num">10</span>)</span><br>
                                <span class="line-new">frame_academic.place(x=<span class="num">20</span>, y=<span class="num">120</span>, width=<span class="num">460</span>, height=<span class="num">80</span>)</span><br>
                                <span class="line-new"></span><br>
                                <span class="line-new">frame_essay = tk.<span class="cls">LabelFrame</span>(root, text=<span class="str">"Essay"</span>, padx=<span class="num">10</span>, pady=<span class="num">10</span>)</span><br>
                                <span class="line-new">frame_essay.place(x=<span class="num">20</span>, y=<span class="num">220</span>, width=<span class="num">460</span>, height=<span class="num">140</span>)</span><br>
                            </div>
                            <div class="step-nav">
                                <button class="step-btn" onclick="goStep(4, document.getElementById('si-4'))">←
                                    Back</button>
                                <button class="step-btn primary"
                                    onclick="goStep(6, document.getElementById('si-6'))">Next: Complete Code →</button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 7 -->
                    <div class="step-panel" id="sp-6">
                        <div class="step-card">
                            <h3>Step 7 — The Final Code</h3>
                            <p>Here is the completed code for the IT Club Registry, organized neatly into frames using <code style="font-family:var(--font-code);color:var(--blue)">.grid()</code> and <code style="font-family:var(--font-code);color:var(--blue)">.pack()</code> for a cleaner look.</p>
                            <div class="code-block" style="max-height: 400px; overflow-y: auto;">
                                <button class="copy-btn" onclick="copyCode(this)">copy</button>
                                <span class="kw">import</span> tkinter <span class="kw">as</span> tk<br>
                                <span class="kw">from</span> tkinter <span class="kw">import</span> ttk<br><br>
                                root = tk.<span class="cls">Tk</span>()<br>
                                root.geometry(<span class="str">"500x550"</span>)<br>
                                root.title(<span class="str">"IT Club Registry"</span>)<br><br>
                                
                                <span class="cm"># ── Personal Details ─────────────────────────</span><br>
                                frame_p = tk.<span class="cls">LabelFrame</span>(root, text=<span class="str">"Personal Details"</span>, padx=<span class="num">10</span>, pady=<span class="num">10</span>)<br>
                                frame_p.pack(padx=<span class="num">20</span>, pady=<span class="num">10</span>, fill=<span class="str">"x"</span>)<br><br>
                                
                                tk.<span class="cls">Label</span>(frame_p, text=<span class="str">"First Name"</span>).grid(row=<span class="num">0</span>, column=<span class="num">0</span>, sticky=<span class="str">"w"</span>)<br>
                                entry_f = tk.<span class="cls">Entry</span>(frame_p, width=<span class="num">15</span>)<br>
                                entry_f.grid(row=<span class="num">1</span>, column=<span class="num">0</span>, padx=<span class="num">5</span>)<br><br>
                                
                                tk.<span class="cls">Label</span>(frame_p, text=<span class="str">"Last Name"</span>).grid(row=<span class="num">0</span>, column=<span class="num">1</span>, sticky=<span class="str">"w"</span>)<br>
                                entry_l = tk.<span class="cls">Entry</span>(frame_p, width=<span class="num">15</span>)<br>
                                entry_l.grid(row=<span class="num">1</span>, column=<span class="num">1</span>, padx=<span class="num">5</span>)<br><br>

                                tk.<span class="cls">Label</span>(frame_p, text=<span class="str">"Middle Name"</span>).grid(row=<span class="num">0</span>, column=<span class="num">2</span>, sticky=<span class="str">"w"</span>)<br>
                                entry_m = tk.<span class="cls">Entry</span>(frame_p, width=<span class="num">15</span>)<br>
                                entry_m.grid(row=<span class="num">1</span>, column=<span class="num">2</span>, padx=<span class="num">5</span>)<br><br>

                                <span class="cm"># ── Academic Details ─────────────────────────</span><br>
                                frame_a = tk.<span class="cls">LabelFrame</span>(root, text=<span class="str">"Academic &amp; Gender"</span>, padx=<span class="num">10</span>, pady=<span class="num">10</span>)<br>
                                frame_a.pack(padx=<span class="num">20</span>, pady=<span class="num">10</span>, fill=<span class="str">"x"</span>)<br><br>

                                tk.<span class="cls">Label</span>(frame_a, text=<span class="str">"Grade"</span>).grid(row=<span class="num">0</span>, column=<span class="num">0</span>, sticky=<span class="str">"w"</span>)<br>
                                combo_g = ttk.<span class="cls">Combobox</span>(frame_a, values=(<span class="str">"9"</span>, <span class="str">"10"</span>, <span class="str">"11"</span>, <span class="str">"12"</span>), width=<span class="num">8</span>)<br>
                                combo_g.grid(row=<span class="num">1</span>, column=<span class="num">0</span>, padx=<span class="num">5</span>)<br><br>

                                tk.<span class="cls">Label</span>(frame_a, text=<span class="str">"Section"</span>).grid(row=<span class="num">0</span>, column=<span class="num">1</span>, sticky=<span class="str">"w"</span>)<br>
                                combo_s = ttk.<span class="cls">Combobox</span>(frame_a, values=(<span class="str">"A"</span>, <span class="str">"B"</span>, <span class="str">"C"</span>, <span class="str">"D"</span>), width=<span class="num">8</span>)<br>
                                combo_s.grid(row=<span class="num">1</span>, column=<span class="num">1</span>, padx=<span class="num">5</span>)<br><br>
                                
                                tk.<span class="cls">Label</span>(frame_a, text=<span class="str">"Gender"</span>).grid(row=<span class="num">0</span>, column=<span class="num">2</span>, sticky=<span class="str">"w"</span>, padx=<span class="num">15</span>)<br>
                                gender_var = tk.<span class="cls">StringVar</span>(value=<span class="str">"Male"</span>)<br>
                                tk.<span class="cls">Radiobutton</span>(frame_a, text=<span class="str">"M"</span>, variable=gender_var, value=<span class="str">"Male"</span>).grid(row=<span class="num">1</span>, column=<span class="num">2</span>, sticky=<span class="str">"w"</span>, padx=(<span class="num">15</span>,<span class="num">0</span>))<br>
                                tk.<span class="cls">Radiobutton</span>(frame_a, text=<span class="str">"F"</span>, variable=gender_var, value=<span class="str">"Female"</span>).grid(row=<span class="num">1</span>, column=<span class="num">2</span>, sticky=<span class="str">"e"</span>)<br><br>

                                <span class="cm"># ── Essay ────────────────────────────────────</span><br>
                                frame_e = tk.<span class="cls">LabelFrame</span>(root, text=<span class="str">"Why do you want to join the IT Club?"</span>, padx=<span class="num">10</span>, pady=<span class="num">10</span>)<br>
                                frame_e.pack(padx=<span class="num">20</span>, pady=<span class="num">10</span>, fill=<span class="str">"x"</span>)<br><br>
                                
                                text_essay = tk.<span class="cls">Text</span>(frame_e, height=<span class="num">4</span>, width=<span class="num">50</span>)<br>
                                text_essay.pack()<br><br>

                                <span class="cm"># ── Submit Button ────────────────────────────</span><br>
                                btn_submit = tk.<span class="cls">Button</span>(root, text=<span class="str">"Register Student"</span>, bg=<span class="str">"#4fffb0"</span>, fg=<span class="str">"black"</span>)<br>
                                btn_submit.pack(pady=<span class="num">15</span>)<br><br>

                                root.mainloop()
                            </div>
                            <div class="step-nav">
                                <button class="step-btn" onclick="goStep(5, document.getElementById('si-5'))">←
                                    Back</button>
                            </div>
                        </div>
                    </div>
"""

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + new_content + html[end_idx:]
    with open('index.html', 'w') as f:
        f.write(html)
    print("Successfully updated index.html")
else:
    print("Could not find replacement boundaries.")

