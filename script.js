let preguntas = [];
let examen = [];
let preguntaActual = 0;
let respuestasCorrectas = 0;

const CANTIDAD_EXAMEN = 30;

async function cargarPreguntas() {

    const respuesta = await fetch('preguntas_v2.json');
    preguntas = await respuesta.json();

    document.getElementById("startBtn")
        .addEventListener("click", iniciarExamen);
}

function mezclar(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function iniciarExamen() {

    examen = mezclar(preguntas).slice(0, CANTIDAD_EXAMEN);

    preguntaActual = 0;
    respuestasCorrectas = 0;

    document.getElementById("startBtn").style.display = "none";

    mostrarPregunta();
}

function mostrarPregunta() {

    const app = document.getElementById("app");

    const pregunta = examen[preguntaActual];

    app.innerHTML = `
        <h2>Pregunta ${preguntaActual + 1} de ${CANTIDAD_EXAMEN}</h2>

        <p><strong>${pregunta.pregunta}</strong></p>

        ${pregunta.opciones.map((opcion, index) => `
            <div>
                <label>
                    <input type="radio"
                           name="respuesta"
                           value="${index}">
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

    const seleccionada =
        document.querySelector('input[name="respuesta"]:checked');

    if (!seleccionada) {
        alert("Seleccione una respuesta");
        return;
    }

    const respuestaUsuario =
        parseInt(seleccionada.value);

    if (respuestaUsuario === examen[preguntaActual].correcta) {
        respuestasCorrectas++;
    }

    preguntaActual++;

    if (preguntaActual < examen.length) {
        mostrarPregunta();
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {

    const porcentaje =
        Math.round((respuestasCorrectas / examen.length) * 100);

    const aprobado = porcentaje >= 70;

    document.getElementById("app").innerHTML = `
        <h2>Examen Finalizado</h2>

        <p>Correctas: ${respuestasCorrectas}</p>

        <p>Incorrectas: ${examen.length - respuestasCorrectas}</p>

        <h3>${porcentaje}%</h3>

        <h2>
            ${aprobado ? "✅ APROBADO" : "❌ DESAPROBADO"}
        </h2>
    `;
}

cargarPreguntas();
