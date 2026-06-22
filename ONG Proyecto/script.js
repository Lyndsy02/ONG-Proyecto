const menuToggle = document.querySelector(".menu-toggle");
const menuPrincipal = document.querySelector(".header-derecha");

if (menuToggle && menuPrincipal) {
  menuToggle.addEventListener("click", function () {
    const estaAbierto = menuPrincipal.classList.toggle("menu-abierto");
    menuToggle.setAttribute("aria-expanded", estaAbierto);
  });

  menuPrincipal.querySelectorAll("a").forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      menuPrincipal.classList.remove("menu-abierto");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      menuPrincipal.classList.remove("menu-abierto");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const modalOverlay = document.createElement("div");
modalOverlay.classList.add("modal-overlay");

modalOverlay.innerHTML = `
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="tituloModalDonacion">
    <button type="button" class="close-btn" aria-label="Cerrar" onclick="closeModal()">✕</button>

    <h2 id="tituloModalDonacion">Ayudanos a seguir rescatando</h2>

    <p>
      Completá tus datos y elegí cómo querés colaborar
      con Proyecto Huellitas.
    </p>

    <form id="formularioDonacion">
      <div class="form-group">
        <label for="nombreDonacion">Nombre</label>
        <input type="text" id="nombreDonacion" name="nombre" placeholder="Ingresá tu nombre" autocomplete="name" required>
      </div>

      <div class="form-group">
        <label for="emailDonacion">Correo electrónico</label>
        <input type="email" id="emailDonacion" name="email" placeholder="correo@email.com" autocomplete="email" required>
      </div>

      <div class="form-group">
        <label for="tipoDonacion">Tipo de donación</label>
        <select id="tipoDonacion" name="tipoDonacion" required>
          <option value="">Seleccioná una opción</option>
          <option value="dinero">Dinero</option>
          <option value="alimento">Alimento</option>
          <option value="medicamentos">Medicamentos</option>
          <option value="mantas">Mantas</option>
          <option value="limpieza">Elementos de limpieza</option>
        </select>
      </div>

      <button type="submit" class="submit-btn">Enviar solicitud</button>

      <p class="mensaje-exito" id="mensajeExito" aria-live="polite">
        ¡Gracias por ayudarnos! Nos comunicaremos con vos.
      </p>
    </form>
  </div>
`;

document.body.appendChild(modalOverlay);

const formularioDonacion = document.getElementById("formularioDonacion");
const mensajeExito = document.getElementById("mensajeExito");

function openModal() {
  mensajeExito.style.display = "none";
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  const primerCampo = document.getElementById("nombreDonacion");
  if (primerCampo) {
    setTimeout(function () {
      primerCampo.focus();
    }, 100);
  }
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

modalOverlay.addEventListener("click", function (evento) {
  if (evento.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && modalOverlay.classList.contains("active")) {
    closeModal();
  }
});

formularioDonacion.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensajeExito.style.display = "block";
  formularioDonacion.reset();
});

const formularioContacto = document.getElementById("formularioContacto");
const mensajeContacto = document.getElementById("mensajeContacto");

if (formularioContacto && mensajeContacto) {
  formularioContacto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensajeContacto.style.display = "block";
    formularioContacto.reset();
  });
}

const formularioImpacto = document.getElementById("formularioImpacto");
const montoImpacto = document.getElementById("montoImpacto");
const resultadoImpacto = document.getElementById("resultadoImpacto");
const botonesMonto = document.querySelectorAll("[data-monto]");

function formatearPesos(numero) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(numero);
}

function plural(cantidad, singular, pluralTexto) {
  return cantidad === 1 ? singular : pluralTexto;
}

function calcularImpacto(monto) {
  const costoRacion = 2000;
  const costoVacuna = 10000;
  const costoConsulta = 20000;

  const raciones = Math.floor(monto / costoRacion);
  const vacunas = Math.floor(monto / costoVacuna);
  const consultas = Math.floor(monto / costoConsulta);

  resultadoImpacto.innerHTML = `
    <p class="resultado-monto">Con una donación de <strong>${formatearPesos(monto)}</strong> podrías ayudar a cubrir aproximadamente:</p>

    <div class="opciones-impacto">
      <div class="opcion-impacto">
        <span>🥣</span>
        <strong>${raciones}</strong>
        <p>${plural(raciones, "ración de alimento", "raciones de alimento")}</p>
      </div>

      <div class="opcion-impacto">
        <span>💉</span>
        <strong>${vacunas}</strong>
        <p>${plural(vacunas, "vacuna", "vacunas")}</p>
      </div>

      <div class="opcion-impacto">
        <span>🩺</span>
        <strong>${consultas}</strong>
        <p>${plural(consultas, "consulta veterinaria", "consultas veterinarias")}</p>
      </div>
    </div>

    <button type="button" class="boton resultado-donar" onclick="openModal()">Quiero realizar esta ayuda</button>
  `;
}

botonesMonto.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const monto = Number(boton.dataset.monto);
    montoImpacto.value = monto;
    calcularImpacto(monto);

    botonesMonto.forEach(function (otroBoton) {
      otroBoton.classList.remove("seleccionado");
    });
    boton.classList.add("seleccionado");
  });
});

if (formularioImpacto && montoImpacto && resultadoImpacto) {
  formularioImpacto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const monto = Number(montoImpacto.value);

    if (!Number.isFinite(monto) || monto < 1000) {
      resultadoImpacto.innerHTML = `
        <div class="resultado-error">
          <span>⚠️</span>
          <p>Ingresá un monto igual o mayor a $1.000.</p>
        </div>
      `;
      return;
    }

    botonesMonto.forEach(function (boton) {
      boton.classList.toggle("seleccionado", Number(boton.dataset.monto) === monto);
    });

    calcularImpacto(monto);
  });
}
