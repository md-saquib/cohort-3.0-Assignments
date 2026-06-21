

const btn = document.querySelector(".btn");

const playArea = document.querySelector('.playArea');

const box = document.createElement('div');

const time = document.querySelector('#timer');
const point = document.querySelector('#score');

const overlay = document.querySelector('.overlay');

box.classList.add('box');



function rgb() {

    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`
}

function randomBox() {
    playArea.append(box);

    box.style.backgroundColor = rgb();

    let minH = playArea.clientHeight - box.offsetHeight;
    let minW = playArea.clientWidth - box.offsetWidth;


    minH = Math.floor(Math.random() * minH)
    minW = Math.floor(Math.random() * minW)

    box.style.top = `${minH}px`;
    box.style.left = `${minW}px`;

}




let interval;
let timer = 0;
let score = 0;



btn.addEventListener('click', function () {

    btn.disabled = true;
    clearInterval(interval);

    interval = setInterval(() => {
        randomBox();
        timer += 1;
        time.textContent = timer;
    }, 1000)


    setTimeout(() => {
        clearInterval(interval);

        overlay.style.display = 'flex';


        setTimeout(() => {
            timer = 0;
            score = 0;
            time.textContent = 0;
            point.textContent = 0;
            overlay.style.display = 'none';
            btn.disabled = false;
            playArea.removeChild(box);

        }, 3000)

    }, 10000)
})

box.addEventListener('click', () => {
    score += 1;
    point.textContent = score;
    playArea.removeChild(box);
})

