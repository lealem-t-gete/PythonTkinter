import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Update navigation
content = content.replace('<li><a href="#builder">Step Builder</a></li>', '<li><a href="#projects">Projects</a></li>')
content = content.replace('<a href="#builder" class="btn-primary">Start Building →</a>', '<a href="#projects" class="btn-primary">Start Building →</a>')

# 2. Add Projects section before Builder
projects_section = """
    <!-- ── PROJECTS ── -->
    <section id="projects">
        <div style="max-width:1100px;margin:0 auto">
            <div class="section-label">Practice</div>
            <h2>Build Real Projects</h2>
            <p class="section-intro">Choose a project to start building step-by-step.</p>
            
            <div class="about-grid">
                <div class="about-card" style="cursor: pointer;" onclick="openProject('builder')">
                    <div class="about-card-icon" style="background:rgba(79,255,176,0.1)">📋</div>
                    <h3>Data Entry Form</h3>
                    <p>Build a complete data entry form with text inputs, dropdowns, spinboxes, and checkboxes.</p>
                    <button class="btn-primary" style="margin-top: 1rem; padding: 0.5rem 1rem;">Start Project →</button>
                </div>
                <div class="about-card" style="opacity: 0.6; cursor: not-allowed;">
                    <div class="about-card-icon" style="background:rgba(76,201,240,0.1)">🧮</div>
                    <h3>Calculator (Coming Soon)</h3>
                    <p>Build a working calculator using grid layout and button command callbacks.</p>
                </div>
                <div class="about-card" style="opacity: 0.6; cursor: not-allowed;">
                    <div class="about-card-icon" style="background:rgba(255,209,102,0.1)">✅</div>
                    <h3>To-Do List (Coming Soon)</h3>
                    <p>Build a task manager using Listbox, Scrollbar, and entry widgets.</p>
                </div>
            </div>
        </div>
    </section>

"""

content = content.replace('    <!-- ── STEP BUILDER ── -->', projects_section + '    <!-- ── STEP BUILDER ── -->')

# 3. Add inline style to hide builder initially
content = content.replace('<section id="builder">', '<section id="builder" style="display: none;">')

# 4. Add "Back to Projects" button in Builder header
back_btn_html = """
            <div style="margin-bottom: 2rem;">
                <button class="btn-ghost" onclick="closeProject('builder')" style="padding: 0.5rem 1rem; font-size: 0.8rem;">← Back to Projects</button>
            </div>
"""
content = content.replace('<div class="section-label">Interactive guide</div>', back_btn_html + '            <div class="section-label">Interactive guide</div>')

# 5. Add JavaScript to handle open/close
js_code = """
    <script>
        function openProject(id) {
            document.getElementById('projects').style.display = 'none';
            document.getElementById(id).style.display = 'block';
            window.scrollTo({ top: document.getElementById(id).offsetTop - 80, behavior: 'smooth' });
        }
        
        function closeProject(id) {
            document.getElementById(id).style.display = 'none';
            document.getElementById('projects').style.display = 'block';
            window.scrollTo({ top: document.getElementById('projects').offsetTop - 80, behavior: 'smooth' });
        }
"""
content = content.replace('    <script>', js_code, 1)

with open('index.html', 'w') as f:
    f.write(content)
print("Updated index.html successfully.")
