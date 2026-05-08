// Lista de Sistemas Operacionais Pré-definidos
const operatingSystems = [
    { name: "Windows 11", icon: "🪟", url: "#", type: "windows" },
    { name: "Windows 10", icon: "🪟", url: "#", type: "windows" },
    { name: "Ubuntu 24.04", icon: "🐧", url: "#", type: "linux" },
    { name: "Linux Mint", icon: "🌿", url: "#", type: "linux" },
    { name: "Fedora 40", icon: "🎩", url: "#", type: "linux" },
    { name: "Debian 12", icon: "🎯", url: "#", type: "linux" },
    { name: "Arch Linux", icon: "🎨", url: "#", type: "linux" },
    { name: "Hiren's BootCD", icon: "🛠️", url: "#", type: "utility" },
    { name: "GParted Live", icon: "💾", url: "#", type: "utility" },
    { name: "Clonezilla", icon: "🔄", url: "#", type: "utility" },
    { name: "Kali Linux", icon: "🐉", url: "#", type: "linux" },
    { name: "CentOS Stream", icon: "📊", url: "#", type: "linux" }
];

let selectedUSB = null;
let selectedOS = null;
let customISO = null;

// Simular detecção de USBs conectados
function detectUSBs() {
    const usbList = document.getElementById('usbList');
    
    // Simular USBs conectados (em um ambiente real, isso seria feito com API do navegador)
    const mockUSBs = [
        { id: 1, name: "Kingston DataTraveler", size: "16 GB", mount: "/dev/sdb1", free: "14.2 GB", speed: "USB 3.0" },
        { id: 2, name: "SanDisk Ultra Fit", size: "32 GB", mount: "/dev/sdc1", free: "28.5 GB", speed: "USB 3.1" },
        { id: 3, name: "Samsung USB Drive", size: "64 GB", mount: "/dev/sdd1", free: "58.3 GB", speed: "USB 3.2" },
        { id: 4, name: "Transcend JetFlash", size: "128 GB", mount: "/dev/sde1", free: "120.1 GB", speed: "USB 3.0" }
    ];

    usbList.innerHTML = '';
    
    mockUSBs.forEach(usb => {
        const usbDiv = document.createElement('div');
        usbDiv.className = 'usb-item';
        usbDiv.setAttribute('data-id', usb.id);
        usbDiv.onclick = () => selectUSB(usb);
        usbDiv.innerHTML = `
            <div class="usb-name">💾 ${usb.name}</div>
            <div class="usb-details">
                Tamanho: ${usb.size} | Disponível: ${usb.free}<br>
                Montagem: ${usb.mount} | ${usb.speed}
            </div>
        `;
        usbList.appendChild(usbDiv);
    });

    showStatus('✅ USBs detectados com sucesso! Selecione um pendrive.', 'success');
    document.getElementById('createBtn').disabled = true;
}

