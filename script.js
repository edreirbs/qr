document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrcodeContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');
    // const copyBtn = document.getElementById('copyBtn'); // Descomentar si se implementa copia
    const buttonsOutput = document.querySelector('.buttons-output');

    let qrCodeInstance = null; // Para mantener referencia al objeto QR

    generateBtn.addEventListener('click', () => {
        const text = textInput.value.trim();

        if (text === "") {
            alert("Por favor, ingresa una URL o texto.");
            textInput.focus();
            return;
        }

        // Limpiar QR anterior
        qrcodeContainer.innerHTML = '';
        buttonsOutput.style.display = 'none'; // Ocultar botones

        // Generar el nuevo código QR
        try {
            qrCodeInstance = new QRCode(qrcodeContainer, {
                text: text,
                width: 200,  // Tamaño del QR
                height: 200,
                colorDark: "#000000", // Color de los puntos
                colorLight: "#ffffff", // Color del fondo
                correctLevel: QRCode.CorrectLevel.H // Nivel de corrección de errores (H = High)
            });

            // Esperar un poco a que se renderice el QR (especialmente el canvas/img)
            setTimeout(() => {
                if (qrcodeContainer.querySelector('canvas') || qrcodeContainer.querySelector('img')) {
                    buttonsOutput.style.display = 'block'; // Mostrar botones de descarga/copia
                } else {
                    console.error("Error: No se pudo generar el elemento QR (canvas o img).");
                    alert("Hubo un problema al generar la imagen QR.");
                }
            }, 100); // Pequeña espera

        } catch (error) {
            console.error("Error al generar QR:", error);
            alert("Ocurrió un error inesperado al generar el código QR.");
        }
    });

    downloadBtn.addEventListener('click', () => {
        // Intentar obtener el canvas primero (preferido para toDataURL)
        const canvas = qrcodeContainer.querySelector('canvas');
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            triggerDownload(dataUrl, 'codigo-qr.png');
            return; // Salir si se usó canvas
        }

        // Si no hay canvas, intentar con la imagen (puede ser menos directo)
        const img = qrcodeContainer.querySelector('img');
        if (img && img.src) {
            // Si la src ya es data URL (común con qrcode.js)
            if (img.src.startsWith('data:image')) {
                 triggerDownload(img.src, 'codigo-qr.png');
            } else {
                // Si es una URL normal (menos probable aquí), necesitaría un enfoque más complejo
                // como dibujar en un canvas temporal, lo cual no implementaremos por simplicidad.
                alert("No se pudo obtener la imagen para descargar directamente. Intenta clic derecho > Guardar imagen como...");
            }
        } else {
            alert("No se encontró la imagen QR para descargar.");
        }
    });

    // --- Funcionalidad de Copiar Imagen (Opcional y puede fallar) ---
    // Nota: La API Clipboard para imágenes ('image/png') es relativamente nueva
    // y puede requerir permisos o no funcionar en todos los navegadores/contextos (ej. http)
    /*
    copyBtn.addEventListener('click', () => {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (canvas && navigator.clipboard && navigator.clipboard.write) {
            try {
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        alert("No se pudo crear el blob de la imagen para copiar.");
                        return;
                    }
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        alert('¡Imagen QR copiada al portapapeles!');
                    } catch (err) {
                        console.error('Error al escribir en el portapapeles:', err);
                        alert('Error al copiar la imagen. Tu navegador podría no soportarlo o requerir permisos.');
                    }
                }, 'image/png');
            } catch (error) {
                 console.error("Error al intentar copiar con toBlob:", error);
                 alert("Error al procesar la imagen para copiar.");
            }

        } else if (qrcodeContainer.querySelector('img')) {
             alert("La copia directa de imágenes desde <img> no está implementada. Intenta descargarla.");
        } else {
            alert("No hay imagen QR para copiar o tu navegador no soporta la copia de imágenes.");
        }
    });
    */

    // Función auxiliar para disparar la descarga
    function triggerDownload(dataUrl, filename) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        // Simular clic para iniciar descarga
        document.body.appendChild(link); // Necesario en Firefox
        link.click();
        document.body.removeChild(link); // Limpiar
    }
});