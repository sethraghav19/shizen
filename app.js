/* ==========================================================================
   SHIZEN ECO-ENGINEERING & HEAVY LOGISTICS - INTERACTIVE APPLICATION
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initFleetShowroom();
    initCargoCalculator();
    initRouteSimulator();
    initQuoteWizard();
    initHero3DEngine(); // Core 3D Experience Integration
    initSubPageFeatures(); // Sub-page expanded interactions
});

/* ==========================================================================
   01. HEADER NAVIGATION INTERACTION
   ========================================================================== */
function initHeader() {
    const header = document.getElementById("main-header");
    const navLinks = document.querySelectorAll("#navbar a");
    const isHomePage = !!document.getElementById("hero-3d-canvas");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            if (isHomePage) {
                header.classList.remove("scrolled");
            }
        }
        
        if (!isHomePage) return;
        
        // Dynamic scroll-spy highlight
        let current = "";
        const sections = document.querySelectorAll("section");
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}` || (current === "hero" && link.getAttribute("href") === "index.html")) {
                link.classList.add("active");
            }
        });
    });
}

/* ==========================================================================
   02. FLEET SHOWROOM & STEERING MATRIX CONFIGURATOR
   ========================================================================== */
const FLEET_DATA = {
    "spmt": {
        title: "Self-Propelled Hydraulic Transporter (SPMT)",
        desc: "The absolute standard for mega-logistics. Powered by clean hydrogen Power Pack Units (PPUs), each module boasts 8 heavy-duty electronic-steer axle lines. Modules can be coupled side-by-side or end-to-end to transport massive payloads over 10,000 tons with millimeter precision.",
        badge: "Active Model: Shizen SPMT-8-H",
        img: "assets/spmt_schematic.png",
        specs: {
            payload: "320 t",
            steering: "±135°",
            axles: "8 lines",
            propulsion: "Hydrogen Fuel Cell"
        },
        capacity: 92
    },
    "blade-lifter": {
        title: "Active Rotor Blade Lifter",
        desc: "Specifically engineered for wind energy infrastructure. Equipped with an active rotor blade adapter, this vehicle can lift a colossal turbine blade up to a 60° angle and rotate it 360° dynamically to safely navigate low-clearance cliffs and narrow urban corridors.",
        badge: "Active Model: Shizen BladeLifter-S85",
        img: "assets/blade_lifter_schematic.png",
        specs: {
            payload: "25 t (Max Blade weight)",
            steering: "±65° (Adapter 360°)",
            axles: "12 lines",
            propulsion: "Hybrid Electric"
        },
        capacity: 76
    },
    "hydraulic-trailer": {
        title: "Heavy Hydraulic Semi-Trailer",
        desc: "Ideal for heavy industrial columns, turbines, and transformers. Features fully independent hydraulic suspension cylinders on each axle line to maintain a perfectly horizontal cargo bed, even when negotiating massive 15% steep road gradients.",
        badge: "Active Model: Shizen Hydro-10-SL",
        img: "assets/spmt_schematic.png",
        specs: {
            payload: "480 t",
            steering: "±55° (Self-Steering)",
            axles: "10 lines",
            propulsion: "Eco-Diesel/Hybrid"
        },
        capacity: 84
    },
    "heavy-tractor": {
        title: "Hybrid Heavy Duty Tractor",
        desc: "The muscle behind the heavy-lift convoy. An ultra-heavy tractor equipped with an all-wheel hybrid electric drivetrain, delivering 850 horsepower and immense starting torque, capable of pulling gross train weights up to 1,000 tons with zero initial carbon output.",
        badge: "Active Model: Shizen PrimeTractor-X8",
        img: "assets/hero_banner.png",
        specs: {
            payload: "1,000 t pulling",
            steering: "All-wheel steer",
            axles: "4 lines (Tractor)",
            propulsion: "Hydrogen/Hybrid Engine"
        },
        capacity: 65
    }
};

function initFleetShowroom() {
    const title = document.getElementById("fleet-title");
    if (!title) return;

    const tabs = document.querySelectorAll(".fleet-tab-btn");
    const desc = document.getElementById("fleet-desc");
    const badge = document.getElementById("fleet-badge");
    const img = document.getElementById("fleet-image");
    
    const specPayload = document.getElementById("fleet-spec-payload");
    const specSteering = document.getElementById("fleet-spec-steering");
    const specAxles = document.getElementById("fleet-spec-axles");
    const specPropulsion = document.getElementById("fleet-spec-propulsion");
    const capBar = document.getElementById("capacity-progress-bar");
    const capVal = document.getElementById("capacity-limit-value");

    // Canvas variables for steering wheel render
    const canvas = document.getElementById("steering-canvas");
    const ctx = canvas.getContext("2d");
    let activeSteerMode = "all-wheel";
    let activeFleet = "spmt";

    function updateShowroom(fleetKey) {
        activeFleet = fleetKey;
        const data = FLEET_DATA[fleetKey];
        if (!data) return;

        title.textContent = data.title;
        desc.textContent = data.desc;
        badge.textContent = data.badge;
        img.src = data.img;

        specPayload.textContent = data.specs.payload;
        specSteering.textContent = data.specs.steering;
        specAxles.textContent = data.specs.axles;
        specPropulsion.textContent = data.specs.propulsion;

        capBar.style.width = `${data.capacity}%`;
        capVal.textContent = `${data.capacity}%`;

        // Reset or redraw steering canvas
        drawSteeringCanvas();
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const fleetKey = tab.getAttribute("data-fleet");
            updateShowroom(fleetKey);
        });
    });

    // Handle steering mode button clicks
    const modeBtns = document.querySelectorAll("#steering-buttons .mode-btn");
    const modeLabel = document.getElementById("steering-mode-label");

    modeBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            modeBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeSteerMode = btn.getAttribute("data-mode");
            modeLabel.textContent = btn.textContent;
            drawSteeringCanvas();
        });
    });

    // Technical Axle/Wheel Steering Drawing Function
    function drawSteeringCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const axleCount = 5; // Draw 5 axle representations
        const padding = 15;
        const spacing = (canvas.width - padding * 2) / (axleCount - 1);
        const centerY = canvas.height / 2;
        const axleLength = 20;
        
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 2;
        
        // Draw trailer main chassis centerline link
        ctx.beginPath();
        ctx.moveTo(padding, centerY);
        ctx.lineTo(canvas.width - padding, centerY);
        ctx.stroke();

        for (let i = 0; i < axleCount; i++) {
            const x = padding + i * spacing;
            
            // Draw axle beam
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.beginPath();
            ctx.moveTo(x, centerY - axleLength/2);
            ctx.lineTo(x, centerY + axleLength/2);
            ctx.stroke();

            // Calculate wheel turning angle based on steering modes
            let angle = 0;
            const progressRatio = (i - (axleCount - 1) / 2) / ((axleCount - 1) / 2); // -1 to 1

            if (activeSteerMode === "all-wheel") {
                // All-wheel steering: front axles steer left, back axles steer right
                angle = -progressRatio * 35 * (Math.PI / 180);
            } else if (activeSteerMode === "crab") {
                // Crab steer: all axles aligned at same angle
                angle = -25 * (Math.PI / 180);
            } else if (activeSteerMode === "carousel") {
                // Carousel steer: axles turn to form concentric circle rotation
                angle = -progressRatio * 45 * (Math.PI / 180);
                if (i === 2) angle = 90 * (Math.PI / 180); // Middle lock
            }

            // Draw Top Wheel
            drawWheel(x, centerY - axleLength/2, angle);
            // Draw Bottom Wheel
            drawWheel(x, centerY + axleLength/2, angle);
        }
    }

    function drawWheel(x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Wheel casing style
        ctx.fillStyle = activeSteerMode !== "all-wheel" ? "var(--color-accent-orange)" : "var(--color-accent-emerald)";
        ctx.fillRect(-6, -2, 12, 4);
        
        ctx.restore();
    }

    // Initialize with first draw
    drawSteeringCanvas();
}

/* ==========================================================================
   03. CARGO LOAD & ECOLOGICAL CALCULATOR
   ========================================================================== */
const CARGO_PRESETS = {
    "blade": {
        name: "Turbine Blade",
        weightMin: 20,
        weightMax: 90,
        weightVal: 65,
        lengthMin: 40,
        lengthMax: 110,
        lengthVal: 85,
        vehicle: "Shizen BladeLifter-S85",
        baseAxles: 12,
        radFactor: 0.55
    },
    "transformer": {
        name: "Substation Transformer",
        weightMin: 100,
        weightMax: 500,
        weightVal: 280,
        lengthMin: 10,
        lengthMax: 30,
        lengthVal: 16,
        vehicle: "Shizen Hydro-10-SL (Dual Coupled)",
        baseAxles: 20,
        radFactor: 0.8
    },
    "reactor": {
        name: "Industrial Reactor Column",
        weightMin: 200,
        weightMax: 1200,
        weightVal: 650,
        lengthMin: 20,
        lengthMax: 90,
        lengthVal: 55,
        vehicle: "Shizen SPMT-8-H Coupled Platform",
        baseAxles: 32,
        radFactor: 1.2
    }
};

function initCargoCalculator() {
    const weightSlider = document.getElementById("cargo-weight-slider");
    if (!weightSlider) return;

    const presets = document.querySelectorAll(".cargo-preset-card");
    const lengthSlider = document.getElementById("cargo-length-slider");
    
    const labelType = document.getElementById("selected-cargo-type");
    const labelWeight = document.getElementById("calc-weight-val");
    const labelLength = document.getElementById("calc-length-val");
    
    const resVehicle = document.getElementById("res-vehicle");
    const resAxles = document.getElementById("res-axles");
    const resAxleLoad = document.getElementById("res-axle-load");
    const resCog = document.getElementById("res-cog");
    const resRadius = document.getElementById("res-radius");
    const resCo2 = document.getElementById("res-co2-saved");
    
    const overloadAlert = document.getElementById("calc-overload-alert");
    
    let activePresetKey = "blade";

    function updateSlidersForPreset(presetKey) {
        const preset = CARGO_PRESETS[presetKey];
        if (!preset) return;

        activePresetKey = presetKey;
        labelType.textContent = preset.name;

        // Update range min/max bounds and active value
        weightSlider.min = preset.weightMin;
        weightSlider.max = preset.weightMax;
        weightSlider.value = preset.weightVal;

        lengthSlider.min = preset.lengthMin;
        lengthSlider.max = preset.lengthMax;
        lengthSlider.value = preset.lengthVal;

        calculateCargoSystem();
    }

    function calculateCargoSystem() {
        const preset = CARGO_PRESETS[activePresetKey];
        const weight = parseFloat(weightSlider.value);
        const length = parseFloat(lengthSlider.value);

        labelWeight.textContent = `${weight} Tons`;
        labelLength.textContent = `${length} Meters`;

        // Core dynamic physics estimations
        // 1. Dynamic Axles required: increases with load
        // Assumes 1 axle can safely support 25 tons (standard rating)
        const axlesNeeded = Math.max(preset.baseAxles, Math.ceil(weight / 22));
        
        // 2. Average axle load
        const averageLoad = (weight / axlesNeeded).toFixed(1);
        
        // 3. Turning Swept Radius calculation
        const turnRadius = (length * preset.radFactor + (axlesNeeded * 0.4)).toFixed(1);
        
        // 4. Center of Gravity stability index
        // CoG increases vertically and destabilizes slightly based on weight & length proportions
        const stabilityIndex = (5.5 - (weight / 500) - (length / 180)).toFixed(1);
        let cogText = `Safe Margin (${stabilityIndex}m)`;
        resCog.className = "emerald";

        if (stabilityIndex < 3.0) {
            cogText = `CRITICAL WARNING (${stabilityIndex}m)`;
            resCog.className = "";
            resCog.style.color = "var(--color-danger)";
        } else {
            resCog.style.color = "";
        }

        // 5. Environmental carbon offset
        // Carbon saved increases proportional to weight moved sustainably
        const co2Saved = (weight * 0.08 + (length * 0.02)).toFixed(1);

        // Update Results Display panel
        resVehicle.textContent = preset.vehicle;
        resAxles.textContent = `${axlesNeeded} Axle Lines`;
        resAxleLoad.textContent = `${averageLoad} t / Axle`;
        resCog.textContent = cogText;
        resRadius.textContent = `${turnRadius} m`;
        resCo2.textContent = `${co2Saved} Tons CO2`;

        // Check if weight triggers structural overload threshold (e.g. 85% of limit max slider)
        const maxThreshold = preset.weightMax * 0.85;
        if (weight > maxThreshold) {
            overloadAlert.classList.add("active");
            resAxleLoad.style.color = "var(--color-danger)";
            resAxleLoad.style.fontWeight = "bold";
        } else {
            overloadAlert.classList.remove("active");
            resAxleLoad.style.color = "";
            resAxleLoad.style.fontWeight = "";
        }
    }

    // Set up presets event listeners
    presets.forEach(card => {
        card.addEventListener("click", () => {
            presets.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            const presetKey = card.getAttribute("data-preset");
            updateSlidersForPreset(presetKey);
        });
    });

    // Set up slider update events
    weightSlider.addEventListener("input", calculateCargoSystem);
    lengthSlider.addEventListener("input", calculateCargoSystem);

    // Initial calculation setup
    updateSlidersForPreset("blade");
}

/* ==========================================================================
   04. ACTIVE ROUTE SWEEP SIMULATOR
   ========================================================================== */
function initRouteSimulator() {
    const playBtn = document.getElementById("btn-play-sim");
    const roadPath = document.getElementById("road-path");
    if (!playBtn || !roadPath) return;

    const progressLabel = document.getElementById("sim-progress-metric");
    const statusIndicator = document.getElementById("sim-status-indicator");
    const vehicleGroup = document.getElementById("svg-vehicle-group");

    let isPlaying = false;
    let progress = 0; // percentage along path (0 to 1)
    let animationFrameId = null;
    const speed = 0.0018; // Speed of vehicle traversal

    // Total length of SVG roadway path
    const pathLength = roadPath.getTotalLength();

    function animateTransporter() {
        if (!isPlaying) return;

        progress += speed;
        if (progress > 1) {
            progress = 0; // Loop simulation
        }

        // Calculate point along road
        const currentLength = progress * pathLength;
        const currentPoint = roadPath.getPointAtLength(currentLength);
        
        // Calculate tangent (slope) to rotate the transporter beautifully along road curves
        const deltaLength = 2; // Offset for tangent calculation
        const nextPoint = roadPath.getPointAtLength(Math.min(pathLength, currentLength + deltaLength));
        
        const angleRad = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x);
        const angleDeg = angleRad * (180 / Math.PI);

        // Update SVG position and transform
        vehicleGroup.setAttribute("transform", `translate(${currentPoint.x}, ${currentPoint.y}) rotate(${angleDeg})`);

        // Update controls HUD metrics
        progressLabel.textContent = `Progress: ${Math.round(progress * 100)}% | Speed: 15 km/h`;

        // Dynamic status check depending on road segment curve severity
        if (progress > 0.45 && progress < 0.65) {
            statusIndicator.textContent = "STATUS: CRITICAL BEND CLEARANCE";
            statusIndicator.style.color = "var(--color-accent-orange)";
            statusIndicator.style.background = "rgba(245, 158, 11, 0.1)";
        } else {
            statusIndicator.textContent = "STATUS: SAFE PATH TRANSIT";
            statusIndicator.style.color = "var(--color-accent-emerald)";
            statusIndicator.style.background = "rgba(16, 185, 129, 0.1)";
        }

        animationFrameId = requestAnimationFrame(animateTransporter);
    }

    playBtn.addEventListener("click", () => {
        if (isPlaying) {
            isPlaying = false;
            playBtn.textContent = "▶";
            cancelAnimationFrame(animationFrameId);
            statusIndicator.textContent = "STATUS: SIMULATION PAUSED";
            statusIndicator.style.color = "var(--color-text-secondary)";
            statusIndicator.style.background = "";
        } else {
            isPlaying = true;
            playBtn.textContent = "⏸";
            animateTransporter();
        }
    });

    // Set initial layout position of transporter at start of path
    const startPoint = roadPath.getPointAtLength(0);
    const initialNext = roadPath.getPointAtLength(2);
    const initialAngle = Math.atan2(initialNext.y - startPoint.y, initialNext.x - startPoint.x) * (180 / Math.PI);
    vehicleGroup.setAttribute("transform", `translate(${startPoint.x}, ${startPoint.y}) rotate(${initialAngle})`);
}

/* ==========================================================================
   05. MULTI-STEP LOGISTICS QUOTE BUILDER
   ========================================================================== */
function initQuoteWizard() {
    const wizardForm = document.getElementById("quote-wizard-form");
    if (!wizardForm) return;

    const steps = document.querySelectorAll(".quote-step-indicator");
    const contents = document.querySelectorAll(".quote-step-content");
    const btnBack = document.getElementById("btn-wizard-back");
    const btnNext = document.getElementById("btn-wizard-next");
    const navContainer = document.getElementById("wizard-navigation-container");
    const refLabel = document.getElementById("quote-ref-number");

    let currentStep = 1;
    const maxStep = 3;

    function renderStep() {
        // Toggle step layout panels
        contents.forEach(content => {
            content.classList.remove("active");
            if (parseInt(content.getAttribute("data-step")) === currentStep) {
                content.classList.add("active");
            }
        });

        // Toggle wizard progress headers
        steps.forEach(step => {
            step.classList.remove("active", "completed");
            const stepNum = parseInt(step.getAttribute("data-step"));
            if (stepNum === currentStep) {
                step.classList.add("active");
            } else if (stepNum < currentStep) {
                step.classList.add("completed");
            }
        });

        // Update button states
        if (currentStep === 1) {
            btnBack.style.visibility = "hidden";
        } else {
            btnBack.style.visibility = "visible";
        }

        if (currentStep === maxStep) {
            btnNext.textContent = "Generate Proposal Plan";
            btnNext.className = "btn btn-warning";
        } else if (currentStep > maxStep) {
            // Success State reached
            steps.forEach(s => s.classList.add("completed"));
            navContainer.style.display = "none"; // Hide buttons footer completely
        } else {
            btnNext.textContent = "Next Step";
            btnNext.className = "btn btn-primary";
        }
    }

    function validateStep(step) {
        // Find inputs in current step container
        const activeContainer = document.getElementById(`step-${step}-content`);
        if (!activeContainer) return true;

        const inputs = activeContainer.querySelectorAll("input[required], select[required]");
        let isValid = true;

        inputs.forEach(input => {
            // Clear prior error borders
            input.style.borderColor = "";

            if (!input.checkValidity() || input.value.trim() === "") {
                isValid = false;
                input.style.borderColor = "var(--color-danger)";
                // Animate tiny shake to draw attention
                input.animate([
                    { transform: 'translateX(-4px)' },
                    { transform: 'translateX(4px)' },
                    { transform: 'translateX(-4px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 200 });
            }
        });

        return isValid;
    }

    btnNext.addEventListener("click", () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < maxStep) {
            currentStep++;
            renderStep();
        } else if (currentStep === maxStep) {
            // Final submission logic
            const oldText = btnNext.innerHTML;
            btnNext.innerHTML = "Sending...";
            btnNext.disabled = true;

            const formData = new FormData();
            formData.append("cargo_name", document.getElementById("form-cargo-name").value);
            formData.append("cargo_weight", document.getElementById("form-cargo-weight").value);
            formData.append("cargo_length", document.getElementById("form-cargo-length").value);
            formData.append("cargo_width", document.getElementById("form-cargo-width").value);
            formData.append("cargo_height", document.getElementById("form-cargo-height").value);
            formData.append("route_origin", document.getElementById("form-route-origin").value);
            formData.append("route_dest", document.getElementById("form-route-dest").value);
            formData.append("route_obstacles", document.getElementById("form-route-obstacles").value);
            formData.append("contact_name", document.getElementById("form-contact-name").value);
            formData.append("contact_email", document.getElementById("form-contact-email").value);
            formData.append("eco_priority", document.getElementById("form-eco-priority").value);
            formData.append("timeline", document.getElementById("form-timeline").value);

            fetch("send_quote.php", {
                method: "POST",
                body: formData
            }).then(response => response.json())
              .then(data => {
                  currentStep++;
                  generateSuccessProposal();
                  btnNext.innerHTML = oldText;
                  btnNext.disabled = false;
              }).catch(err => {
                  console.error(err);
                  // generate success anyway as fallback UX
                  currentStep++;
                  generateSuccessProposal();
                  btnNext.innerHTML = oldText;
                  btnNext.disabled = false;
              });
        }
    });

    btnBack.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep--;
            renderStep();
        }
    });

    function generateSuccessProposal() {
        // Generate dynamic logistics inquiry reference code
        const digits = Math.floor(100000 + Math.random() * 900000);
        const chars = ["PX", "WX", "RX", "LX"][Math.floor(Math.random() * 4)];
        refLabel.textContent = `REFERENCE CODE: SHZ-${digits}-${chars}`;
        
        renderStep();
    }
}

/* ==========================================================================
   06. FULL 3D INTERACTIVE HERO EXPERIENCE
   ========================================================================== */
function initHero3DEngine() {
    const canvas = document.getElementById("hero-3d-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Telemetry DOM elements to update
    const hudAngle = document.getElementById("hud-val-angle");
    const hudSpeed = document.getElementById("hud-val-speed");
    const speedBar = document.getElementById("hud-speed-gauge");
    const btnDrive = document.getElementById("hud-btn-drive");
    const hudZoomVal = document.getElementById("hud-val-zoom"); // Accessible zoom indicator

    // 3D Rendering & State variables
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    
    // Set explicit coordinate resolutions
    function resizeCanvas() {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Orbit Camera State
    let yaw = 0.8;   // Initial Yaw perspective rotation
    let pitch = 0.35; // Downward Pitch perspective
    const cameraDist = 180;
    
    // Zoom scale is now fully mutable and controllable!
    let scale = 740; // 200% zoom standard scale
    const baseScale = 370;
    hudZoomVal.textContent = "200%";
    hudZoomVal.style.color = "var(--color-accent-orange)";

    // Transporter State
    let speed = 15;      // km/h velocity
    let isDriving = true; // Wheel spin status
    let steerAngle = 0;   // Dynamic steering angle (radians)
    let steerMode = "all-wheel"; // 'all-wheel', 'crab', 'carousel'
    let wheelRotation = 0;       // Spin progress of modular wheels

    // Mouse Drag Interaction handlers
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        
        yaw += deltaX * 0.007;
        pitch = Math.max(-0.4, Math.min(1.2, pitch + deltaY * 0.007)); // Lock vertical limits
        
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });

    window.addEventListener("mouseup", () => { isDragging = false; });

    // --- INTERACTIVE MOUSE WHEEL SCROLL ZOOM SUPPORT ---
    canvas.addEventListener("wheel", (e) => {
        e.preventDefault(); // Stop window from scrolling down the page
        
        // Dynamically adjust scale bounds between 150 (far away) and 1480 (inspect zoom!)
        scale = Math.max(150, Math.min(1480, scale - e.deltaY * 0.35));
        
        // Update readable Zoom HUD percentage in upper top card
        const zoomPercentage = Math.round((scale / baseScale) * 100);
        hudZoomVal.textContent = zoomPercentage + "%";
        
        if (zoomPercentage > 100) {
            hudZoomVal.style.color = "var(--color-accent-orange)"; // Orange highlight for close inspect zoom
        } else {
            hudZoomVal.style.color = "var(--color-accent-emerald)";
        }
    }, { passive: false });
    
    // Mobile touch pinch-to-zoom support
    let initialTouchDist = 0;
    canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
            initialTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        } else if (e.touches.length === 1) {
            isDragging = true;
            prevMouseX = e.touches[0].clientX;
            prevMouseY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    canvas.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2 && initialTouchDist > 0) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = dist / initialTouchDist;
            scale = Math.max(150, Math.min(1480, scale * factor));
            initialTouchDist = dist;
            
            const zoomPercentage = Math.round((scale / baseScale) * 100);
            hudZoomVal.textContent = zoomPercentage + "%";
        } else if (e.touches.length === 1 && isDragging) {
            const deltaX = e.touches[0].clientX - prevMouseX;
            const deltaY = e.touches[0].clientY - prevMouseY;
            yaw += deltaX * 0.008;
            pitch = Math.max(-0.4, Math.min(1.2, pitch + deltaY * 0.008));
            prevMouseX = e.touches[0].clientX;
            prevMouseY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    canvas.addEventListener("touchend", () => {
        isDragging = false;
        initialTouchDist = 0;
    });

    // HUD button configurations
    const hudSteerAll = document.getElementById("hud-steer-all");
    const hudSteerCrab = document.getElementById("hud-steer-crab");
    const hudSteerCarousel = document.getElementById("hud-steer-carousel");

    function setSteerMode(mode, activeBtn) {
        steerMode = mode;
        [hudSteerAll, hudSteerCrab, hudSteerCarousel].forEach(btn => btn.classList.remove("active"));
        activeBtn.classList.add("active");
    }

    hudSteerAll.addEventListener("click", () => setSteerMode("all-wheel", hudSteerAll));
    hudSteerCrab.addEventListener("click", () => setSteerMode("crab", hudSteerCrab));
    hudSteerCarousel.addEventListener("click", () => setSteerMode("carousel", hudSteerCarousel));

    btnDrive.addEventListener("click", () => {
        isDriving = !isDriving;
        if (isDriving) {
            btnDrive.classList.add("active");
            speed = 15;
        } else {
            btnDrive.classList.remove("active");
            speed = 0;
        }
        hudSpeed.textContent = speed + " km/h";
        speedBar.style.width = (speed * 3.3) + "%";
    });

    /* ==========================================================================
       3D GEOMETRY DEFINITION (EXACT BRIGHT YELLOW COHERENT VEHICLE RENDER)
       ========================================================================== */
    class Vertex3D {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    class Face3D {
        constructor(indices, color, borderGlow = false) {
            this.indices = indices;
            this.color = color;
            this.borderGlow = borderGlow;
        }
    }

    function makeBox(x, y, z, w, h, d, color) {
        const vertices = [
            new Vertex3D(x - w/2, y - h/2, z - d/2), // 0
            new Vertex3D(x + w/2, y - h/2, z - d/2), // 1
            new Vertex3D(x + w/2, y + h/2, z - d/2), // 2
            new Vertex3D(x - w/2, y + h/2, z - d/2), // 3
            new Vertex3D(x - w/2, y - h/2, z + d/2), // 4
            new Vertex3D(x + w/2, y - h/2, z + d/2), // 5
            new Vertex3D(x + w/2, y + h/2, z + d/2), // 6
            new Vertex3D(x - w/2, y + h/2, z + d/2)  // 7
        ];

        const faces = [
            new Face3D([0, 1, 2, 3], color), // Back
            new Face3D([1, 5, 6, 2], color), // Right
            new Face3D([4, 0, 3, 7], color), // Left
            new Face3D([4, 5, 6, 7], color), // Front
            new Face3D([3, 2, 6, 7], color), // Top
            new Face3D([0, 1, 5, 4], color)  // Bottom
        ];

        return { vertices, faces };
    }

    const model = {
        vertices: [],
        faces: []
    };

    function addModelData(submodel) {
        const baseIndex = model.vertices.length;
        model.vertices.push(...submodel.vertices);
        
        submodel.faces.forEach(face => {
            const remappedIndices = face.indices.map(i => i + baseIndex);
            model.faces.push(new Face3D(remappedIndices, face.color, face.borderGlow));
        });
    }

    // --- RECREATING THE CLEAN BRIGHT YELLOW TRANSPORTER MODEL ---
    // Two 8-axle modular units coupled end-to-end (forming a continuous 16-axle coupled platform).
    // Platform modules are 85 units deep each, coupled exactly at z = 0.
    // 1. Rear platform deck plate (z = -42.5, depth = 85): Electric Emerald Green (#10b981)
    addModelData(makeBox(0, -1, -42.5, 22, 3, 85, "#10b981"));
    // 2. Front platform deck plate (z = 42.5, depth = 85): Electric Emerald Green (#10b981)
    addModelData(makeBox(0, -1, 42.5, 22, 3, 85, "#10b981"));

    // 3. Clear visible coupling seam plate and coupling pin links right at z = 0
    addModelData(makeBox(0, -1, 0, 22.2, 3.2, 0.6, "#1e293b")); // Seam separation plate
    addModelData(makeBox(-8, -1, 0, 2.0, 2.5, 1.8, "#4b5563")); // Left coupler hinge pin
    addModelData(makeBox(8, -1, 0, 2.0, 2.5, 1.8, "#4b5563"));  // Right coupler hinge pin
    addModelData(makeBox(0, -1, 0, 4.0, 2.2, 2.0, "#374151"));  // Central coupling block lock

    // 4. Coherent dark grey rectangular pocket slots along the top deck center (#1e293b)
    const pocketZs = [-75, -65, -55, -45, -35, -25, -15, -5, 5, 15, 25, 35, 45, 55, 65, 75];
    pocketZs.forEach(tz => {
        addModelData(makeBox(0, 0.55, tz, 14, 0.1, 4, "#1e293b"));
        addModelData(makeBox(-7, 0.55, tz, 2, 0.1, 4, "#1e293b"));
        addModelData(makeBox(7, 0.55, tz, 2, 0.1, 4, "#1e293b"));
    });

    // 5. Side casing modular joint profiles: Dark steel-grey profiles (#374151)
    // Sized separately for the two coupled trailers:
    addModelData(makeBox(-11.1, -1, -42.5, 0.2, 2.5, 83.5, "#374151"));
    addModelData(makeBox(11.1, -1, -42.5, 0.2, 2.5, 83.5, "#374151"));
    addModelData(makeBox(-11.1, -1, 42.5, 0.2, 2.5, 83.5, "#374151"));
    addModelData(makeBox(11.1, -1, 42.5, 0.2, 2.5, 83.5, "#374151"));

    // 5b. Symmetrical structural circular coupling holes along the side panels (#1e293b)
    // Renders the round accessory coupling sockets visible on real Goldhofer/Scheuerle side rails
    for (let sz = -70; sz <= 70; sz += 20) {
        if (sz !== 0) {
            addModelData(makeBox(-11.15, -1, sz, 0.1, 1.2, 1.2, "#1e293b"));
            addModelData(makeBox(11.15, -1, sz, 0.1, 1.2, 1.2, "#1e293b"));
        }
    }

    // 6. External heavy coupling heads at absolute front (z = 85.5) and rear (z = -85.5)
    // Symmetrical heavy-duty bolt blocks for connecting further trailers or drawbars:
    addModelData(makeBox(-6, -1, -85.5, 2, 2, 1, "#4b5563"));
    addModelData(makeBox(6, -1, -85.5, 2, 2, 1, "#4b5563"));
    addModelData(makeBox(0, -1, -85.5, 3, 2.2, 1, "#4b5563"));

    addModelData(makeBox(-6, -1, 85.5, 2, 2, 1, "#4b5563"));
    addModelData(makeBox(6, -1, 85.5, 2, 2, 1, "#4b5563"));
    addModelData(makeBox(0, -1, 85.5, 3, 2.2, 1, "#4b5563"));

    // Axle positions for 16 axle lines total (8 lines per coupled module):
    // Spaced exactly 10 units apart, symmetrically mirrored across the central coupling point
    const axleZPositions = [
        -76.5, -66.5, -56.5, -46.5, -36.5, -26.5, -16.5, -6.5,
         6.5,  16.5,  26.5,  36.5,  46.5,  56.5,  66.5,  76.5
    ];
    const wheelWidth = 3;
    const wheelRadius = 3.5;

    /* ==========================================================================
       3D PHYSICS & ENGINE RENDER LOOP
       ========================================================================== */
    function render3D() {
        ctx.fillStyle = "#070a13";
        ctx.fillRect(0, 0, width, height);

        if (isDriving) {
            wheelRotation += speed * 0.005;
            steerAngle = Math.sin(Date.now() * 0.001) * 35 * (Math.PI / 180);
            hudAngle.textContent = "Â±" + Math.abs(Math.round(steerAngle * (180 / Math.PI))) + "Â°";
        }

        if (!isDragging) {
            yaw += 0.0015; // Slow ambient spin
        }

        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);

        let centerX = width / 2;
        if (width > 992) {
            centerX = width * 0.58;
        }

        function project(vertex) {
            let x1 = vertex.x * cosY - vertex.z * sinY;
            let z1 = vertex.x * sinY + vertex.z * cosY;

            let y2 = vertex.y * cosP - z1 * sinP;
            let z2 = vertex.y * sinP + z1 * cosP;

            const depth = z2 + cameraDist;
            
            const px = centerX + x1 * scale / depth;
            const py = (height / 2) - y2 * scale / depth;

            return { x: px, y: py, z: depth };
        }

        // Draw HUD alignment grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // --- 3D AMBIENT OCCLUSION GROUND SHADOW PROJECTION ---
        // Project soft dark shadow footprints on the ground plane (y = -8.5) underneath the trailers
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        const shadowPts1 = [
            project(new Vertex3D(-12, -8.5, -85)),
            project(new Vertex3D(12, -8.5, -85)),
            project(new Vertex3D(12, -8.5, 0)),
            project(new Vertex3D(-12, -8.5, 0))
        ];
        ctx.beginPath();
        ctx.moveTo(shadowPts1[0].x, shadowPts1[0].y);
        ctx.lineTo(shadowPts1[1].x, shadowPts1[1].y);
        ctx.lineTo(shadowPts1[2].x, shadowPts1[2].y);
        ctx.lineTo(shadowPts1[3].x, shadowPts1[3].y);
        ctx.closePath();
        ctx.fill();

        const shadowPts2 = [
            project(new Vertex3D(-12, -8.5, 0)),
            project(new Vertex3D(12, -8.5, 0)),
            project(new Vertex3D(12, -8.5, 85)),
            project(new Vertex3D(-12, -8.5, 85))
        ];
        ctx.beginPath();
        ctx.moveTo(shadowPts2[0].x, shadowPts2[0].y);
        ctx.lineTo(shadowPts2[1].x, shadowPts2[1].y);
        ctx.lineTo(shadowPts2[2].x, shadowPts2[2].y);
        ctx.lineTo(shadowPts2[3].x, shadowPts2[3].y);
        ctx.closePath();
        ctx.fill();

        // --- DYNAMIC NEON Radar Ground Target (y = -8.5) ---
        // Renders concentric sonar rings and vector axes under the vehicle in perfect 3D perspective
        ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
        ctx.lineWidth = 1.5;
        [25, 55, 85].forEach(rad => {
            ctx.beginPath();
            for (let a = 0; a <= 24; a++) {
                const theta = (a / 24) * Math.PI * 2;
                const px = Math.cos(theta) * rad;
                const pz = Math.sin(theta) * rad;
                const pt = project(new Vertex3D(px, -8.5, pz));
                if (a === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
        });

        // Crosshairs on sonar radar grid
        ctx.beginPath();
        const radarX1 = project(new Vertex3D(-95, -8.5, 0));
        const radarX2 = project(new Vertex3D(95, -8.5, 0));
        ctx.moveTo(radarX1.x, radarX1.y); ctx.lineTo(radarX2.x, radarX2.y);
        
        const radarZ1 = project(new Vertex3D(0, -8.5, -95));
        const radarZ2 = project(new Vertex3D(0, -8.5, 95));
        ctx.moveTo(radarZ1.x, radarZ1.y); ctx.lineTo(radarZ2.x, radarZ2.y);
        ctx.stroke();

        const projectedVerts = model.vertices.map(v => project(v));
        const dynamicPolygons = [];

        axleZPositions.forEach((az, axleIdx) => {
            let axleSteer = 0;

            if (steerMode === "all-wheel") {
                // All-wheel steering: front axles steer in one direction, back axles steer opposite
                // Symmetrical concentric pivoting around the coupling seam (z = 0)
                const progressRatio = az / 76.5; // -1 to 1 along transporter Z
                axleSteer = -progressRatio * steerAngle;
            } else if (steerMode === "crab") {
                // Crab steer: all axles steer in parallel
                axleSteer = -steerAngle * 0.7;
            } else if (steerMode === "carousel") {
                // Carousel steer: transporter rotates in place around its origin center (0,0)
                // Center-most wheels steer near 90Â°, outer-most wheels steer at smaller, proportional angles
                const carouselFactor = Math.abs(steerAngle) / (35 * Math.PI / 180);
                const targetAngle = (Math.PI / 2 - Math.atan2(Math.abs(az), 10.0)) * Math.sign(az) * Math.sign(steerAngle);
                axleSteer = targetAngle * carouselFactor;
            }

            const wheelXOffsets = [-10, 10];

            wheelXOffsets.forEach(wx => {
                const cosS = Math.cos(axleSteer);
                const sinS = Math.sin(axleSteer);
                
                const wheelCenterY = -5;

                // --- 1. DYNAMIC STEERABLE HYDRAULIC SUSPENSION ARMS ---
                // Clean white/grey suspension support arm legs, pivoting in 3D
                const pivotX = wx * 0.85;
                const pivotY = -1.5;
                const pivotZ = az;
                const armWidth = 1.2;

                const armVerts = [
                    new Vertex3D(pivotX - armWidth, pivotY, pivotZ),
                    new Vertex3D(pivotX + armWidth, pivotY, pivotZ),
                    new Vertex3D(wx - armWidth * cosS, wheelCenterY, az - armWidth * sinS),
                    new Vertex3D(wx + armWidth * cosS, wheelCenterY, az + armWidth * sinS),
                    new Vertex3D(pivotX, pivotY, pivotZ + 2),
                    new Vertex3D(wx * 0.95 + cosS * 2, wheelCenterY + 1.5, az + sinS * 2)
                ];

                const projArmVerts = armVerts.map(av => project(av));
                const avgArmZ = projArmVerts.reduce((sum, p) => sum + p.z, 0) / projArmVerts.length;

                dynamicPolygons.push({
                    points: [projArmVerts[0], projArmVerts[1], projArmVerts[3], projArmVerts[2]],
                    z: avgArmZ,
                    color: "#9ca3af", // Clean silver/grey suspension leg frame
                    borderGlow: false
                });
                dynamicPolygons.push({
                    points: [projArmVerts[0], projArmVerts[2], projArmVerts[5], projArmVerts[4]],
                    z: avgArmZ,
                    color: "#4b5563", // Dark steel structural support linkage
                    borderGlow: false
                });

                // --- DYNAMIC HYDRAULIC STEERING CYLINDER LINKAGE RODS ---
                // Symmetrical silver steering pistons that dynamically pivot and slide with steer angle!
                const rodStartX = pivotX * 0.45;
                const rodStartY = -1.2;
                const rodStartZ = az;
                
                const rodEndX = wx - armWidth * cosS * 0.5;
                const rodEndY = wheelCenterY + 1.2;
                const rodEndZ = az - armWidth * sinS * 0.5;
                
                const projRodStart = project(new Vertex3D(rodStartX, rodStartY, rodStartZ));
                const projRodEnd = project(new Vertex3D(rodEndX, rodEndY, rodEndZ));
                
                dynamicPolygons.push({
                    points: [projRodStart, projRodEnd],
                    z: (projRodStart.z + projRodEnd.z) / 2,
                    color: "#d1d5db", // Polished silver hydraulic piston rod
                    isLine: true
                });

                // --- 2. DUAL WHEELS WITH BRIGHT YELLOW CAPS (4 TIRES PER AXLE LINE) ---
                const dualOffsets = [-1.5, 1.5];

                dualOffsets.forEach(dw => {
                    const wheelVerts = [];
                    const thetaStep = Math.PI / 4;

                    for (let a = 0; a < 8; a++) {
                        const theta = a * thetaStep + wheelRotation;
                        const localX = Math.cos(theta) * wheelRadius;
                        const localY = Math.sin(theta) * wheelRadius + wheelCenterY;
                        
                        const zOffsetOuter = az + dw + (wx < 0 ? -wheelWidth/2 : wheelWidth/2);
                        const zOffsetInner = az + dw;

                        const xOut = wx + (localX * cosS);
                        const zOut = zOffsetOuter + (localX * sinS);
                        
                        const xIn = wx + (localX * cosS);
                        const zIn = zOffsetInner + (localX * sinS);

                        wheelVerts.push(new Vertex3D(xOut, localY, zOut));
                        wheelVerts.push(new Vertex3D(xIn, localY, zIn));
                    }

                    const projWheelVerts = wheelVerts.map(wv => project(wv));

                    // Tread panels
                    for (let a = 0; a < 8; a++) {
                        const idx1 = a * 2;
                        const idx2 = ((a + 1) % 8) * 2;
                        const idx3 = ((a + 1) % 8) * 2 + 1;
                        const idx4 = a * 2 + 1;

                        const avgZ = (projWheelVerts[idx1].z + projWheelVerts[idx2].z + projWheelVerts[idx3].z + projWheelVerts[idx4].z) / 4;

                        dynamicPolygons.push({
                            points: [projWheelVerts[idx1], projWheelVerts[idx2], projWheelVerts[idx3], projWheelVerts[idx4]],
                            z: avgZ,
                            color: "#334155", // Clean tyre slate grey
                            borderGlow: false
                        });
                    }

                    // Outer hub cap base (Silver wheel rim cap)
                    const sideHubPoints = [0, 2, 4, 6, 8, 10, 12, 14].map(idx => projWheelVerts[idx]);
                    const avgHubZ = sideHubPoints.reduce((sum, p) => sum + p.z, 0) / sideHubPoints.length;

                    dynamicPolygons.push({
                        points: sideHubPoints,
                        z: avgHubZ,
                        color: "#9ca3af", // Silver rim hub
                        borderGlow: false
                    });

                    // --- HUB CAP CENTER: Electric Emerald Green (#10b981) ---
                    // Wheels have beautiful silver rims with yellow center bolt caps!
                    const yellowCapVerts = [];
                    for (let a = 0; a < 8; a++) {
                        const theta = a * thetaStep + wheelRotation;
                        const localX = Math.cos(theta) * (wheelRadius * 0.45); // Smaller central cap
                        const localY = Math.sin(theta) * (wheelRadius * 0.45) + wheelCenterY;
                        
                        const zOuterCap = az + dw + (wx < 0 ? -wheelWidth/2 : wheelWidth/2) + 0.1; // Offset slightly outer
                        const xCap = wx + (localX * cosS);
                        const zCap = zOuterCap + (localX * sinS);
                        
                        yellowCapVerts.push(new Vertex3D(xCap, localY, zCap));
                    }

                    const projCapVerts = yellowCapVerts.map(cv => project(cv));
                    const avgCapZ = projCapVerts.reduce((sum, p) => sum + p.z, 0) / projCapVerts.length;

                    dynamicPolygons.push({
                        points: projCapVerts,
                        z: avgCapZ - 0.2, // Offset Z slightly closer in Painters sorting
                        color: "#10b981", // Electric Emerald Green center hub cap!
                        borderGlow: false
                    });
                });
            });
        });

        // Assemble overall polygons
        const allPolygons = [];

        // Project static model faces
        model.faces.forEach((face, idx) => {
            const facePoints = face.indices.map(idx => projectedVerts[idx]);
            const avgZ = facePoints.reduce((sum, p) => sum + p.z, 0) / facePoints.length;

            allPolygons.push({
                points: facePoints,
                z: avgZ,
                color: face.color,
                borderGlow: face.borderGlow
            });
        });

        // Mix in dynamic wheels & suspension arms
        allPolygons.push(...dynamicPolygons);

        // Depth Sorting (Painter's Algorithm)
        allPolygons.sort((polyA, polyB) => polyB.z - polyA.z);

        // Render sorted polygons
        allPolygons.forEach(polygon => {
            const pts = polygon.points;

            // Render lines (e.g. steering hydraulic piston linkages) immediately in depth order
            if (polygon.isLine) {
                if (pts.length < 2) return;
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                ctx.lineTo(pts[1].x, pts[1].y);
                ctx.strokeStyle = polygon.color;
                ctx.lineWidth = 2.5;
                ctx.stroke();
                return;
            }

            if (pts.length < 3) return;

            const edge1X = pts[1].x - pts[0].x;
            const edge1Y = pts[1].y - pts[0].y;
            const edge2X = pts[2].x - pts[0].x;
            const edge2Y = pts[2].y - pts[0].y;
            
            const crossProduct = edge1X * edge2Y - edge1Y * edge2X;
            if (crossProduct < 0) return;

            // Diffuse & Specular Metallic Lighting Math
            const light = { x: 0.6, y: 0.8, z: -0.4 };
            const d1 = { x: pts[1].x - pts[0].x, y: pts[1].y - pts[0].y, z: pts[1].z - pts[0].z };
            const d2 = { x: pts[2].x - pts[0].x, y: pts[2].y - pts[0].y, z: pts[2].z - pts[0].z };
            
            const normal = {
                x: d1.y * d2.z - d1.z * d2.y,
                y: d1.z * d2.x - d1.x * d2.z,
                z: d1.x * d2.y - d1.y * d2.x
            };
            const mag = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
            
            let lightIntensity = 0.8;
            let specular = 0;
            if (mag > 0.001) {
                normal.x /= mag; normal.y /= mag; normal.z /= mag;
                const dot = normal.x * light.x + normal.y * light.y + normal.z * light.z;
                lightIntensity = 0.45 + Math.max(0, dot) * 0.45;

                // Specular white highlight sheen (Shiny industrial gloss reflection)
                const hx = 0.28; const hy = 0.45; const hz = -0.85; // halfway view reflection vector
                const hdot = normal.x * hx + normal.y * hy + normal.z * hz;
                if (hdot > 0) {
                    specular = Math.pow(hdot, 10) * 0.4;
                }
            }

            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.closePath();

            ctx.fillStyle = adjustBrightness(polygon.color, lightIntensity, specular);
            ctx.fill();

            if (polygon.borderGlow) {
                ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            } else {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });

        requestAnimationFrame(render3D);
    }

    function adjustBrightness(hex, percent, specular = 0) {
        if (!hex.startsWith('#')) return hex;
        let R = parseInt(hex.substring(1, 3), 16);
        let G = parseInt(hex.substring(3, 5), 16);
        let B = parseInt(hex.substring(5, 7), 16);

        R = Math.max(0, Math.min(255, Math.floor(R * percent)));
        G = Math.max(0, Math.min(255, Math.floor(G * percent)));
        B = Math.max(0, Math.min(255, Math.floor(B * percent)));

        if (specular > 0) {
            R = Math.min(255, R + Math.floor(255 * specular));
            G = Math.min(255, G + Math.floor(255 * specular));
            B = Math.min(255, B + Math.floor(255 * specular));
        }

        const rHex = R.toString(16).padStart(2, '0');
        const gHex = G.toString(16).padStart(2, '0');
        const bHex = B.toString(16).padStart(2, '0');

        return "#" + rHex + gHex + bHex;
    }

    render3D();
}

/* ==========================================================================
   07. SUB-PAGE FEATURES & INTERACTIONS
   ========================================================================== */
function initSubPageFeatures() {
    // 1. Services Page Estimator
    initServicesEstimator();
    
    // 2. Contact Page Form Validation & Submission
    initContactForm();
    
    // 3. About Us Leaders Bio Interaction
    initAboutLeaders();
    
    // 4. Blog Page Newsletter Registration
    initBlogNewsletter();
    
    // 5. Dynamic Blog System & SEO Engine (New!)
    initDynamicBlog();
    
    // 6. Admin Portal Controller (New!)
    initAdminPortal();
}

function initServicesEstimator() {
    const serviceSelect = document.getElementById("est-service-class");
    const weightSlider = document.getElementById("est-weight-slider");
    const distanceSlider = document.getElementById("est-distance-slider");
    
    if (!serviceSelect || !weightSlider || !distanceSlider) return;
    
    const labelWeight = document.getElementById("est-weight-val");
    const labelDistance = document.getElementById("est-distance-val");
    const outputPrice = document.getElementById("est-price-val");
    const outputCo2 = document.getElementById("est-co2-val");
    const outputTime = document.getElementById("est-time-val");
    
    const multipliers = {
        "spmt": { base: 2500, perTon: 15, perKm: 25, co2PerTonKm: 0.002, speed: 12 },
        "blade": { base: 4500, perTon: 25, perKm: 35, co2PerTonKm: 0.003, speed: 15 },
        "hydraulic": { base: 3500, perTon: 20, perKm: 30, co2PerTonKm: 0.0025, speed: 18 },
        "tractor": { base: 1800, perTon: 10, perKm: 15, co2PerTonKm: 0.0015, speed: 25 }
    };
    
    function updateEstimator() {
        const service = serviceSelect.value;
        const weight = parseInt(weightSlider.value);
        const distance = parseInt(distanceSlider.value);
        
        labelWeight.textContent = `${weight} Tons`;
        labelDistance.textContent = `${distance} km`;
        
        const params = multipliers[service] || multipliers["spmt"];
        
        // Dynamic Pricing Equation
        const rawPrice = params.base + (weight * params.perTon * (distance / 10)) + (distance * params.perKm);
        const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rawPrice);
        
        // Eco Savings metric vs traditional transport
        const co2Saved = ((weight * distance * 0.12) / 1000).toFixed(2); 
        
        // Estimated travel duration (hours)
        const travelHours = Math.ceil(distance / params.speed);
        let durationText = `${travelHours} hrs`;
        if (travelHours > 24) {
            const days = Math.floor(travelHours / 24);
            const hrs = travelHours % 24;
            durationText = `${days}d ${hrs}h`;
        }
        
        outputPrice.textContent = formattedPrice;
        outputCo2.textContent = `${co2Saved} Tons`;
        outputTime.textContent = durationText;
    }
    
    serviceSelect.addEventListener("change", updateEstimator);
    weightSlider.addEventListener("input", updateEstimator);
    distanceSlider.addEventListener("input", updateEstimator);
    
    updateEstimator();
}

function initContactForm() {
    const form = document.getElementById("contact-inquiry-form");
    if (!form) return;
    
    const successAlert = document.getElementById("contact-success-alert");
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Simple form validation
        const inputs = form.querySelectorAll("input[required], textarea[required], select[required]");
        let isValid = true;
        
        inputs.forEach(input => {
            input.style.borderColor = "";
            if (!input.checkValidity() || input.value.trim() === "") {
                isValid = false;
                input.style.borderColor = "var(--color-danger)";
            }
        });
        
        if (!isValid) return;

        const btnSubmit = form.querySelector("button[type='submit']");
        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = "Transmitting...";
        btnSubmit.disabled = true;

        const formData = new FormData();
        formData.append("contact_name", document.getElementById("contact-name").value);
        formData.append("contact_email", document.getElementById("contact-email").value);
        formData.append("contact_service", document.getElementById("contact-service").value);
        formData.append("contact_payload", document.getElementById("contact-payload").value);
        formData.append("contact_message", document.getElementById("contact-message").value);

        fetch("send_contact.php", {
            method: "POST",
            body: formData
        }).then(response => response.json())
          .then(data => {
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
            
            // Show success block
            if (successAlert) {
                successAlert.style.display = "block";
                successAlert.animate([
                    { opacity: 0, transform: 'translateY(10px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], { duration: 300, fill: 'forwards' });
                
                form.reset();
                successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert("Inquiry successfully transmitted! Our special transport unit will contact you within 24 hours.");
                form.reset();
            }
          }).catch(err => {
              console.error(err);
              btnSubmit.innerHTML = originalText;
              btnSubmit.disabled = false;
              alert("Transmission failed. Please check your network connection.");
          });
    });
}

function initAboutLeaders() {
    const leaderCards = document.querySelectorAll(".leader-card");
    leaderCards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("mobile-active");
        });
    });
}

function initBlogNewsletter() {
    const form = document.getElementById("blog-newsletter-form");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = form.querySelector("input[type='email']");
        if (!emailInput) return;
        
        const email = emailInput.value.trim();
        if (email === "") return;
        
        const button = form.querySelector("button");
        const originalText = button.textContent;
        
        button.textContent = "Subscribed ✓";
        button.style.backgroundColor = "var(--color-accent-emerald)";
        button.style.borderColor = "var(--color-accent-emerald)";
        emailInput.value = "";
        emailInput.disabled = true;
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = "";
            button.style.borderColor = "";
            emailInput.disabled = false;
            button.disabled = false;
        }, 5000);
    });
}

/* ==========================================================================
   08. MOCK DATABASE & DYNAMIC BLOG PERSISTENCE REGISTRY
   ========================================================================== */
const DEFAULT_BLOG_SEEDS = [
    {
        id: "seed-blog-1",
        title: "Navigating 85m Rotor Blades Through Mountain Passages",
        category: "Field Report",
        date: "May 28, 2026",
        cover: "🏔️",
        excerpt: "We document the extreme engineering coordination required to transport mega wind turbine blades through narrow alpine passes in Bavaria, utilizing the active blade lifter's tilting hydraulics.",
        content: "<p>Moving rotor blades of monumental proportions requires not just raw mechanical muscle, but micro-precision kinematic coordination. In this field operations report, our heavy transport crew shares insights from the transit of three 85-meter blades to the Boreas Windpark, situated high in the Bavarian Alps.</p><h4>The Mountain Corridor Challenge</h4><p>The routing trajectory presented seven tight, serpentine curves with a vertical incline of up to 12%. Standard heavy haulage flatbed trailers would have been locked immediately by cliff faces on the inner radius and weak safety barriers on the outer edge. The swept-path corridor width was less than 4.5 meters in multiple critical zones.</p><h4>Leveraging Active Hydrolift Adaptability</h4><p>To navigate these narrow clearances, Shizen deployed our Active Rotor Blade Lifter. This specialized adapter operates via heavy hydraulic pivot pistons mounted to a multi-axle trailer, enabling our engineers to dynamically lift the blade up to a 60° tilt angle and swing it 360° horizontally in real-time. By raising the blades over tree lines, rocks, and historical structures, our swept-path footprint was reduced by 72%.</p><h4>Precise Telemetry Analysis</h4><p>Wind velocities were strictly monitored. Lifting an 85-meter blade increases susceptibility to lateral wind loads, effectively turning the cargo into a massive sail. Feasibility limits dictated that operations had to cease immediately if crosswinds exceeded 10.5 m/s. Fortunately, the integration of autonomous sensors mapped wind telemetry in real-time, validating stability safe margins throughout the entire 12-hour transport run. The wind turbines are now successfully erected and generating green power, operating in perfect harmony with the alpine ecosystem.</p>",
        seoTitle: "Alpine Wind Turbine Blade Logistics Case Study | Shizen",
        seoDesc: "Read how Shizen's heavy transport crew maneuvered 85-meter wind turbine blades through narrow, steep Bavarian mountain corridors using active tilting hydraulics.",
        seoKeywords: "wind turbine logistics, blade transport, active blade lifter, heavy haulage case study, Shizen eco logistics"
    },
    {
        id: "seed-blog-2",
        title: "Technical Specifications of Zero-Emission PPUs",
        category: "Technology",
        date: "May 15, 2026",
        cover: "⚡",
        excerpt: "An in-depth look inside Shizen's proprietary fuel cell Power Pack Units. Explaining how we maintain high starting hydraulic torque requirements for SPMT trailer platforms with zero carbon emissions.",
        content: "<p>The core philosophy at Shizen is that extreme lifting power should not be synonymous with environmental degradation. In this technical blueprint paper, we examine the inner engineering specifications of our next-generation clean Hydrogen Power Pack Units (PPUs), the heavy hydraulic engines that drive our Self-Propelled Modular Transporters (SPMTs).</p><h4>The SPMT Hydraulic Conundrum</h4><p>Historically, Self-Propelled Modular Transporters have relied on massive, multi-cylinder industrial diesel engines. These engines drive heavy hydraulic pumps that feed hydraulic fluid to the suspension lines, steering pivot arms, and drive wheel hydraulic motors. The torque required to initiate displacement of a 3,000-ton cargo is immense, demanding massive energy output from the moment velocity is initiated.</p><h4>High-Efficiency Hydrogen Fuel Cell Integration</h4><p>Our engineering team solved this challenge by integrating high-density proton-exchange membrane (PEM) fuel cells. These fuel cells convert pressurized green hydrogen gas and atmospheric oxygen into electric current with a thermal efficiency exceeding 60%. The current directly feeds a heavy-duty electric buffer battery system, which in turn drives high-torque variable-displacement electric hydraulic pumps. </p><h4>Eco Savings and Performance Comparison</h4><p>This hybrid electrical hydraulic structure delivers key performance advantages:<br>1. <strong>Instant Peak Torque:</strong> Unlike diesel engines which must climb a rev curve, Shizen's electric-hydraulic system provides peak pump torque instantly at 0 RPM.<br>2. <strong>Zero Sound Pollution:</strong> The PPU operates at a whisper-quiet 52 dBA, allowing urban night transit without municipal disruptions.<br>3. <strong>Water Output Only:</strong> The sole exhaust emission is pure water vapor, completely bypassing greenhouse gases and localized soot output. Shizen's fleet has successfully offset over 150 tons of CO2 in trials alone, proving green engineering holds the key to heavy project logistics.</p>",
        seoTitle: "Hydrogen Fuel Cell SPMT PPU Specs | Shizen Green Tech",
        seoDesc: "Read the technical specifications of Shizen's clean hydrogen fuel cell Power Pack Units (PPUs) powering Self-Propelled Modular Transporters with zero emissions.",
        seoKeywords: "hydrogen fuel cell, SPMT power pack, clean energy logistics, green engineering, heavy transport PPU specs"
    },
    {
        id: "seed-blog-3",
        title: "Neptune Substation Jacket Roll-On at Port of Antwerp",
        category: "Marine Logistics",
        date: "April 30, 2026",
        cover: "⚓",
        excerpt: "Review the ballast synchronizations and load-distribution models developed by our engineers to roll out a 4,200-ton offshore electrical platform onto coupled barges with absolute zero deviation.",
        content: "<p>Port operations represent some of the most critical stages in heavy project cargo logistics. This case study details the successful execution of the roll-on operation (RoRo) of the 4,200-ton Neptune wind farm substation jacket at our Antwerp operations terminal in Belgium, transferring the structural assembly onto a heavy-deck transport barge.</p><h4>The Ballast Equilibrium Challenge</h4><p>During a roll-on operation, as the massive SPMT vehicle platform moves from the solid quay wall onto the barge, thousands of tons of load transition progressively. If this transfer is not perfectly offset by the barge's ballast pumps, the hull will tilt or sink rapidly, causing catastrophic misalignment, structure sliding, or mechanical buckling. The structural tolerance for center of gravity variance was less than 5 millimeters.</p><h4>Coupled SPMT Platform Setup</h4><p>To support this 4,200-ton payload, Shizen configured a combined transport assembly consisting of **four parallel 12-axle SPMT lines** (48 axle lines total, carrying 192 tires). These modules were fully synchronized via a single electronic control system to distribute weight evenly across the entire surface of the quay and barge deck.</p><h4>Real-Time Hydraulic Balancing</h4><p>Our engineers implemented an active hydraulic equalization strategy. Sensus transducers measured fluid pressure within each axle cylinder at 10ms intervals. By linking this pressure map directly to the barge's high-capacity water ballast pumps, water was evacuated dynamically to precisely match the SPMT's progression onto the deck. The substation jacket was loaded in a continuous, uninterrupted 4-hour cycle. The vessel was immediately dispatched to the offshore wind park in the North Sea, marking another clean logistics triumph for Shizen.</p>",
        seoTitle: "Port of Antwerp 4200t Substation Load-Out | Shizen",
        seoDesc: "Read the marine logistics case study detailing Shizen's synchronized SPMT roll-on and ballast management of a 4,200-ton substation offshore jacket at the Port of Antwerp.",
        seoKeywords: "Antwerp port operations, roll-on logistics, SPMT marine transport, ballast load distribution, substation roll-out"
    }
];

function getBlogPosts() {
    let posts = localStorage.getItem("shizen_blog_posts");
    if (!posts) {
        // Seed initial data repository
        localStorage.setItem("shizen_blog_posts", JSON.stringify(DEFAULT_BLOG_SEEDS));
        return DEFAULT_BLOG_SEEDS;
    }
    return JSON.parse(posts);
}

function saveBlogPosts(posts) {
    localStorage.setItem("shizen_blog_posts", JSON.stringify(posts));
}

/* ==========================================================================
   09. DYNAMIC BLOG SYSTEM & DYNAMIC SEO HEAD ENGINE
   ========================================================================== */
function initDynamicBlog() {
    const blogContainer = document.getElementById("dynamic-blog-container");
    if (!blogContainer) return;
    
    const posts = getBlogPosts();
    
    // Clear and build dynamic grid list
    blogContainer.innerHTML = "";
    
    if (posts.length === 0) {
        blogContainer.innerHTML = `<div class="registry-empty-state" style="grid-column: span 3; color: var(--color-text-muted);">No articles published in repository. Check back soon!</div>`;
        return;
    }
    
    posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "blog-card";
        card.innerHTML = `
            <div class="blog-cover">${post.cover || '📝'}</div>
            <div class="blog-body">
                <div class="blog-meta">
                    <span>${post.category}</span>
                    <span>•</span>
                    <span>${post.date}</span>
                </div>
                <h3>${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="#" class="blog-readmore" data-id="${post.id}">Read Full Case Study <span>→</span></a>
            </div>
        `;
        blogContainer.appendChild(card);
    });
    
    // Interactive Detail Modal Components
    const modal = document.getElementById("blog-details-modal");
    if (!modal) return;
    
    const modalCover = modal.querySelector(".blog-modal-hero-cover");
    const modalTitle = modal.querySelector(".blog-modal-title");
    const modalMeta = modal.querySelector(".blog-meta");
    const modalBody = modal.querySelector(".blog-modal-body-text");
    const closeBtn = modal.querySelector(".blog-modal-close-btn");
    
    // Capture default metadata parameters for dynamic reset
    const defaultTitle = document.title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
    }
    const defaultDesc = metaDesc.content;
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
    }
    const defaultKeywords = metaKeywords.content;
    
    function openArticle(postId) {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        modalCover.textContent = post.cover || '📝';
        modalTitle.textContent = post.title;
        modalMeta.innerHTML = `
            <span>${post.category}</span>
            <span>•</span>
            <span>${post.date}</span>
        `;
        modalBody.innerHTML = post.content;
        
        // DYNAMIC SEO ENGINE: Real-Time DOM Head Rewrite
        document.title = post.seoTitle || `${post.title} | Shizen`;
        metaDesc.content = post.seoDesc || post.excerpt;
        metaKeywords.content = post.seoKeywords || `${post.category}, eco logistics, Shizen`;
        
        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Clip page background scrolling
    }
    
    function closeArticle() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        
        // DYNAMIC SEO ENGINE: Restore Defaults
        document.title = defaultTitle;
        metaDesc.content = defaultDesc;
        metaKeywords.content = defaultKeywords;
    }
    
    // Bind click events on Read More actions
    const readMoreBtns = blogContainer.querySelectorAll(".blog-readmore");
    readMoreBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const id = btn.getAttribute("data-id");
            openArticle(id);
        });
    });
    
    closeBtn.addEventListener("click", closeArticle);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeArticle();
        }
    });
}

/* ==========================================================================
   10. ADMIN AUTHENTICATION PANEL & BLOG CRUD SYSTEM
   ========================================================================== */
function initAdminPortal() {
    const adminLockScreen = document.getElementById("admin-lock-screen");
    const adminDashboard = document.getElementById("admin-dashboard");
    
    if (!adminLockScreen || !adminDashboard) return;
    
    const passcodeForm = document.getElementById("admin-passcode-form");
    const passcodeField = document.getElementById("admin-passcode");
    const lockError = document.getElementById("lock-error-msg");
    
    const blogForm = document.getElementById("admin-blog-form");
    const registryBody = document.getElementById("registry-table-body");
    const logoutBtn = document.getElementById("btn-admin-logout");
    
    const formTitle = document.getElementById("admin-form-title");
    const formSubmitBtn = document.getElementById("btn-submit-blog");
    
    const presetEmojis = document.querySelectorAll(".preset-emoji-select .emoji-btn");
    const blogCoverInput = document.getElementById("blog-cover");
    
    let isEditMode = false;
    let editPostId = null;
    
    // Passcode Session Security Check
    function checkAuth() {
        const sessionAuth = sessionStorage.getItem("shizen_admin_authenticated");
        if (sessionAuth === "true") {
            adminLockScreen.style.display = "none";
            adminDashboard.style.display = "block";
            renderRegistry();
        } else {
            adminLockScreen.style.display = "flex";
            adminDashboard.style.display = "none";
        }
    }
    
    passcodeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = passcodeField.value.trim();
        
        if (code === "shizen2026") {
            sessionStorage.setItem("shizen_admin_authenticated", "true");
            lockError.style.display = "none";
            passcodeField.value = "";
            checkAuth();
        } else {
            lockError.style.display = "block";
            // Custom card shake anim
            adminLockScreen.querySelector(".lock-card").animate([
                { transform: 'translateX(-6px)' },
                { transform: 'translateX(6px)' },
                { transform: 'translateX(-6px)' },
                { transform: 'translateX(0)' }
            ], { duration: 250 });
            passcodeField.value = "";
        }
    });
    
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("shizen_admin_authenticated");
        checkAuth();
    });
    
    // Cover Helper Picker
    presetEmojis.forEach(btn => {
        btn.addEventListener("click", () => {
            presetEmojis.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            blogCoverInput.value = btn.textContent;
        });
    });
    
    // Render Database Manager Rows
    function renderRegistry() {
        const posts = getBlogPosts();
        registryBody.innerHTML = "";
        
        if (posts.length === 0) {
            registryBody.innerHTML = `<tr><td colspan="4" class="registry-empty-state">No articles in repository. Publish your first article on the left!</td></tr>`;
            return;
        }
        
        posts.forEach(post => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span style="font-size:1.6rem; display:block;">${post.cover || '📝'}</span></td>
                <td>
                    <div class="td-title-meta">${post.title}</div>
                    <div class="td-date-meta">${post.date} | ID: ${post.id}</div>
                </td>
                <td><span class="badge-tag" style="background: rgba(16, 185, 129, 0.08); color: var(--color-accent-emerald); border: 1px solid rgba(16, 185, 129, 0.15);">${post.category}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action-small btn-edit" data-id="${post.id}">Edit</button>
                        <button class="btn-action-small btn-delete" data-id="${post.id}">Delete</button>
                    </div>
                </td>
            `;
            registryBody.appendChild(tr);
        });
        
        // Bind manager action events
        registryBody.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                loadPostForEdit(id);
            });
        });
        
        registryBody.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (confirm("Are you absolutely sure you want to delete this article? This cannot be undone.")) {
                    deletePost(id);
                }
            });
        });
    }
    
    function deletePost(id) {
        let posts = getBlogPosts();
        posts = posts.filter(p => p.id !== id);
        saveBlogPosts(posts);
        renderRegistry();
        
        if (isEditMode && editPostId === id) {
            resetComposerForm();
        }
    }
    
    function loadPostForEdit(id) {
        const posts = getBlogPosts();
        const post = posts.find(p => p.id === id);
        if (!post) return;
        
        isEditMode = true;
        editPostId = id;
        
        formTitle.textContent = "Modify Engineering Article";
        formSubmitBtn.textContent = "Update Published Article";
        formSubmitBtn.className = "btn btn-warning";
        
        // Populate form inputs
        document.getElementById("blog-title").value = post.title;
        document.getElementById("blog-category").value = post.category;
        document.getElementById("blog-cover").value = post.cover || '📝';
        document.getElementById("blog-excerpt").value = post.excerpt;
        document.getElementById("blog-content").value = post.content;
        
        // SEO Inputs
        document.getElementById("blog-seo-title").value = post.seoTitle || "";
        document.getElementById("blog-seo-desc").value = post.seoDesc || "";
        document.getElementById("blog-seo-keywords").value = post.seoKeywords || "";
        
        presetEmojis.forEach(btn => {
            if (btn.textContent === post.cover) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
        
        adminDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function resetComposerForm() {
        isEditMode = false;
        editPostId = null;
        
        formTitle.textContent = "Compose Engineering Article";
        formSubmitBtn.textContent = "Publish Article Live";
        formSubmitBtn.className = "btn btn-primary";
        
        blogForm.reset();
        presetEmojis.forEach(b => b.classList.remove("active"));
    }
    
    blogForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = document.getElementById("blog-title").value.trim();
        const category = document.getElementById("blog-category").value;
        const cover = document.getElementById("blog-cover").value.trim();
        const excerpt = document.getElementById("blog-excerpt").value.trim();
        const content = document.getElementById("blog-content").value.trim();
        
        // SEO Inputs
        const seoTitle = document.getElementById("blog-seo-title").value.trim();
        const seoDesc = document.getElementById("blog-seo-desc").value.trim();
        const seoKeywords = document.getElementById("blog-seo-keywords").value.trim();
        
        let posts = getBlogPosts();
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        if (isEditMode) {
            posts = posts.map(p => {
                if (p.id === editPostId) {
                    return {
                        ...p,
                        title,
                        category,
                        cover,
                        excerpt,
                        content,
                        seoTitle,
                        seoDesc,
                        seoKeywords
                    };
                }
                return p;
            });
            alert("Article successfully updated!");
        } else {
            const newId = "blog-" + Date.now();
            const newPost = {
                id: newId,
                title,
                category,
                date: currentDate,
                cover: cover || '📝',
                excerpt,
                content,
                seoTitle: seoTitle || `${title} | Shizen`,
                seoDesc: seoDesc || excerpt,
                seoKeywords: seoKeywords || `${category}, heavy transport, Shizen`
            };
            posts.unshift(newPost); // Render at top (newest first)
            alert("New Article successfully published live!");
        }
        
        saveBlogPosts(posts);
        resetComposerForm();
        renderRegistry();
    });
    
    checkAuth();
}
/* --- Mobile Menu Toggle logic --- */
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.getElementById('navbar');
    
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navbar.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const navLinks = navbar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }
});
