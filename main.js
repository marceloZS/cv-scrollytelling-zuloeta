// Sistema de gestión de visualizaciones
import { createIntroViz } from './intro-viz.js';
import { createSkillsViz } from './skills-viz.js';
import { createProjectsViz } from './projects-viz.js';
import { createContactViz } from './contact-viz.js';

let currentViz = null;
let isTransitioning = false;

// Función de transición suave entre visualizaciones
async function transitionToViz(container, vizCreator) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Fade out
    container.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Destruir visualización anterior
    if (currentViz) {
        currentViz.destroy();
    }
    
    // Crear nueva visualización
    currentViz = vizCreator(container);
    
    // Fade in
    await new Promise(resolve => setTimeout(resolve, 50));
    container.style.opacity = '1';
    container.style.transform = 'scale(1)';
    
    await new Promise(resolve => setTimeout(resolve, 500));
    isTransitioning = false;
}

export const vizManager = {
    intro: (container) => transitionToViz(container, createIntroViz),
    skills: (container) => transitionToViz(container, createSkillsViz),
    projects: (container) => transitionToViz(container, createProjectsViz),
    contact: (container) => transitionToViz(container, createContactViz)
};

// Sistema de partículas de fondo
export function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Scroll indicator
export function setupScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Intersection Observer para pasos
export function setupStepObserver(vizContainer) {
    const steps = document.querySelectorAll(".step");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                steps.forEach(s => s.classList.remove("is-active"));
                entry.target.classList.add("is-active");
                
                const stepIndex = entry.target.getAttribute("data-step");
                
                // Cambiar visualización según el paso
                switch(stepIndex) {
                    case "0":
                        vizManager.intro(vizContainer);
                        break;
                    case "1":
                        vizManager.skills(vizContainer);
                        break;
                    case "2":
                        vizManager.projects(vizContainer);
                        break;
                    case "3":
                        vizManager.contact(vizContainer);
                        break;
                }
                
                // Actualizar navbar
                document.querySelectorAll('.nav-dot').forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('data-step') === stepIndex) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.6 });

    steps.forEach(step => observer.observe(step));
}

// Navegación con navbar
export function setupNavigation() {
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const stepIndex = dot.getAttribute('data-step');
            const targetStep = document.querySelector(`.step[data-step="${stepIndex}"]`);
            targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}
