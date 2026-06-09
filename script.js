let preguntas = [];
let preguntaActual = 0;
let respuestasCorrectas = 0;

async function cargarPreguntas() {
    const respuesta = await fetch('preguntas.json');
    preguntas = await respuesta.json();

    document.getElementById("startBtn").addEventListener("click", iniciarExamen);
}

function iniciarExamen() {
    preguntaActual = 0;
    respuestasCorrectas = 0;

    document.getElementById("startBtn").style.display = "none";

    mostrarPregunta();
}

function mostrarPregunta() {

    const app = document.getElementById("app");

    const pregunta = preguntas[preguntaActual];

    app.innerHTML = `
        <h2>Pregunta ${preguntaActual + 1} de ${preguntas.length}</h2>

        <p>${pregunta.pregunta}</p>

        ${pregunta.opciones.map((opcion, index) => `
            <div>
                <label>
                    <input type="radio" name="respuesta" value="${index}">
                    ${opcion}
                </label>
            </div>
        `).join("")}

        <br>

        <button onclick="siguientePregunta()">
            Siguiente
        </button>
    `;
}

function siguientePregunta() {

    const seleccionada = document.querySelector('input[name="respuesta"]:checked');

    if (!seleccionada) {
        alert("Seleccione una respuesta");
        return;
    }

    const respuestaUsuario = parseInt(seleccionada.value);

    if (respuestaUsuario === preguntas[preguntaActual].correcta) {
        respuestasCorrectas++;
    }

    preguntaActual++;

    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {

    const porcentaje = Math.round(
        (respuestasCorrectas / preguntas.length) * 100
    );

    const aprobado = porcentaje >= 70;

    document.getElementById("app").innerHTML = `
        <h2>Examen Finalizado</h2>

        <p>Correctas: ${respuestasCorrectas}</p>

        <p>Incorrectas: ${preguntas.length - respuestasCorrectas}</p>

        <h3>${porcentaje}%</h3>

        <h2>
            ${aprobado ? "APROBADO ✅" : "DESAPROBADO ❌"}
        </h2>
    `;
}

cargarPreguntas();
