// *** Global Variables ***
const configBtn = document.querySelector('.config-heading'),
      IN_number = document.querySelectorAll('.form-control'),
      IN_range = document.querySelectorAll('.form-range'),
      IN_heart = document.querySelector('.heart-input'),
      IN_respiratory = document.querySelector('.respiratory-input');

let initStatus = true;

// *** Events ***
// Open config on click
configBtn.addEventListener('click', openConfig);
// Number Inputs
IN_number.forEach(item => {
  item.addEventListener('input', setNumberVal);
});
// Range Inputs
IN_range.forEach(item => {
  item.addEventListener('input', setRangeVal);
});

// After page load
window.addEventListener('load', init);


// *** Global Functions ***
// Config button
function openConfig() {
  let listContainer = configBtn.nextElementSibling,
      list = listContainer.children[0].offsetHeight,
      counter = 0;
  if (!configBtn.classList.contains('active')) { // Open List
    configBtn.classList.add('active');
    let frame = setInterval(function() {
      if (counter < list) {
        listContainer.style.height = counter + 'px';
        counter += 5;
      } else {
        listContainer.style.height = list + 'px';
        clearInterval(frame);
      }
    }, 10);
  } else { // Close List
    configBtn.classList.remove('active');
    counter = list - 5;
    let frame = setInterval(function() {
      if (counter > 0) {
        listContainer.style.height = counter + 'px';
        counter -= 5;
      } else {
        listContainer.style.height = '0px';
        clearInterval(frame);
      }
    }, 10);
  }
}

// Set Range Input Color
function setRangeColor(item) {
  let val = Math.round((item.value - item.min) / (item.max - item.min) * 100);
  item.style.background = `linear-gradient(to right, #0d6efd 0%, #0d6efd ${val}%, #cbd5e5 ${val}%, #cbd5e5 100%)`;
}

// Set Number Input Value
function setNumberVal() {
  let rangeInput = this.parentElement.nextElementSibling,
      heart = this.classList.contains('heart-input') ? this : this.closest('.form-inner').querySelector('.heart-input'),
      respiratory = this.classList.contains('respiratory-input') ? this : this.closest('.form-inner').querySelector('.respiratory-input');

  if (Number(this.value) < Number(this.min) || Number(this.value) > Number(this.max)) {
    this.classList.add('is-invalid')
  } else {
    this.classList.remove('is-invalid')
    // Set Input value
    rangeInput.value = this.value;
    // Set Color
    setRangeColor(rangeInput);
    // Update Wave
    updateWaveforms(Number(heart.value), Number(respiratory.value));
  }
}

// Update Wave
function updateWaveforms(heartRate, respiratoryRate) {
  // Scale factor for ECG and Pulse Oximeter (based on heart rate)
  const ecgScale = 60 / heartRate; // Adjust scaling logic as needed
  const pulseOxScale = 60 / heartRate;

  // Scale factor for Capnometric (based on respiratory rate)
  const capnoScale = 12 / respiratoryRate; // Adjust scaling logic as needed

  // Update ECG path
  const ecgPath = document.querySelectorAll('.ecg-path');
  ecgPath.forEach(item => {
    item.setAttribute('d', `M0,50 L${20 * ecgScale},50 L${30 * ecgScale},20 L${40 * ecgScale},80 L${50 * ecgScale},50 L${70 * ecgScale},50`);
  })

  // Update Pulse Oximeter path
  const pulseOxPath = document.querySelectorAll('.pulse-ox-path');
  pulseOxPath.forEach(item => {
    item.setAttribute('d', `M0,50 L${20 * pulseOxScale},50 L${30 * pulseOxScale},30 L${40 * pulseOxScale},50 L${60 * pulseOxScale},50`);
  })

  // Update Capnometric path
  const capnoPath = document.querySelectorAll('.capno-path');
  capnoPath.forEach(item => {
    item.setAttribute('d', `M0,50 L${20 * capnoScale},50 L${20 * capnoScale},30 L${40 * capnoScale},30 L${40 * capnoScale},50 L${60 * capnoScale},50`);
  });

  // Set SVG Width
  setSvgWidth();
}

// Set Range Input Value
function setRangeVal() {
  let numInput = this.parentElement.querySelector('input[type=number]'),
      formInner = this.closest('.form-inner'),
      heart = formInner.querySelector('.heart-input'),
      respiratory = formInner.querySelector('.respiratory-input');
  // Set Input value
  numInput.value = this.value;
  numInput.classList.remove('is-invalid');
  // Set Color
  setRangeColor(this);
  // Update Wave
  updateWaveforms(Number(heart.value), Number(respiratory.value));
}

// Set SVG Width
function setSvgWidth() {
  const allSvg = document.querySelectorAll('.svg-wave');
  allSvg.forEach(item => {
    let pathEle = item.querySelector('path'),
        getPathWidth = pathEle.getBBox(),
        pathWidth = getPathWidth.width + getPathWidth.x;
    item.setAttribute('width', parseInt(pathWidth));

    // Duplicate SVG
    if (initStatus) { // ONLY one time on page load
      for (let i = 0; i < 25; i++) {
        let copyItem = item.cloneNode(true);
        item.parentElement.appendChild(copyItem);
      }
    }

  });
}

// Duplicate SVG
function duplicateSvg() {
  const allSvg = document.querySelectorAll('.svg-wave');
  allSvg.forEach
}

// Init
function init() {
  // Range Inputs Style
  IN_range.forEach(item => setRangeColor(item));
  // Open Config
  openConfig();
  // Wave Init
  updateWaveforms(Number(IN_heart.value), Number(IN_respiratory.value));
  initStatus = false;
}


/*

SVG path animation

let offset = 0;
function animateWaveforms() {
  const ecgPath = document.getElementById('ecg-path');
  const pulseOxPath = document.getElementById('pulse-ox-path');
  const capnoPath = document.getElementById('capno-path');

  // Update the paths with a scrolling effect
  ecgPath.setAttribute('d', `M${offset},50 L${20 + offset},50 L${30 + offset},20 L${40 + offset},80 L${50 + offset},50 L${70 + offset},50`);
  pulseOxPath.setAttribute('d', `M${offset},50 L${20 + offset},50 L${30 + offset},30 L${40 + offset},50 L${60 + offset},50`);
  capnoPath.setAttribute('d', `M${offset},50 L${20 + offset},50 L${20 + offset},30 L${40 + offset},30 L${40 + offset},50 L${60 + offset},50`);

  // Reset offset when it goes beyond the SVG width
  if (offset > 300) offset = 0;
  else offset += 1; // Adjust speed by changing this value

  requestAnimationFrame(animateWaveforms);
}

//animateWaveforms();

*/