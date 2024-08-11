window.addEventListener("load", () => {
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
      number: {
        value: 100, // Increase this value to have more particles
        density: {
          enable: true,
          value_area: 800, // Adjust the area to control particle density
        },
      },
      links: {
        enable: true,
        opacity: 0.3,
        distance: 190,
      },
      move: {
        enable: true,
        speed: 1, // Adjust the speed as needed
      },
      opacity: {
        value: { min: 0.5, max: 0.7 },
      },
      size: {
        value: { min: 1, max: 3 }, // Increase the max size if you want bigger particles
      },
    },
  };
  tsParticles.load("tsparticles", options);
});
