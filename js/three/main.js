let scene, camera, renderer, core, nodes = [], particles, connectionLines;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let scrollProgress = 0;
let animationId;
let isMobile = window.innerWidth < 768;
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const nodeData = [
    { id: 'acquisition', label: 'ACQUISITION', color: 0x6366f1, angle: 0 },
    { id: 'conversion', label: 'CONVERSION', color: 0xfda4af, angle: Math.PI / 3 },
    { id: 'brand', label: 'BRAND', color: 0x818cf8, angle: (2 * Math.PI) / 3 },
    { id: 'organic', label: 'ORGANIC', color: 0x34d399, angle: Math.PI },
    { id: 'data', label: 'DATA', color: 0xfbbf24, angle: (4 * Math.PI) / 3 },
    { id: 'scalability', label: 'SCALE', color: 0xf87171, angle: (5 * Math.PI) / 3 }
];

function initThreeScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    createGrowthCore();
    createNodes();
    createParticles();
    createLights();
    
    if (!reducedMotion) {
        document.addEventListener('mousemove', onMouseMove);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    animate();
}

function createGrowthCore() {
    const geometry = new THREE.IcosahedronGeometry(0.8, 2);
    const material = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    core = new THREE.Mesh(geometry, material);
    scene.add(core);
    
    const innerGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.15
    });
    const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    core.add(innerCore);
    
    const glowGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0x6366f1) }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
                gl_FragColor = vec4(uColor, intensity * 0.3 * pulse);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    core.add(glow);
    core.glowMaterial = glowMaterial;
}

function createNodes() {
    const radius = 2.2;
    
    nodeData.forEach((data, i) => {
        const geometry = new THREE.SphereGeometry(0.12, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.8
        });
        const node = new THREE.Mesh(geometry, material);
        
        node.position.x = Math.cos(data.angle) * radius;
        node.position.y = Math.sin(data.angle) * radius;
        node.position.z = 0;
        
        node.userData = {
            id: data.id,
            label: data.label,
            color: data.color,
            basePosition: node.position.clone(),
            angle: data.angle,
            state: 'inactive'
        };
        
        scene.add(node);
        nodes.push(node);
        
        createConnectionLine(core.position, node.position, data.color);
    });
}

function createConnectionLine(start, end, color) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
            end.x - start.x,
            end.y - start.y,
            end.z - start.z
        )
    ]);
    
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2
    });
    
    const line = new THREE.Line(geometry, material);
    line.position.copy(start);
    scene.add(line);
    connectionLines = connectionLines || [];
    connectionLines.push(line);
}

function createParticles() {
    const count = isMobile ? 150 : 400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 10 - 2;
        
        const color = new THREE.Color();
        color.setHSL(0.7 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.3);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x6366f1, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateNodeState(nodeId, state, score) {
    const node = nodes.find(n => n.userData.id === nodeId);
    if (!node) return;
    
    node.userData.state = state;
    
    const colors = {
        inactive: 0x333333,
        scanning: 0xfbbf24,
        warning: 0xf87171,
        active: 0x34d399,
        optimized: 0x6366f1
    };
    
    const opacities = {
        inactive: 0.3,
        scanning: 0.8,
        warning: 0.9,
        active: 1.0,
        optimized: 1.0
    };
    
    node.material.color.setHex(colors[state] || colors.inactive);
    node.material.opacity = opacities[state] || 0.3;
    
    const scale = state === 'inactive' ? 1 : (state === 'optimized' ? 1.5 : 1.2);
    node.scale.setScalar(scale);
}

function updateScrollProgress(progress) {
    scrollProgress = progress;
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    if (core && !reducedMotion) {
        core.rotation.y += 0.003;
        core.rotation.x += 0.001;
        
        if (core.glowMaterial) {
            core.glowMaterial.uniforms.uTime.value = time;
        }
        
        core.rotation.y += (targetRotationX - core.rotation.y) * 0.05;
        core.rotation.x += (targetRotationY - core.rotation.x) * 0.05;
    }
    
    if (!reducedMotion) {
        targetRotationX += (mouseX * 0.5 - targetRotationX) * 0.05;
        targetRotationY += (mouseY * 0.3 - targetRotationY) * 0.05;
    }
    
    nodes.forEach((node, i) => {
        if (!reducedMotion) {
            const baseAngle = node.userData.angle + time * 0.2;
            const radius = 2.2 + Math.sin(time + i) * 0.1;
            node.position.x = Math.cos(baseAngle) * radius;
            node.position.y = Math.sin(baseAngle) * radius;
        }
        
        if (node.userData.state === 'scanning') {
            node.material.opacity = 0.5 + Math.sin(time * 4) * 0.3;
        }
    });
    
    if (particles && !reducedMotion) {
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;
    }
    
    if (connectionLines) {
        connectionLines.forEach((line, i) => {
            if (nodes[i] && !reducedMotion) {
                const positions = line.geometry.attributes.position.array;
                positions[3] = nodes[i].position.x;
                positions[4] = nodes[i].position.y;
                positions[5] = nodes[i].position.z;
                line.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
    
    const scrollY = window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    
    if (camera && !reducedMotion) {
        camera.position.z = 5 - scrollProgress * 2;
        camera.position.y = scrollProgress * 1.5;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function hideThreeJS() {
    if (renderer) {
        renderer.domElement.style.opacity = '0';
    }
}

function showThreeJS() {
    if (renderer) {
        renderer.domElement.style.opacity = '1';
    }
}

function disposeThreeJS() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onWindowResize);
    
    if (renderer) {
        renderer.dispose();
    }
    
    scene = null;
    camera = null;
    renderer = null;
    core = null;
    nodes = [];
    particles = null;
    connectionLines = [];
}
