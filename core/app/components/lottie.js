import { Lottie } from '../../../cdn_modules/lottie-web@5.12.2/lottie.js';

alert(Lottie)
/*
async function loadAnimation() {
// Create Lottie instance
// (you can also use Animation.fromJSON method if you already have the Lottie JSO
const anim = Animation.fromURL('https://assets1.lottiefiles.com/packages/lf20_u4j
// Print some data of the animation
console.log('Frame Rate', anim.frameRate);
console.log('Number of Layers', anim.layers.length);
console.log(anim.getColors());
// Manipulate animation
anim.name = 'Woohoo';
anim.width = 512;
anim.height = 512;
// Get the new JSON
const woohooLottie = JSON.stringify(anim);
console.log(woohooLottie);
}

Promise.resolve(loadAnimation);

*/




let svgContainer = document.querySelector('.bodymovinanim');
let animItem = bodymovin.loadAnimation({
  wrapper: svgContainer,
  animType: 'svg',
  loop: true,
  path: "https://raw.githubusercontent.com/thesvbd/Lottie-examples/master/assets/animations/loading.json"
});