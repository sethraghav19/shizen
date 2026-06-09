$stylesCssPath = "C:\Users\Raghav\.gemini\antigravity\scratch\shizen-website\styles.css"
$content = [System.IO.File]::ReadAllText($stylesCssPath, [System.Text.Encoding]::UTF8)

# The new CSS styles to append for the dynamic multi-page corporate expansion
$subPageStyles = @"


/* ==========================================================================
   07. MULTI-PAGE EXPANSION STYLES (SERVICES, ABOUT, BLOG, CONTACT)
   ========================================================================== */

/* --- Sub-Page Hero Header --- */
.page-hero {
    padding: 10rem 0 4.5rem 0;
    background: radial-gradient(circle at center, rgba(16, 185, 129, 0.04) 0%, rgba(7, 10, 19, 0.98) 100%);
    border-bottom: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
}

.page-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.003) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.003) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.8;
    pointer-events: none;
}

.page-hero-title {
    font-size: 3.2rem;
    line-height: 1.15;
    margin-bottom: 1rem;
}

.page-hero-desc {
    max-width: 680px;
    font-size: 1.1rem;
    color: var(--color-text-secondary);
}

/* --- Services Page Layout --- */
.services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
}

.service-card {
    position: relative;
    padding: 3rem 2.5rem;
    border-radius: var(--radius-lg);
    background: var(--color-bg-card);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-premium);
    transition: var(--transition-smooth);
}

.service-card:hover {
    transform: translateY(-5px);
    border-color: var(--color-accent-emerald);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.05);
}

.service-card h3 {
    font-size: 1.6rem;
    margin: 1.5rem 0 1rem 0;
}

.service-card-icon {
    width: 54px;
    height: 54px;
    background: rgba(16, 185, 129, 0.08);
    color: var(--color-accent-emerald);
    border: 1px solid rgba(16, 185, 129, 0.15);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
}

.service-specs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    margin-top: 2rem;
    border-top: 1px solid var(--border-color);
    padding-top: 1.5rem;
}

.service-spec-item label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
}

.service-spec-item span {
    display: block;
    font-weight: 700;
    color: var(--color-text-primary);
    font-size: 1.1rem;
    margin-top: 0.25rem;
}

/* Interactive Services Cost Estimator Widget */
.estimator-container {
    max-width: 820px;
    margin: 4.5rem auto 0 auto;
    padding: 3rem;
}

.estimator-title {
    text-align: center;
    margin-bottom: 2.5rem;
}

.estimator-title h3 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.estimator-inputs {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
}

.estimator-outputs {
    background: rgba(16, 185, 129, 0.03);
    border: 1px dashed var(--color-accent-emerald);
    border-radius: var(--radius-md);
    padding: 2rem;
    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    text-align: center;
}

.estimator-output-box label {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 0.5rem;
}

.estimator-output-box span {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--color-accent-emerald);
    font-family: var(--font-heading);
}

/* --- About Us Page Layout --- */
/* Horizontal Engineering Timeline */
.timeline-container {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    padding: 3rem 1rem;
    scroll-snap-type: x mandatory;
    margin-top: 2rem;
}

.timeline-card {
    flex: 0 0 320px;
    padding: 2rem;
    scroll-snap-align: start;
    position: relative;
}

.timeline-year {
    font-size: 2.5rem;
    font-weight: 900;
    font-family: var(--font-heading);
    color: var(--color-accent-emerald);
    line-height: 1;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.timeline-year::after {
    content: '';
    flex-grow: 1;
    height: 2px;
    background: rgba(16, 185, 129, 0.2);
}

.timeline-card h4 {
    font-size: 1.15rem;
    margin-bottom: 0.5rem;
}

/* Leaders Bio Card Grid */
.leader-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
}

.leader-card {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    aspect-ratio: 4/5;
    background: var(--color-bg-card);
    border: 1px solid var(--border-color);
    transition: var(--transition-smooth);
}

.leader-card:hover {
    border-color: var(--color-accent-emerald);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.05);
}

.leader-photo {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
    background: radial-gradient(circle at center, var(--color-bg-dark) 0%, var(--color-bg-darkest) 100%);
    transition: var(--transition-smooth);
}

