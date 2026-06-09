let preguntas = [];
let examen = [];
let preguntaActual = 0;
let respuestasCorrectas = 0;

const CANTIDAD_EXAMEN = 30;

async function cargarPreguntas() {

    const respuesta = await fetch('preguntas_v2.json');
    preguntas = await respuesta.json();

    document
        .getElementById("startBtn")
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

    const pregunta = examen[preguntaActual];

    const progreso =
        Math.round((preguntaActual / CANTIDAD_EXAMEN) * 100);

    document.getElementById("app").innerHTML = `

        <p><strong>Progreso:</strong>
        ${preguntaActual + 1} / ${CANTIDAD_EXAMEN}</p>

        <div style="
            width:100%;
            background:#ddd;
            height:25px;
            border-radius:10px;
            overflow:hidden;
            margin-bottom:20px;
        ">
            <div style="
                width:${progreso}%;
                background:#4CAF50;
                height:100%;
            ">
            </div>
        </div>

        <h2>Pregunta ${preguntaActual + 1} de ${CANTIDAD_EXAMEN}</h2>

        <p><strong>${pregunta.pregunta}</strong></p>

        ${pregunta.opciones.map((opcion,index)=>`
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

    const correcta = examen[preguntaActual].correcta;

if (respuestaUsuario === correcta) {

    respuestasCorrectas++;

    preguntaActual++;

    if (preguntaActual < examen.length) {
        mostrarPregunta();
    } else {
        mostrarResultado();
    }

} else {

    const respuestaCorrecta =
        examen[preguntaActual].opciones[correcta];

    document.getElementById("app").innerHTML = `

        <h2>❌ Respuesta Incorrecta</h2>

        <p>La respuesta correcta era:</p>

        <h3 style="color:green;">
            ${respuestaCorrecta}
        </h3>

        <br>

        <button onclick="continuarDespuesError()">
            Continuar
        </button>

    `;
}
{
        respuestasCorrectas++;
    }

    preguntaActual++;

    if (preguntaActual < examen.length) {
        mostrarPregunta();
    } else {
        mostrarResultado();
    }
}
function continuarDespuesError() {

    preguntaActual++;

    if (preguntaActual < examen.length) {
        mostrarPregunta();
    } else {
        mostrarResultado();
    }
}
function mostrarResultado() {

    const porcentaje =
        Math.round(
            (respuestasCorrectas / examen.length) * 100
        );

    const aprobado = porcentaje >= 70;

    document.getElementById("app").innerHTML = `

        <h2>Examen Finalizado</h2>

        <p><strong>Correctas:</strong>
        ${respuestasCorrectas}</p>

        <p><strong>Incorrectas:</strong>
        ${examen.length - respuestasCorrectas}</p>

        <h1>${porcentaje}%</h1>

        <h2>
        ${aprobado
            ? "✅ APROBADO"
            : "❌ DESAPROBADO"}
        </h2>

        <br>

        <button onclick="reiniciarExamen()">
            🔄 Rendir otro examen
        </button>
    `;
}

function reiniciarExamen() {

    iniciarExamen();
}

cargarPreguntas();
