(() => {
  const peopleCon = document.querySelector("#people-con");
  const model = document.querySelector("#model");
  const hotspots = document.querySelectorAll(".Hotspot");
  const materialTemplate = document.querySelector("#material-template");
  const materialList = document.querySelector("#material-list");

  const spinnerHTML = `<svg width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="20" fill="none" stroke-width="5" stroke="#333" stroke-dasharray="31.415, 31.415">
    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 25 25;360 25 25"></animateTransform>
  </circle>
</svg>`; 

  //show error message
  function showError(message) {
    peopleCon.innerHTML = `<p class="error">${message}</p>`;
  }

  //fetch data from API
function fetchData(url) {
  peopleCon.innerHTML = spinnerHTML;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      peopleCon.innerHTML = ''; 
      return data;
    })
    .catch(error => {
      showError('Failed to load data'); //show error message
      console.error('Fetch error:', error);
      peopleCon.innerHTML = ''; //remove spinner on error
    });
}

  // Load Info Boxes from API
function loadInfoBoxes() {
  fetchData('https://swiftpixel.com/earbud/api/infoboxes')
    .then(data => {
      console.log("Fetched Data:", data);
      if (!data) return;

      hotspots.forEach((hotspot, index) => {
        const infoBox = data[index];
        if (!infoBox) return;

        const hotspotAnnotation = hotspot.querySelector('.HotspotAnnotation');
        const titleElement = document.createElement('h2');
        titleElement.textContent = infoBox.heading;

        const textElement = document.createElement('p');
        textElement.textContent = infoBox.description;

        const imgElement = document.createElement('img');
        imgElement.src = `images/${infoBox.thumbnail}`;
        imgElement.alt = infoBox.heading;

        hotspotAnnotation.innerHTML = '';
        hotspotAnnotation.appendChild(titleElement);
        hotspotAnnotation.appendChild(textElement);
        hotspotAnnotation.appendChild(imgElement);
      });
    })
    .catch(showError);
}

  //load material info from API
  function loadMaterialInfo() {
    fetchData('https://swiftpixel.com/earbud/api/materials')
      .then(data => {
        if (!data) return; 

        data.forEach(material => {
          const clone = materialTemplate.content.cloneNode(true);
          const materialHeading = clone.querySelector(".material-heading");
          materialHeading.textContent = material.heading;

          const materialDescription = clone.querySelector(".material-description");
          materialDescription.textContent = material.description;

          materialList.appendChild(clone);
        });
      });
  }
  function modelLoaded() {
    hotspots.forEach(hotspot => {
      hotspot.style.display = "block";
    });
    loadInfoBoxes();
    loadMaterialInfo();
  }
  function showInfo() {
    let selected = document.querySelector(`#${this.slot}`);
    gsap.to(selected, 1, { autoAlpha: 1 });
  }

  function hideInfo() {
    let selected = document.querySelector(`#${this.slot}`);
    gsap.to(selected, 1, { autoAlpha: 0 });
  }
  model.addEventListener("load", modelLoaded);
  hotspots.forEach(hotspot => {
    hotspot.addEventListener("mouseenter", showInfo);
    hotspot.addEventListener("mouseleave", hideInfo);
  });

})();