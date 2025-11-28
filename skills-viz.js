// Visualización de habilidades con gráfico radar hexagonal
export function createSkillsViz(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'skills-svg')
        .style('opacity', 0);
    
    svg.transition().duration(600).style('opacity', 1);

    // Datos reorganizados para radar
    const skillsData = [
        { skill: 'Python', value: 90, color: '#ffd93d' },
        { skill: 'React', value: 88, color: '#61dafb' },
        { skill: 'C++', value: 85, color: '#659ad2' },
        { skill: 'AWS', value: 80, color: '#ff9900' },
        { skill: 'TensorFlow', value: 80, color: '#ff6f61' },
        { skill: 'PostgreSQL', value: 85, color: '#336791' }
    ];

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.35;
    const levels = 5;
    const angleSlice = (Math.PI * 2) / skillsData.length;

    const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

    // Dibujar niveles hexagonales con animación
    for (let level = 1; level <= levels; level++) {
        const levelRadius = (maxRadius / levels) * level;
        const hexPoints = skillsData.map((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            return [levelRadius * Math.cos(angle), levelRadius * Math.sin(angle)];
        });
        
        g.append('polygon')
            .attr('points', hexPoints.map(p => p.join(',')).join(' '))
            .attr('fill', 'none')
            .attr('stroke', `rgba(0, 212, 255, ${0.1 + level * 0.1})`)
            .attr('stroke-width', level === levels ? 2 : 1)
            .attr('stroke-dasharray', function() { return this.getTotalLength(); })
            .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
            .transition()
            .duration(800)
            .delay(level * 100)
            .attr('stroke-dashoffset', 0);
    }

    // Líneas radiales
    skillsData.forEach((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        g.append('line')
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', maxRadius * Math.cos(angle))
            .attr('y2', maxRadius * Math.sin(angle))
            .attr('stroke', 'rgba(0, 212, 255, 0.3)')
            .attr('stroke-width', 1)
            .style('opacity', 0)
            .transition()
            .duration(500)
            .delay(600 + i * 50)
            .style('opacity', 1);
    });

    // Área de datos con animación
    const dataPoints = skillsData.map((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const radius = (d.value / 100) * maxRadius;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
    });

    // Área rellena
    g.append('polygon')
        .attr('points', skillsData.map(() => '0,0').join(' '))
        .attr('fill', 'rgba(0, 212, 255, 0.2)')
        .attr('stroke', '#00d4ff')
        .attr('stroke-width', 3)
        .style('filter', 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))')
        .transition()
        .duration(1200)
        .delay(800)
        .ease(d3.easeElasticOut.amplitude(1).period(0.6))
        .attr('points', dataPoints.map(p => p.join(',')).join(' '));

    // Puntos en los vértices
    skillsData.forEach((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const radius = (d.value / 100) * maxRadius;
        
        g.append('circle')
            .attr('cx', 0).attr('cy', 0)
            .attr('r', 8)
            .attr('fill', d.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 0 8px ' + d.color + ')')
            .transition()
            .duration(1000)
            .delay(1000 + i * 100)
            .ease(d3.easeBackOut)
            .attr('cx', radius * Math.cos(angle))
            .attr('cy', radius * Math.sin(angle));
    });

    // Etiquetas
    skillsData.forEach((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const labelRadius = maxRadius + 40;
        
        g.append('text')
            .attr('x', labelRadius * Math.cos(angle))
            .attr('y', labelRadius * Math.sin(angle))
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('fill', d.color)
            .attr('font-size', '14px')
            .attr('font-weight', '700')
            .attr('font-family', "'JetBrains Mono', monospace")
            .style('opacity', 0)
            .text(`${d.skill} (${d.value}%)`)
            .transition()
            .duration(500)
            .delay(1500 + i * 80)
            .style('opacity', 1);
    });

    // Título central
    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .attr('fill', '#fff')
        .attr('font-size', '18px')
        .attr('font-weight', '800')
        .text('SKILLS')
        .style('opacity', 0)
        .transition()
        .duration(600)
        .delay(2000)
        .style('opacity', 1);

    return {
        destroy: () => { container.innerHTML = ''; }
    };
}