function iniciarObservador() {
    const objetivo = document.querySelector("ytd-app");

    if (!objetivo) {
        console.log("No se encontró el ytd-app");
        return;
    }

    const observer = new MutationObserver(() => {
        const contenedor = document.querySelector('#top-level-buttons-computed');
        if (contenedor && !document.getElementById('boton-mp3')) {
            insertarBoton(contenedor);
        }
    });

    observer.observe(objetivo, { childList: true, subtree: false });

    setTimeout(() => {
        const contenedor = document.querySelector('#top-level-buttons-computed');
        if (contenedor && !document.getElementById('boton-mp3')) {
            insertarBoton(contenedor);
        }
    }, 500);
}

function mostrarAnimacionDescarga() {
    const overlay = document.createElement("div");
    overlay.id = "overlay-descarga";
    overlay.style.position = "fixed";
    overlay.style.top = "50%";
    overlay.style.left = "50%";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.padding = "30px 40px";
    overlay.style.backgroundColor = "#333";
    overlay.style.color = "#fff";
    overlay.style.fontSize = "18px";
    overlay.style.fontWeight = "bold";
    overlay.style.borderRadius = "10px";
    overlay.style.boxShadow = "0 0 15px rgba(0,0,0,0.6)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    // Texto
    const texto = document.createElement("div");
    texto.innerText = "Descargando MP3...";
    overlay.appendChild(texto);

    // Spinner
    const spinner = document.createElement("div");
    spinner.style.marginTop = "15px";
    spinner.style.width = "50px";
    spinner.style.height = "50px";
    spinner.style.border = "6px solid #f3f3f3";
    spinner.style.borderTop = "6px solid #ff0000";
    spinner.style.borderRadius = "50%";
    spinner.style.animation = "girar 1s linear infinite";
    overlay.appendChild(spinner);

    document.body.appendChild(overlay);

    // Inyectamos la animación al documento solo si aún no está
    if (!document.getElementById("spinner-style")) {
        const style = document.createElement("style");
        style.id = "spinner-style";
        style.innerHTML = `
            @keyframes girar {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}


function ocultarAnimacionDescarga() {
    const overlay = document.getElementById("overlay-descarga");
    if (overlay) {
        document.body.removeChild(overlay);
    }
}


function insertarBoton(contenedor) {
    const nuevoBoton = document.createElement('button');
    nuevoBoton.innerText = 'Descargar MP3';
    nuevoBoton.id = 'boton-mp3';
    nuevoBoton.style.marginRight = '10px';
    nuevoBoton.style.padding = '10px';
    nuevoBoton.style.backgroundColor = '#ff0000';
    nuevoBoton.style.color = '#fff';
    nuevoBoton.style.border = 'none';
    nuevoBoton.style.borderRadius = '5px';
    nuevoBoton.style.cursor = 'pointer';

    nuevoBoton.onclick = async () => {
        const urlActual = window.location.href;

        mostrarAnimacionDescarga();
        nuevoBoton.disabled = true;
        nuevoBoton.innerText = 'Preparando... 🔄';

        try {
            const respuesta = await fetch("http://127.0.0.1:8000/descargar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: urlActual })
            });

            if (!respuesta.ok) {
                const resultado = await respuesta.json();
                alert("❌ Error: " + resultado.detail);
                return;
            }

            const blob = await respuesta.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "descarga.mp3";
            link.click();

            alert("✅ Descarga iniciada");
        } catch (error) {
            alert("❌ Error de conexión al backend");
        } finally {
            ocultarAnimacionDescarga();
            nuevoBoton.disabled = false;
            nuevoBoton.innerText = 'Descargar MP3';
        }
    };

    contenedor.prepend(nuevoBoton);
}

window.addEventListener('load', iniciarObservador);