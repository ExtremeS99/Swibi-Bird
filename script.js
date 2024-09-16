// 1 on pointe le canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// on appel le set d'img
const img = new Image();
//le chemin du set
img.src='./media/bubule.png'
//audio
const audio = new Audio('./media/audioPlay.mp3');
const audio2 = new Audio('./media/audioHome.mp3');
// réglages généraux
// 2 écran d'accueil si on joue ou pas
let gamePlaying = false;
const gravity=0.7;
const speed= 3;
const size=[65, 37];
const jump=-14.5;
const cTenth = (canvas.width/10);
//10 reglages des poteaux
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () =>(Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;
// 3 l'index va placer les éléments du fond et des poteaux
let index = 0,
    bestScore= 0,
    currentScore= 0,
    //pipes array avec les poteaux
    pipes= [],
    flight,
    flyHeight;
// 11 setup du jeu pour relancer
const setup = () =>{
    currentScore=0;
    flight = jump;
    flyHeight=(canvas.height/2) - (size[1]/2);
    //on se génère les poteaux
    pipes = Array(100).fill().map((a, i)=>[canvas.width + (i *(pipeGap + pipeWidth)),pipeLoc()]);
}
const render = () =>{
    //incremente
    index++;
    // 5 background
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2))% canvas.width) + canvas.width, 0 , canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2))% canvas.width), 0 , canvas.width, canvas.height)
    // 8 comportement de l'oiseau
    if(gamePlaying){
        // le paramêtre d'ou en le met sur le canvas on le change
        ctx.drawImage(img, 432, Math.floor((index % 9)/3)*size[1], ...size, cTenth, flyHeight, ...size);
        //on redéfini le flyHeight pour qu'il puis aller de haut en bas
        flight += gravity;
        flyHeight=Math.min(flyHeight + flight, canvas.height - size[1]);
    }else{
    // 4 l'oiseau
        ctx.drawImage(img, 432, Math.floor((index % 9)/3)*size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flyHeight=(canvas.height / 2) - (size[1] / 2);
        // 6 afficher un text sur un canvas
        ctx.fillText(`Samo jako : ${bestScore}`, 55, 245);
        ctx.fillText('Ne predaj se', 48, 535);
        ctx.font ="bold 30px courier";
    }
    //12 afficher les poteau à l'écran
    if(gamePlaying){
        pipes.map(pipe =>{
            pipe[0] -= speed;
            //top pipe
            ctx.drawImage(img, 432,588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0,pipeWidth, pipe[1]);
            //bottom pipe
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);
            if(pipe[0] <= -pipeWidth){
                currentScore++;
                bestScore =Math.max(bestScore, currentScore);
                //remove pipe + create new one
                pipes =[...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
                console.log(pipes)
            }
            //  14 si il touche le pipe
            if([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem =>elem)){
                gamePlaying=false;
                setup();
                audio2.play();
                audio.pause();
            }
        })
    }
    //13 affichage du score
    document.getElementById('bestScore').innerHTML =`Najbolji : ${bestScore}`;
    document.getElementById('currentScore').innerHTML =`Trenutni : ${currentScore}`;
    //tourne en boucle
    window.requestAnimationFrame(render);
}
//11
setup();
//au chargement de l'img du commence le render
img.onload=render;
// 7 Lancez le jeu
document.addEventListener('click', ()=> {
    gamePlaying = true;
    audio.play();
    audio2.pause();
});
// 8 
window.onclick=()=>{
    flight = jump;
}