function selectUSB(usb) {
    selectedUSB = usb;
    // Atualizar UI para mostrar seleção
    const items = document.querySelectorAll('.usb-item');
    items.forEach(item => {
        if (item.getAttribute('data-id') == usb.id) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Verificar se pode criar
    checkCanCreate();
    showStatus(`✅ Pendrive selecionado: ${usb.name} (${usb.size})`, 'success');
}

function selectOS(os) {
    selectedOS = os;
    // Atualizar UI para mostrar seleção
    const cards = document.querySelectorAll('.os-card');
    cards.forEach(card => {
        if (card.querySelector('.os-name')?.textContent === os.name) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Limpar arquivo customizado se selecionar OS pré-definido
    customISO = null;
    const isoInput = document.getElementById('isoFile');
    if (isoInput) isoInput.value = '';
    
    checkCanCreate();
    showStatus(`✅ Sistema selecionado: ${os.name}`, 'success');
}

function checkCanCreate() {
    const canCreate = selectedUSB !== null && (selectedOS !== null || customISO !== null);
    const createBtn = document.getElementById('createBtn');
    createBtn.disabled = !canCreate;
    
    if (canCreate) {
        createBtn.style.opacity = '1';
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.className = `status ${type}`;
    statusDiv.innerHTML = message;
    statusDiv.style.display = 'block';
    
    // Auto-esconder após 5 segundos
    setTimeout(() => {
        if (statusDiv.className.includes(type)) {
            statusDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                statusDiv.style.display = 'none';
                statusDiv.style.animation = '';
            }, 300);
        }
    }, 5000);
}

async function createBootableUSB() {
    const volumeName = document.getElementById('volumeName').value || 'BOOTABLE_USB';
    
    // Validar se há espaço suficiente (simulação)
    const requiredSpace = selectedOS ? "4 GB" : (customISO ? customISO.size : "4 GB");
    
    // Simular processo de criação
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const createBtn = document.getElementById('createBtn');
    
    progressContainer.style.display = 'block';
    createBtn.disabled = true;
    
    // Simular etapas do processo
    const steps = [
        { progress: 5, message: "Verificando dispositivos..." },
        { progress: 15, message: "Desmontando partições..." },
        { progress: 25, message: "Formatando dispositivo como FAT32..." },
        { progress: 35, message: "Criando partição bootável..." },
        { progress: 45, message: "Configurando setor de boot..." },
        { progress: 60, message: `Copiando arquivos do ${selectedOS ? selectedOS.name : 'ISO'}...` },
        { progress: 75, message: "Configurando bootloader..." },
        { progress: 90, message: "Verificando integridade dos arquivos..." },
        { progress: 100, message: "Finalizando e limpando cache..." }
    ];
    
    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        progressFill.style.width = `${step.progress}%`;
        progressFill.textContent = `${step.progress}%`;
        showStatus(step.message, 'info');
    }
    
    // Simular conclusão
    setTimeout(() => {
        const osName = selectedOS ? selectedOS.name : (customISO ? customISO.name : "Sistema Operacional");
        const successMessage = `
            🎉 <strong>SUCESSO!</strong> Pendrive bootável criado com ${osName}!<br><br>
            📊 <strong>Detalhes:</strong><br>
            • Dispositivo: ${selectedUSB.name} (${selectedUSB.size})<br>
            • Volume: ${volumeName}<br>
            • Sistema: ${osName}<br><br>
            ✅ Para usar: Reinicie o computador, acesse o menu de boot (F12/F2/ESC) e selecione o USB.
        `;
        showStatus(successMessage, 'success');
        
        progressContainer.style.display = 'none';
        createBtn.disabled = false;
        progressFill.style.width = '0%';
        progressFill.textContent = '0%';
        
        // Reset seleção
        selectedUSB = null;
        selectedOS = null;
        customISO = null;
        
        // Limpar seleções visuais
        document.querySelectorAll('.usb-item, .os-card').forEach(el => {
            el.classList.remove('selected');
        });
    }, 1000);
}

// Event Listeners
document.getElementById('detectBtn').addEventListener('click', detectUSBs);
document.getElementById('createBtn').addEventListener('click', createBootableUSB);

document.getElementById('isoFile').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        if (!file.name.toLowerCase().endsWith('.iso')) {
            showStatus('❌ Erro: O arquivo deve ter extensão .iso', 'error');
            e.target.value = '';
            return;
        }
        
        customISO = {
            name: file.name.replace('.iso', ''),
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            file: file
        };
        selectedOS = null;
        
        // Remover seleção visual dos OS cards
        const cards = document.querySelectorAll('.os-card');
        cards.forEach(card => card.classList.remove('selected'));
        
        showStatus(`📁 ISO customizada carregada: ${file.name} (${customISO.size})`, 'success');
        checkCanCreate();
    }
});

// Adicionar animação de fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Renderizar lista de sistemas operacionais
function renderOSList() {
    const osListDiv = document.getElementById('osList');
    operatingSystems.forEach(os => {
        const osCard = document.createElement('div');
        osCard.className = 'os-card';
        osCard.onclick = () => selectOS(os);
        osCard.innerHTML = `
            <div class="os-icon">${os.icon}</div>
            <div class="os-name">${os.name}</div>
        `;
        osListDiv.appendChild(osCard);
    });
}

// Adicionar informações adicionais
function addInfoPanel() {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'alert';
    infoDiv.style.marginTop = '20px';
    infoDiv.innerHTML = `
        <strong>💡 Dicas importantes:</strong><br>
        • ⚠️ Certifique-se de que o pendrive não contém dados importantes<br>
        • 🔄 O processo irá formatar completamente o dispositivo<br>
        • 🖥️ Para sistemas UEFI, use partição GPT<br>
        • 💻 Para sistemas legacy (BIOS), use partição MBR<br>
        • ✅ Sempre verifique a integridade da ISO antes de criar o boot<br>
        • 📏 O pendrive deve ter no mínimo 4GB para a maioria dos sistemas
    `;
    document.querySelector('.panel:last-child').appendChild(infoDiv);
}

// Inicializar
renderOSList();
addInfoPanel();

// Simular detecção automática ao carregar
setTimeout(() => {
    showStatus('🎯 Clique em "Detectar USBs" para começar', 'info');
}, 1000);

// Adicionar efeito de ripple nos botões
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.marginLeft = '-50px';
        ripple.style.marginTop = '-50px';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Adicionar keyframe para ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);