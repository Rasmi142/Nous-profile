document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const progress = document.createElement("p");
  progress.style.fontSize = "14px";
  progress.style.color = "#F1F1F1";
  progress.style.fontWeight = "800";
  progress.style.marginTop = "40px";
  loader.appendChild(progress);

  const updateProgress = (event) => {
    const progressPercentage = (event.loaded / event.total) * 100;
    progress.textContent = `${progressPercentage.toFixed(2)}%`;
  };

  const handleLoad = () => {
    loader.style.display = "none";
  };

  const handleError = (error) => {
    console.error("Error loading resources:", error);
    loader.style.display = "none";
  };

  const loaderFunction = () => {
    // Update progress and hide loader on success
    updateProgress({ loaded: 100, total: 100 }); // Simulate full loading progress
    handleLoad();
  };

  loaderFunction();
});
