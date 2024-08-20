$(document).ready(function () {
  // init_loader();
});

/* --------------------------------------------
     Page loader
     --------------------------------------------- */
//  function init_loader() {

//   $("body").addClass("overflow-hidden");

// Start the loader
//   $(".page-loader").delay(9500).slideUp("linear", function() {

//     $("body").removeClass("overflow-hidden");
//   });
// }

// const staggerFromValues = ["left", "end", "center", "edges", "random"];
// let staggerIndex = 0;

// function animateSquares() {
//   gsap.to(".square", {
//     duration: 1,
//     z: 150,
//     repeat: 1,
//     yoyo: true,
//     repeatDelay: 1,
//     stagger: {
//       grid: "auto",
//       from: staggerFromValues[staggerIndex],
//       amount: 3,
//     },
//     ease: "back.out(1.7)",
//     onComplete: function () {
//       staggerIndex = (staggerIndex + 1) % staggerFromValues.length;
//       animateSquares();
//     },
//   });
// }

// animateSquares();

const options = {
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },

      onHover: {
        enable: true,
        mode: "repulse",
      },
    },

    modes: {
      push: {
        quantity: 3,
      },

      repulse: {
        distance: 100,
      },
    },
  },

  particles: {
    links: {
      enable: true, // this enables links between particles
      opacity: 0.3,
      distance: 200,
    },

    move: {
      enable: true,
    },

    opacity: {
      value: { min: 0.5, max: 0.7 },
    },

    size: {
      value: { min: 1, max: 1 },
    },
  },
};

tsParticles.load("tsparticles", options);

const canvasEl = document.querySelector("canvas#neuro");
const devicePixelRatio = Math.min(window.devicePixelRatio, 2);

const pointer = {
  x: 0,
  y: 0,
  tX: 0,
  tY: 0,
};

let uniforms;
const gl = initShader();

setupEvents();

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

render();

function initShader() {
  const vsSource = document.getElementById("vertShader").textContent;
  const fsSource = document.getElementById("fragShader").textContent;

  const gl =
    canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

  if (!gl) {
    alert("WebGL is not supported by your browser.");
    return;
  }

  function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
  const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

  function createShaderProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(program)
      );
      return null;
    }

    return program;
  }

  const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
  uniforms = getUniforms(shaderProgram);

  function getUniforms(program) {
    let uniforms = [];
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      let uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
  }

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.useProgram(shaderProgram);

  const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(positionLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  return gl;
}

function render() {
  const currentTime = performance.now();

  pointer.x += (pointer.tX - pointer.x) * 0.5;
  pointer.y += (pointer.tY - pointer.y) * 0.5;

  gl.uniform1f(uniforms.u_time, currentTime);
  gl.uniform2f(
    uniforms.u_pointer_position,
    pointer.x / window.innerWidth,
    1 - pointer.y / window.innerHeight
  );
  gl.uniform1f(
    uniforms.u_scroll_progress,
    window["pageYOffset"] / (2 * window.innerHeight)
  );

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

function resizeCanvas() {
  canvasEl.width = window.innerWidth * devicePixelRatio;
  canvasEl.height = window.innerHeight * 0.5 * devicePixelRatio; // Set height to 50% of viewport height
  gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
  gl.viewport(0, 0, canvasEl.width, canvasEl.height);
}

function setupEvents() {
  window.addEventListener("pointermove", (e) => {
    updateMousePosition(e.clientX, e.clientY);
  });
  window.addEventListener("touchmove", (e) => {
    updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  });
  window.addEventListener("click", (e) => {
    updateMousePosition(e.clientX, e.clientY);
  });

  function updateMousePosition(eX, eY) {
    pointer.tX = eX;
    pointer.tY = eY;
  }
}

window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("resize", handleWindowResize);

const spansSlow = document.querySelectorAll(".spanSlow");
const spansFast = document.querySelectorAll(".spanFast");

let width = window.innerWidth;

function handleMouseMove(e) {
  let normalizedPosition = e.pageX / (width / 2) - 1;
  let speedSlow = 100 * normalizedPosition;
  let speedFast = 200 * normalizedPosition;
  spansSlow.forEach((span) => {
    span.style.transform = `translate(${speedSlow}px)`;
  });
  spansFast.forEach((span) => {
    span.style.transform = `translate(${speedFast}px)`;
  });
}
//we need to recalculate width when the window is resized
function handleWindowResize() {
  width = window.innerWidth;
}

// portfolio
document.querySelectorAll(".portfolio-item").forEach((item) => {
  const video = item.querySelector(".portfolio-video");

  item.addEventListener("mouseover", () => {
    if (video) {
      video.play();
    }
  });

  item.addEventListener("mouseout", () => {
    if (video) {
      video.pause();
      video.currentTime = 0; // Optionally reset video to the beginning
    }
  });
});

const toggle = document.getElementById("toggle");
const basicPrice = document.getElementById("basic-price");
const startupPrice = document.getElementById("startup-price");
const enterprisePrice = document.getElementById("enterprise-price");
const pricingDescription = document.getElementById("pricing-description");

toggle.addEventListener("change", function () {
  if (this.checked) {
    // Annual pricing
    basicPrice.textContent = "100";
    startupPrice.textContent = "240";
    enterprisePrice.textContent = "350";
    pricingDescription.innerHTML = "Save more with annual plans!";
  } else {
    // Monthly pricing
    basicPrice.textContent = "10";
    startupPrice.textContent = "24";
    enterprisePrice.textContent = "35";
    pricingDescription.innerHTML =
      "Choose a plan that works best for you and<br /> your team.";
  }
});
