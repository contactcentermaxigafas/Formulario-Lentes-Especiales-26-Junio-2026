// URL generada en Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPIoG75990vBEBCKhVeHVpgMaeAmWNIpDiVPBpk2t36VIGY-om5P2bPCW2ErOLukhelg/exec';

const form = document.getElementById('registroForm');
const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const nextBtns = document.querySelectorAll('.btn-next');
const prevBtns = document.querySelectorAll('.btn-prev');
let currentStep = 0;

// Navegación Siguiente
nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateFormSteps();
            updateProgressBar();
        }
    });
});

// Navegación Anterior
prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentStep--;
        updateFormSteps();
        updateProgressBar();
    });
});

function updateFormSteps() {
    formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep);
    });
}

function updateProgressBar() {
    progressSteps.forEach((step, index) => {
        if (index <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function validateStep(stepIndex) {
    const currentFormStep = formSteps[stepIndex];
    let isValid = true;
    
    // Validar en el Paso 1 (índice 0): Diagnóstico y Corrección
    if (stepIndex === 0) {
        const diagnosticos = currentFormStep.querySelectorAll('input[name="diagnostico"]:checked');
        if (diagnosticos.length === 0) {
            isValid = false;
            alert('Por favor, selecciona al menos un diagnóstico especial.');
        }

        const correccion = currentFormStep.querySelector('input[name="correccion"]:checked');
        if (!correccion) {
            isValid = false;
            if (diagnosticos.length > 0) alert('Por favor, indica cómo corriges actualmente tu visión.');
        }
    }

    // Validar en el Paso 2 (índice 1): Tiempo y Expectativa
    if (stepIndex === 1) {
        const tiempo = currentFormStep.querySelector('input[name="tiempo"]:checked');
        const expectativa = currentFormStep.querySelector('input[name="expectativa"]:checked');
        
        if (!tiempo || !expectativa) {
            isValid = false;
            alert('Por favor, completa todas las preguntas antes de avanzar.');
        }
    }

    // Validar en el Paso 3 (índice 2): Nombre y Celular
    if (stepIndex === 2) {
        const inputs = currentFormStep.querySelectorAll('input[required]');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--error-color)';
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
        if (!isValid) {
            alert("Por favor completa los campos requeridos (Nombre y Celular).");
        }
    }

    return isValid;
}

const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loader = submitBtn.querySelector('.loader');
const modal = document.getElementById('successModal');

form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const diagnosticos = document.querySelectorAll('input[name="diagnostico"]:checked');
    const diagnosticoValues = Array.from(diagnosticos).map(cb => cb.value).join(', ');

    const formData = new FormData(form);
    const dataToSend = new URLSearchParams();
    dataToSend.append('nombre', formData.get('nombre'));
    dataToSend.append('celular', formData.get('celular'));
    dataToSend.append('diagnostico', diagnosticoValues);
    dataToSend.append('correccion', formData.get('correccion'));
    dataToSend.append('tiempo', formData.get('tiempo'));
    dataToSend.append('expectativa', formData.get('expectativa'));

    btnText.textContent = 'Enviando...';
    loader.style.display = 'block';
    submitBtn.disabled = true;

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: dataToSend,
        mode: 'no-cors'
    })
    .then(() => {
        mostrarModal();
        form.reset();
        currentStep = 0;
        updateFormSteps();
        updateProgressBar();
        // Limpiar bordes de error si quedaron
        document.querySelectorAll('input').forEach(i => i.style.borderColor = 'var(--border-color)');
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('Hubo un problema al enviar los datos. Inténtalo de nuevo.');
    })
    .finally(() => {
        btnText.textContent = 'Enviar datos';
        loader.style.display = 'none';
        submitBtn.disabled = false;
    });
});

function mostrarModal() {
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
