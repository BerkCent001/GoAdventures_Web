document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. LÓGICA DE LA VENTANA EMERGENTE
    // =======================================================
    const modalReserva = document.getElementById('modal-reserva');
    const botonesAbrir = document.querySelectorAll('.btn-abrir-modal');
    const botonCerrar = document.getElementById('btn-cerrar-modal');
    const inputFecha = document.getElementById('res_fecha');

    // Bloquear fechas del pasado (Solo permite hoy en adelante)
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoy);

    // Abrir y cerrar modal
    botonesAbrir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            modalReserva.classList.remove('hidden');
        });
    });

    botonCerrar.addEventListener('click', () => modalReserva.classList.add('hidden'));

    modalReserva.addEventListener('click', (e) => {
        if (e.target === modalReserva) modalReserva.classList.add('hidden');
    });

    // =======================================================
    // 2. LÓGICA DE RESERVAS Y CONEXIÓN CON WHATSAPP
    // =======================================================
    const btnEnviar = document.getElementById('btn-enviar-whatsapp');

    btnEnviar.addEventListener('click', () => {
        
        // A. Capturar todos los tours seleccionados
        const checkboxesTours = document.querySelectorAll('input[name="tour"]:checked');
        let toursElegidos = [];
        checkboxesTours.forEach((cb) => toursElegidos.push(cb.value));

        // B. Capturar el resto de datos
        const fecha = document.getElementById('res_fecha').value;
        const horaRaw = document.getElementById('res_hora').value;
        const personas = document.getElementById('res_personas').value;
        const nombre = document.getElementById('res_nombre').value;
        const telefono = document.getElementById('res_telefono').value;
        const notas = document.getElementById('res_notas').value;

        // C. Validación de campos obligatorios
        if (toursElegidos.length === 0 || !fecha || !nombre || !telefono) {
            alert("Por favor, selecciona al menos un Tour y completa la Fecha, tu Nombre y tu Teléfono.");
            return;
        }

        // D. Formatear la hora de formato 24h a 12h (AM/PM)
        let horaFormateada = "No especificada";
        if (horaRaw) {
            let [h, m] = horaRaw.split(':');
            let ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12; // Convierte las 0h a 12h
            horaFormateada = `${h}:${m} ${ampm}`;
        }

        // E. Estructurar el mensaje para WhatsApp
        const textoTours = toursElegidos.join(', ');
        
        const mensaje = `¡Hola Danny! Quiero solicitar una reserva. Aquí están mis datos:

🏔️ *Tours:* ${textoTours}
📅 *Fecha:* ${fecha}
🕑 *Hora:* ${horaFormateada}
👥 *Personas:* ${personas || "1"}
👤 *Nombre:* ${nombre}
📱 *Teléfono:* ${telefono}
💬 *Comentarios:* ${notas || "Ninguno"}

Quedo a la espera para confirmar disponibilidad y realizar el depósito del 20%.`;

        // F. Enviar a WhatsApp
        //const numeroDanny = "50588598902"; 
        const urlWhatsApp = `https://wa.me/${+58213126}?text=${encodeURIComponent(mensaje)}`;
        
        window.open(urlWhatsApp, '_blank');
        modalReserva.classList.add('hidden');
    });

// =======================================================
    // 3. LÓGICA DEL CARRUSEL DE IMÁGENES (Solo se ejecuta si existe)
    // =======================================================
    const track = document.getElementById('carrusel-slides');
    
    // Si la variable "track" existe, significa que estamos en la página de galería
    if (track) {
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const dots = document.querySelectorAll('.dot-indicador');
        let indexCarrusel = 0;
        const totalSlides = dots.length;

        function actualizarCarrusel() {
            track.style.transform = `translateX(-${indexCarrusel * 100}%)`;
            dots.forEach((dot, i) => {
                if (i === indexCarrusel) {
                    dot.classList.remove('bg-white/40');
                    dot.classList.add('bg-verde-natura');
                } else {
                    dot.classList.remove('bg-verde-natura');
                    dot.classList.add('bg-white/40');
                }
            });
        }

        function moverDerecha() {
            indexCarrusel = (indexCarrusel === totalSlides - 1) ? 0 : indexCarrusel + 1;
            actualizarCarrusel();
        }

        function moverIzquierda() {
            indexCarrusel = (indexCarrusel === 0) ? totalSlides - 1 : indexCarrusel - 1;
            actualizarCarrusel();
        }

        btnNext.addEventListener('click', moverDerecha);
        btnPrev.addEventListener('click', moverIzquierda);

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                indexCarrusel = parseInt(e.target.getAttribute('data-index'));
                actualizarCarrusel();
            });
        });

        let autoPlay = setInterval(moverDerecha, 5000);

        [btnNext, btnPrev, ...dots].forEach(elemento => {
            elemento.addEventListener('click', () => {
                clearInterval(autoPlay);
                autoPlay = setInterval(moverDerecha, 5000);
            });
        });
    }



});