// ---------- Elementos de la página ----------
const formulario = document.getElementById("formulario");
const campoFecha = document.getElementById("fecha");
const campoTema = document.getElementById("tema");
const campoMinutos = document.getElementById("minutos");
const textoRacha = document.getElementById("racha");
const textoMejorRacha = document.getElementById("mejor-racha");
const textoMejorRachaDias = document.getElementById("mejor-racha-dias");
const lista = document.getElementById("lista");
const textoVacio = document.getElementById("vacio");

const CLAVE = "sesiones";

// ---------- Fechas (siempre en hora local, nunca UTC) ----------

// Convierte un objeto Date a texto "AAAA-MM-DD" usando la fecha local.
function fechaATexto(fecha) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return año + "-" + mes + "-" + dia;
}

// Convierte "AAAA-MM-DD" a un objeto Date a las 12:00 locales
// (así evitamos problemas con cambios de hora).
function textoAFecha(texto) {
  const partes = texto.split("-");
  return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]), 12);
}

// Devuelve el texto de la fecha desplazada "dias" días (-1 = ayer).
function moverDias(texto, dias) {
  const fecha = textoAFecha(texto);
  fecha.setDate(fecha.getDate() + dias);
  return fechaATexto(fecha);
}

// ---------- Guardado en localStorage ----------

function cargarSesiones() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) {
    return [];
  }
  try {
    return JSON.parse(guardado);
  } catch (error) {
    return [];
  }
}

function guardarSesiones(sesiones) {
  localStorage.setItem(CLAVE, JSON.stringify(sesiones));
}

let sesiones = cargarSesiones();

// ---------- Racha ----------

function calcularRacha() {
  // Días que tienen al menos una sesión
  const diasConSesion = new Set(sesiones.map((s) => s.fecha));

  const hoy = fechaATexto(new Date());
  let dia = hoy;

  // Si hoy aún no he estudiado, la racha sigue viva desde ayer
  if (!diasConSesion.has(dia)) {
    dia = moverDias(dia, -1);
  }

  let racha = 0;
  while (diasConSesion.has(dia)) {
    racha++;
    dia = moverDias(dia, -1);
  }
  return racha;
}

// La mejor racha es la secuencia más larga de días consecutivos con sesión.
// No cuenta fechas futuras. Se calcula cada vez, no se guarda.
function calcularMejorRacha() {
  const hoy = fechaATexto(new Date());

  // Días distintos con sesión (sin futuros), del más antiguo al más reciente
  const dias = Array.from(new Set(sesiones.map((s) => s.fecha)))
    .filter((dia) => dia <= hoy)
    .sort();

  let mejor = 0;
  let rachaEnCurso = 0;
  let anterior = null;

  for (const dia of dias) {
    if (anterior !== null && dia === moverDias(anterior, 1)) {
      rachaEnCurso++;
    } else {
      rachaEnCurso = 1;
    }
    mejor = Math.max(mejor, rachaEnCurso);
    anterior = dia;
  }
  return mejor;
}

// ---------- Pintar en pantalla ----------

function formatearFecha(texto) {
  return textoAFecha(texto).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function pintar() {
  textoRacha.textContent = calcularRacha();

  const mejor = calcularMejorRacha();
  textoMejorRacha.textContent = mejor;
  textoMejorRachaDias.textContent = mejor === 1 ? "día" : "días";

  // Más reciente primero (las fechas en formato AAAA-MM-DD se ordenan como texto)
  const ordenadas = sesiones.slice().sort((a, b) => {
    if (a.fecha !== b.fecha) {
      return a.fecha < b.fecha ? 1 : -1;
    }
    return b.id - a.id; // mismo día: la última añadida primero
  });

  lista.innerHTML = "";
  for (const sesion of ordenadas) {
    const item = document.createElement("li");
    item.className = "sesion";

    const info = document.createElement("div");

    const tema = document.createElement("div");
    tema.className = "sesion-tema";
    tema.textContent = sesion.tema;

    const fecha = document.createElement("div");
    fecha.className = "sesion-fecha";
    fecha.textContent = formatearFecha(sesion.fecha);

    info.appendChild(tema);
    info.appendChild(fecha);

    const minutos = document.createElement("div");
    minutos.className = "sesion-minutos";
    minutos.textContent = sesion.minutos + " min";

    item.appendChild(info);
    item.appendChild(minutos);
    lista.appendChild(item);
  }

  textoVacio.hidden = sesiones.length > 0;
}

// ---------- Formulario ----------

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const fecha = campoFecha.value;
  const tema = campoTema.value.trim();
  const minutos = Number(campoMinutos.value);

  if (!fecha || !tema || !(minutos > 0)) {
    return;
  }

  sesiones.push({ id: Date.now(), fecha: fecha, tema: tema, minutos: minutos });
  guardarSesiones(sesiones);

  campoTema.value = "";
  campoMinutos.value = "";
  campoTema.focus();

  pintar();
});

// ---------- Inicio ----------
campoFecha.value = fechaATexto(new Date());
pintar();
