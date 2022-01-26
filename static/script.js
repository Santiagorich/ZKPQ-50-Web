const preguntas = document.querySelector('#preguntas');
const paragraph = document.querySelector('#description');
const button = document.querySelector('#buttonst');
const buttonv = document.querySelector('#buttonv');
const buttonf = document.querySelector('#buttonf');
const prevb = document.querySelector('#prev');
const nextb = document.querySelector('#next');
const counter = document.querySelector('#counter');
const instructions = document.querySelector('#instructions');
const resultados = document.querySelector('#resultados');
const sexoint = document.querySelector('#sexo');
const edadint = document.querySelector('#edad');
const labelh = document.querySelector('#labelh');
const labelh2 = document.querySelector('#labelh2');
const labelh3 = document.querySelector('#labelh3');

var questionum = -1;
var preguntasres;
var preguntasressplit;
var respuestasv = [0];
var respuestasf = [0];

async function getquestions(){
    const result = await fetch('http://localhost:5000/api/v1/resources/questions');
    if (result.ok == true) {
        await result.text().then(res=>{
            preguntasres = res;
            preguntasressplit = preguntasres.split('\n')
            counter.textContent = (questionum+1) +"/"+(preguntasressplit.length-1);
        });
    }else{
        alert("Error cargando preguntas")
    }
    
}


button.addEventListener("click",()=>{
    start();
})

buttonv.addEventListener("click",()=>{
    if((respuestasf.length+respuestasv.length) != 50){
        respuestasv.push(questionum+1);
    }    
    next();
})
buttonf.addEventListener("click",()=>{
    if((respuestasf.length+respuestasv.length) != 50){
        respuestasf.push(questionum+1);
    }
    next();
})

getquestions();

function next(){
    if (!button.classList.contains("hidden")){
        start();
    }
    if(questionum < (preguntasressplit.length-2)){
        questionum++;
        preguntas.textContent = preguntasressplit[questionum];
        counter.textContent = (questionum+1) +"/"+(preguntasressplit.length-1);
        if(respuestasf.includes(questionum+1) || respuestasv.includes(questionum+1)){
            nextb.classList.remove("hidden");
        }
        else{
            nextb.classList.add("hidden");
        }
    }
    else{
        if((respuestasf.length+respuestasv.length) == 50){
            finish();
        }
    }
    

}


function prev(){
    if (!button.classList.contains("hidden")){
        start();
    }
    if(questionum <= 0){
        reset();
    }
    else{
        questionum--;
        preguntas.textContent = preguntasressplit[questionum];
        if(respuestasf.includes(questionum+1) || respuestasv.includes(questionum+1)){
            nextb.classList.remove("hidden");
        }
        else{
            nextb.classList.add("hidden");
        }
    }
    
    counter.textContent = (questionum+1) +"/"+(preguntasressplit.length-1);

}

function start(){
    if(sexoint.value == 0){
        sexoint.classList.add("incorrect");
        edadint.classList.remove("incorrect");
        if(edadint.value<1 || edadint.value.length < 1){
            edadint.classList.add("incorrect");
        }
}else if(edadint.value<1 || edadint.value.length < 1){
    sexoint.classList.remove("incorrect");
    edadint.classList.add("incorrect");
}else{
    edadint.classList.remove("incorrect");
    sexoint.classList.remove("incorrect");
    labelh.classList.add("hidden");
    labelh2.classList.add("hidden");
    labelh3.classList.add("hidden");
    edadint.classList.add("hidden");
    sexoint.classList.add("hidden");
    button.classList.add("hidden");
    next();
    instructions.textContent = "Contesta Verdadero(V) o Falso(F)";
    buttonv.classList.remove("hidden");
    buttonf.classList.remove("hidden");
    prevb.classList.remove("hidden");
    if(respuestasf.includes(questionum+1) || respuestasv.includes(questionum+1)){
        nextb.classList.remove("hidden");
    }
    counter.classList.remove("hidden");
    instructions.classList.remove("hidden");
    description.classList.add("hidden");
}
}

function reset(){
    paragraph.textContent = "El ZKPQ-50-CC es una versión transcultural breve del cuestionario ZKPQ-III-R (Zuckerman, Kuhlman, Joireman, Teta y Kraft, 1993) que evalúa el modelo de personalidad biológico factorial de los Cinco Alternativos (Zuckerman, Kuhlman, Thornquist, & Kiers, 1991)."
    preguntas.textContent = 'Bienvenido al test de personalidad (ZKPQ-50-CC)';
    button.classList.remove("hidden");
    prevb.classList.add("hidden");
    nextb.classList.add("hidden");
    counter.classList.add("hidden");
    instructions.classList.add("hidden");
    description.classList.remove("hidden");
    buttonv.classList.add("hidden");
    buttonf.classList.add("hidden");
    labelh.classList.remove("hidden");
    labelh2.classList.remove("hidden");
    labelh3.classList.remove("hidden");
    sexoint.classList.remove("hidden");
    edadint.classList.remove("hidden");
}

function finish(){
    paragraph.textContent = "Cargando..."
    paragraph.classList.add("bold");
    preguntas.textContent = 'Resultados';
    counter.classList.add("hidden");
    prevb.classList.add("hidden");
    nextb.classList.add("hidden");
    counter.classList.add("hidden");
    instructions.classList.add("hidden");
    description.classList.remove("hidden");
    buttonv.classList.add("hidden");
    buttonf.classList.add("hidden");
    button.classList.remove("hidden");
    button.textContent = "Reiniciar"
    button.addEventListener("click",()=>{
        location.reload();
    })
    var rv = respuestasv.join(".");
    var rf = respuestasf.join(".");
    var sexoint = 1;
    var edadint = 20;
    getresults(rv, rf, sexoint, edadint);
}

async function getresults(rv,rf,sexoint,edadint) {
    await fetch('http://localhost:5000/api/v1/resources/test', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({v: rv, f: rf, sexo: sexoint, edad: edadint})
      }).then(res=>res.text()).then(res=>{
          resultados.innerHTML = res;
          description.classList.add("hidden");
          paragraph.classList.remove("bold");
        });
}