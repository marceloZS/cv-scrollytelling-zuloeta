// Visualización de proyectos con Timeline vertical
export function createProjectsViz(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Crear contenedor HTML en lugar de SVG
    const wrapper = document.createElement('div');
    wrapper.id = 'projects-timeline';
    wrapper.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        opacity: 0;
        transition: opacity 0.6s ease;
    `;
    container.appendChild(wrapper);
    setTimeout(() => wrapper.style.opacity = '1', 50);

    const projects = [
        { 
            name: 'Forecast Analytics', 
            year: 'Big Data',
            desc: 'Pipeline ETL & ML',
            tech: ['Hadoop HDFS', 'Apache Spark', 'PySpark'],
            color: '#00d4ff',
            icon: ''
        },
        { 
            name: 'Automatic TTS Translator', 
            year: 'Cloud',
            desc: 'Auto-scaling Web App',
            tech: ['AWS EC2/S3/RDS', 'Load Balancing', 'CloudWatch'],
            color: '#ff6b6b',
            icon: ''
        },
        { 
            name: 'Storyteller Bot', 
            year: 'AI',
            desc: 'Image Generation App',
            tech: ['Flask', 'OpenAI API', 'AWS Elastic Beanstalk'],
            color: '#ffd93d',
            icon: ''
        },
        { 
            name: 'Blockchain Transaction', 
            year: 'C++',
            desc: 'SHA256 & Proof-of-Work',
            tech: ['C++', 'Algorithms', 'Security'],
            color: '#9b59b6',
            icon: ''
        }
    ];

    // Línea central del timeline
    const timeline = document.createElement('div');
    timeline.style.cssText = `
        position: absolute;
        left: 50%;
        top: 10%;
        width: 4px;
        height: 0%;
        background: linear-gradient(180deg, #00d4ff, #ff6b6b, #ffd93d, #9b59b6);
        border-radius: 2px;
        transform: translateX(-50%);
        transition: height 1s ease-out;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
    `;
    wrapper.appendChild(timeline);
    setTimeout(() => timeline.style.height = '80%', 100);

    // Crear cards de proyectos
    projects.forEach((project, i) => {
        const isLeft = i % 2 === 0;
        
        const card = document.createElement('div');
        card.style.cssText = `
            position: absolute;
            top: ${12 + i * 20}%;
            ${isLeft ? 'right: 52%' : 'left: 52%'};
            width: 200px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(${hexToRgb(project.color)}, 0.15), rgba(0,0,0,0.3));
            border: 2px solid ${project.color};
            border-radius: 16px;
            transform: translateX(${isLeft ? '30px' : '-30px'}) scale(0.8);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;
        
        card.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 8px;">${project.icon}</div>
            <div style="color: ${project.color}; font-size: 0.75rem; font-weight: 600; margin-bottom: 4px;">${project.year}</div>
            <div style="color: #fff; font-size: 1.1rem; font-weight: 800; margin-bottom: 6px;">${project.name}</div>
            <div style="color: #8b93b8; font-size: 0.85rem; margin-bottom: 10px;">${project.desc}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${project.tech.map(t => `<span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 12px; font-size: 0.65rem; color: ${project.color};">${t}</span>`).join('')}
            </div>
        `;
        
        // Punto en el timeline
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            top: ${15 + i * 20}%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: ${project.color};
            border: 4px solid #0a0e27;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 0 20px ${project.color};
            z-index: 10;
        `;
        
        wrapper.appendChild(card);
        wrapper.appendChild(dot);
        
        // Animaciones de entrada
        setTimeout(() => {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 600 + i * 200);
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0) scale(1)';
        }, 800 + i * 200);
        
        // Hover effect
        card.onmouseenter = () => {
            card.style.transform = 'translateX(0) scale(1.05)';
            card.style.boxShadow = `0 15px 50px rgba(${hexToRgb(project.color)}, 0.4)`;
            dot.style.transform = 'translate(-50%, -50%) scale(1.3)';
        };
        card.onmouseleave = () => {
            card.style.transform = 'translateX(0) scale(1)';
            card.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        };
    });

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
    }

    return {
        destroy: () => { container.innerHTML = ''; }
    };
}