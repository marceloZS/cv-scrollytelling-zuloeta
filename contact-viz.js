// Visualización de contacto - Red de conexiones interactiva
export function createContactViz(container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'contact-canvas';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 0.8s ease-in';
    container.appendChild(canvas);
    
    setTimeout(() => canvas.style.opacity = '1', 50);

    const ctx = canvas.getContext('2d');
    
    // Nodos de la red
    const nodes = [];
    const numNodes = 40;
    const connectionDistance = 150;
    
    // Nodo central (contacto)
    const centerNode = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: 0,
        vy: 0,
        radius: 50,
        isCenter: true,
        color: '#00d4ff'
    };
    nodes.push(centerNode);
    
    // Nodos flotantes
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 4 + 2,
            isCenter: false,
            color: ['#00d4ff', '#ff6b6b', '#ffd93d', '#9b59b6'][Math.floor(Math.random() * 4)]
        });
    }
    
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    function animate() {
        // Fondo con trail
        ctx.fillStyle = 'rgba(5, 8, 20, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar y dibujar nodos
        nodes.forEach((node, i) => {
            if (!node.isCenter) {
                // Movimiento
                node.x += node.vx;
                node.y += node.vy;
                
                // Rebote en bordes
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                
                // Atracción suave hacia el mouse
                const dx = mouseX - node.x;
                const dy = mouseY - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    node.vx += dx * 0.0003;
                    node.vy += dy * 0.0003;
                }
            }
            
            // Dibujar conexiones
            nodes.forEach((other, j) => {
                if (i >= j) return;
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    const opacity = 1 - (dist / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    
                    const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
                    gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity * 0.5})`);
                    gradient.addColorStop(1, `rgba(255, 107, 107, ${opacity * 0.5})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = opacity * 2;
                    ctx.stroke();
                }
            });
            
            // Dibujar nodo
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            if (node.isCenter) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // Glow
                ctx.shadowColor = node.color;
                ctx.shadowBlur = 30;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
        
        // Texto central
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText("LET'S CONNECT", canvas.width / 2, canvas.height / 2 + 5);
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Íconos de contacto con nuevo estilo
    const contactIcons = document.createElement('div');
    contactIcons.style.cssText = `
        position: absolute;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 30px;
        z-index: 10;
    `;
    
    const icons = [
        { emoji: '📧', label: 'Email', color: '#00d4ff' },
        { emoji: '💼', label: 'LinkedIn', color: '#0077b5' },
        { emoji: '💻', label: 'GitHub', color: '#fff' }
    ];
    
    icons.forEach((icon, i) => {
        const iconWrapper = document.createElement('div');
        iconWrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        
        const iconCircle = document.createElement('div');
        iconCircle.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
            border: 2px solid ${icon.color};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        iconCircle.textContent = icon.emoji;
        
        const label = document.createElement('span');
        label.style.cssText = `
            color: ${icon.color};
            font-size: 0.8rem;
            font-weight: 600;
            font-family: 'JetBrains Mono', monospace;
        `;
        label.textContent = icon.label;
        
        iconWrapper.appendChild(iconCircle);
        iconWrapper.appendChild(label);
        contactIcons.appendChild(iconWrapper);
        
        iconCircle.onmouseenter = () => {
            iconCircle.style.transform = 'scale(1.2)';
            iconCircle.style.background = `rgba(${icon.color === '#fff' ? '255,255,255' : '0,212,255'}, 0.2)`;
            iconCircle.style.boxShadow = `0 0 30px ${icon.color}`;
        };
        iconCircle.onmouseleave = () => {
            iconCircle.style.transform = 'scale(1)';
            iconCircle.style.background = 'rgba(255,255,255,0.05)';
            iconCircle.style.boxShadow = 'none';
        };
        
        setTimeout(() => {
            iconWrapper.style.opacity = '1';
            iconWrapper.style.transform = 'translateY(0)';
        }, 800 + i * 150);
    });
    
    container.appendChild(contactIcons);
    
    return {
        destroy: () => { container.innerHTML = ''; }
    };
}