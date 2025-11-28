// Visualización para la introducción - Estilo Terminal/Consola
export function createIntroViz(container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'intro-canvas';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 0.8s ease-in';
    container.appendChild(canvas);
    
    setTimeout(() => canvas.style.opacity = '1', 50);

    const ctx = canvas.getContext('2d');
    
    // Configuración estilo terminal
    const fontSize = 16;
    const lineHeight = 22;
    let currentLine = 0;
    
    // Comandos de terminal simulados
    const terminalLines = [
        '> whoami',
        'marcelo_zuloeta',
        '> cat skills.txt',
        'Python, C++, React, AWS, TensorFlow...',
        '> ./load_portfolio.sh',
        'Loading projects...',
        '[████████████████████] 100%',
        '> echo $STATUS',
        'Ready to collaborate!',
        '> _'
    ];
    
    const colors = {
        command: '#00d4ff',
        output: '#a8e6cf',
        prompt: '#ffd93d',
        cursor: '#ff6b6b'
    };
    
    // Fondo de terminal
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Borde de terminal
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Barra de título
    ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
    ctx.fillRect(50, 50, canvas.width - 100, 30);
    ctx.fillStyle = '#00d4ff';
    ctx.font = '14px monospace';
    ctx.fillText('● ● ●  terminal@portfolio', 70, 70);
    
    let charIndex = 0;
    let lineIndex = 0;
    
    function typeWriter() {
        if (lineIndex >= terminalLines.length) {
            // Cursor parpadeante
            setInterval(() => {
                const y = 120 + (terminalLines.length - 1) * lineHeight;
                ctx.fillStyle = '#0a0e27';
                ctx.fillRect(70 + ctx.measureText(terminalLines[terminalLines.length - 1]).width, y - 14, 15, 20);
                setTimeout(() => {
                    ctx.fillStyle = colors.cursor;
                    ctx.fillRect(70 + ctx.measureText('> ').width, y - 14, 12, 18);
                }, 500);
            }, 1000);
            return;
        }
        
        const line = terminalLines[lineIndex];
        const y = 120 + lineIndex * lineHeight;
        
        // Determinar color según tipo de línea
        if (line.startsWith('>')) {
            ctx.fillStyle = colors.command;
        } else if (line.includes('[')) {
            ctx.fillStyle = colors.prompt;
        } else {
            ctx.fillStyle = colors.output;
        }
        
        ctx.font = '15px "JetBrains Mono", monospace';
        ctx.fillText(line.substring(0, charIndex + 1), 70, y);
        
        charIndex++;
        
        if (charIndex >= line.length) {
            charIndex = 0;
            lineIndex++;
            setTimeout(typeWriter, 300);
        } else {
            setTimeout(typeWriter, line.startsWith('>') ? 80 : 30);
        }
    }
    
    setTimeout(typeWriter, 500);
    
    // Nombre con estilo ASCII art
    setTimeout(() => {
        const nameBox = document.createElement('div');
        nameBox.style.cssText = `
            position: absolute;
            bottom: 15%;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.2rem;
            color: #00d4ff;
            text-align: center;
            opacity: 0;
            transition: opacity 1s ease;
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
            white-space: pre;
        `;
        nameBox.textContent = `
╔══════════════════════════════╗
║       MARCELO ZULOETA       ║
║      Software Engineer      ║
╚══════════════════════════════╝`;
        container.appendChild(nameBox);
        setTimeout(() => nameBox.style.opacity = '1', 100);
    }, 3000);
    
    return {
        destroy: () => {
            container.innerHTML = '';
        }
    };
}