.leader-card:hover .leader-photo {
    transform: scale(1.05);
    opacity: 0.3;
}

.leader-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 2rem;
    background: linear-gradient(to top, rgba(7, 10, 19, 0.95) 0%, transparent 100%);
    transition: var(--transition-smooth);
    z-index: 5;
}

.leader-card:hover .leader-info {
    background: rgba(7, 10, 19, 0.95);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.leader-name {
    font-size: 1.4rem;
    font-weight: 700;
}

.leader-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-accent-emerald);
    text-transform: uppercase;
    margin-top: 0.25rem;
}

.leader-bio {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin-top: 1rem;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: all 0.4s ease;
}

.leader-card:hover .leader-bio {
    opacity: 1;
    max-height: 200px;
}

/* --- Blog Page Layout --- */
.blog-masonry {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
}

.blog-card {
    position: relative;
    border-radius: var(--radius-lg);
    background: var(--color-bg-card);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-premium);
    overflow: hidden;
    transition: var(--transition-smooth);
    display: flex;
    flex-direction: column;
}

.blog-card:hover {
    transform: translateY(-5px);
    border-color: var(--color-accent-emerald);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.05);
}

.blog-cover {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, var(--color-bg-dark) 0%, rgba(16, 185, 129, 0.15) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    border-bottom: 1px solid var(--border-color);
}

.blog-body {
    padding: 2rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.blog-meta {
    display: flex;
    gap: 1rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
}

.blog-body h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    line-height: 1.3;
}

.blog-excerpt {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.5;
    flex-grow: 1;
}

.blog-readmore {
    font-family: var(--font-heading);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-accent-emerald);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: var(--transition-fast);
}

.blog-readmore:hover {
    color: #34d399;
    transform: translateX(3px);
}

/* Newsletter Registration Card */
.newsletter-card {
    max-width: 680px;
    margin: 4.5rem auto 0 auto;
    padding: 3rem;
    text-align: center;
}

.newsletter-card h3 {
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
}

.newsletter-card p {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
}

.newsletter-form {
    display: flex;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
}

.newsletter-form input[type="email"] {
    flex-grow: 1;
    background: rgba(7, 10, 19, 0.5);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 0.85rem 1.25rem;
    color: var(--color-text-primary);
    font-family: var(--font-body);
    font-size: 0.9rem;
    outline: none;
    transition: var(--transition-fast);
}

.newsletter-form input[type="email"]:focus {
    border-color: var(--color-accent-emerald);
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
}

/* --- Contact Us Page Layout --- */
.contact-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 4rem;
}

.office-card {
    padding: 2rem;
    margin-bottom: 1.5rem;
}

.office-card h4 {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
    color: var(--color-accent-emerald);
}

.office-info-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.office-info-row label {
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    font-size: 0.75rem;
    width: 60px;
    text-transform: uppercase;
    margin-top: 0.15rem;
}

.office-info-row span {
    color: var(--color-text-secondary);
}

.contact-form-panel {
    padding: 3rem;
}

.contact-form-panel h3 {
    font-size: 1.8rem;
    margin-bottom: 2rem;
}


/* --- Multi-Page Media Queries --- */
@media (max-width: 992px) {
    .services-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    .leader-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }
    .blog-masonry {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }
    .contact-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
}

@media (max-width: 768px) {
    .page-hero-title {
        font-size: 2.5rem;
    }
    .estimator-container {
        padding: 2rem 1.5rem;
    }
    .estimator-outputs {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        text-align: left;
        padding: 1.5rem;
    }
    .estimator-output-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px dashed rgba(255,255,255,0.05);
        padding-bottom: 0.75rem;
    }
    .estimator-output-box label {
        margin-bottom: 0;
    }
    .leader-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    .blog-masonry {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    .newsletter-form {
        flex-direction: column;
        width: 100%;
    }
    .newsletter-form button {
        width: 100%;
    }
    .contact-form-panel {
        padding: 2rem 1.5rem;
    }
}
"@

# Append to styles.css
$content = $content + "`n" + $subPageStyles
[System.IO.File]::WriteAllText($stylesCssPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: styles.css successfully updated with expanded multi-page CSS system!"
