const gameContainer = document.querySelector("#game-container");
const initialInterface = document.querySelector("a-plane#initialInterface");
const title = document.querySelector("a-text#title");
const subTitle = document.querySelector("a-text#subTitle");
const gameButton = document.querySelector("a-cylinder#gameButton");
const powerIcon = document.querySelector("a-image#powerIcon");
const blackboard = document.querySelector("a-plane#blackboard");
const resetBox = document.querySelector("a-box#resetBox");
const boxTime = document.querySelector("a-box#boxTime");
let gameTime = document.querySelector("a-text#gameTime");
let intervalTempo;
let tempo;
let cardBefore = null;
let hits = 0;
let errors = 0;

// Todos as informações para preencher a blackboard conforme o card específico
const cardsDefinitions = [
  {
    src: "img/card-html.png",
    title: "Html",
    definition: "HTML e uma linguagem de marcaçao utilizada na construcao de paginas na Web. Documentos HTML podem ser interpretados por navegadores."
  },
  {
    src: "img/card-python.png",
    title: "Python",
    definition: "Python e uma linguagem de programacao de alto nivel, interpretada de script, imperativa, orientada a objetos, funcional, de tipagem dinamica e forte. Foi lancada por Guido van Rossum em 1991."
  },
  {
    src: "img/card-npm.png",
    title: "Npm",
    definition: "npm e um gerenciador de pacotes para o Node.JS npm, Inc. e uma subsidiaria do GitHub, que fornece hospedagem para desenvolvimento de software e controle de versao com o uso do Git."
  },
  {
    src: "img/card-sql.png",
    title: "MySQL",
    definition: "O MySQL e um sistema de gerenciamento de banco de dados, que utiliza a linguagem SQL como interface. E atualmente um dos sistemas de gerenciamento de bancos de dados mais populares da Oracle Corporation, com mais de 10 milhoes de instalacoes pelo mundo."
  },
  {
    src: "img/card-react.png",
    title: "React",
    definition: "O React e uma biblioteca front-end JavaScript de codigo aberto com foco em criar interfaces de usuario em paginas web."
  },
  {
    src: "img/card-java.png",
    title: "Java",
    definition: "Java e uma linguagem de programacao orientada a objetos desenvolvida na decada de 90 por uma equipe de programadores chefiada por James Gosling, na empresa Sun Microsystems, que em 2008 foi adquirido pela empresa Oracle Corporation."
  },
  {
    src: "img/card-js.png",
    title: "JavaScript",
    definition: "JavaScript e uma linguagem de programacao interpretada estruturada, de script em alto nível com tipagem dinamica fraca e multiparadigma. Juntamente com HTML e CSS, o JavaScript e uma das tres principais tecnologias da World Wide Web."
  },
  {
    src: "img/card-angular.png",
    title: "Angular",
    definition: "Angular e uma plataforma de aplicacoes web de codigo-fonte aberto e front-end baseado em TypeScript liderado pela Equipe Angular do Google e por uma comunidade de individuos e corporacoes. Angular e uma reescrita completa do AngularJS, feito pela mesma equipe que o construiu."
  },
  {
    src: "img/card-css.png",
    title: "Css",
    definition: "Cascading Style Sheets e um mecanismo para adicionar estilos a uma pagina web, aplicado diretamente nas tags HTML ou ficar contido dentro das tags <style>. Tambem e possivel, adicionar estilos adicionando um link para um arquivo CSS que contem os estilos."
  },
  {
    src: "img/card-kotlin.png",
    title: "Kotlin",
    definition: "Kotlin é uma linguagem de programação multiplataforma, orientada a objetos e funcional, concisa e estaticamente tipada, desenvolvida em 2011 pela empresa tcheca JetBrains, que compila para a Máquina virtual Java e também traduzida para a linguagem JavaScript e compilada para código nativo."
  }
]

// Eventos para os elementos da tela inicial
window.addEventListener("load", ()=>{
  // Adiciona o evento de mouseenter no botão de reset
  resetBox.addEventListener("mouseenter", ()=>{
    resetBox.setAttribute("visible", "false");
    resetBox.classList.remove("raycastable");
    
    hits = 0;
    errors = 0;
    clearBlackboard();
    newGame();
  });

  // Adiciona o evento de mouseenter no botão de iniciar
  gameButton.addEventListener("mouseenter", ()=>{
    gameButton.setAttribute("visible", "false");
    powerIcon.setAttribute("visible", "false");
    title.setAttribute("visible", "false");
    subTitle.setAttribute("visible", "false");
    
    // Faz a initialInterface sumir
    initialInterface.setAttribute("animation", {
      property: "material.opacity",
      to: 0,
      dur: 500
    });
    
    setTimeout(()=>{
      // Remove a initialInterface
      initialInterface.remove();
      
      // Rotaciona a blackboard
       blackboard.setAttribute("animation", {
        property: "rotation",
        to: "0 40 0",
        dur: 700
      });
      
      setTimeout(()=>{
        // Posiciona a blackboard
        blackboard.setAttribute("animation", {
          property: "position",
          to: "-6.3 0 -5",
          dur: 700
        });
        
        setTimeout(()=>{
          // Atraso para o tempo aparecer um pouco depois da animação do início do jogo
          setTimeout(()=>{
            boxTime.setAttribute("visible", "true");
          }, 1300);
          
          // Atraso para que a animação de início do jogo aconteça depois da animação da blackboard
          newGame();
        }, 1000);
        
      }, 1200)
      
    }, 800);
    
  });
});

function resetGame(){
  return new Promise((resolve)=>{
    
    blackboard.setAttribute("animation", {
      property: "color",
      to: "#333",
      dur: 300
    });
    
    // Atraso para que a animação de mudança de cor termine
    setTimeout(()=>{
      blackboard.setAttribute("animation", {
        property: "material.opacity",
        to: "1",
        dur: 300
      });
    }, 500)
    
    
    // Revela o brain-icon, para que a blackboard não fique vazia
    setTimeout(()=>{
      blackboard.querySelector("a-image").setAttribute("visible", "true");
    }, 500);


    let cards = gameContainer.querySelectorAll(".item");

    let tamanho = cards.length - 1;
    let intervalApagar = setInterval(()=>{
      cards[tamanho].setAttribute("animation", {
        property: "material.opacity",
        to: 0,
        dur: 150
      })

      cards[tamanho].querySelector("a-image").setAttribute("animation", {
        property: "material.opacity",
        to: 0,
        dur: 200
      });

      tamanho--;

      if(tamanho < 0){
        clearInterval(intervalApagar);

        //Excluir os cards (com um atraso de 300, para dar tempo do último card sumir antes de ser excluído)
        setTimeout(()=>{
          while(gameContainer.firstChild){
            gameContainer.removeChild(gameContainer.firstChild);
          }

          resolve();
        }, 150);

      }
    }, 150); 
  });
}

function newGame(){
  let imgs = [
  "img/card-css.png",
  "img/card-js.png",
  "img/card-python.png",
  "img/card-kotlin.png",
  "img/card-js.png",
  "img/card-html.png",
  "img/card-npm.png",
  "img/card-angular.png",
  "img/card-npm.png",
  "img/card-css.png",
  "img/card-sql.png",
  "img/card-react.png",
  "img/card-angular.png",
  "img/card-java.png",
  "img/card-kotlin.png",
  "img/card-python.png",
  "img/card-sql.png",
  "img/card-java.png",
  "img/card-react.png",
  "img/card-html.png"
  ].sort(function() { return 0.5 - Math.random() });

  if(gameContainer.innerHTML == ""){
    createCards(imgs);
  } else{
    resetGame()
      .then(()=>{
        createCards(imgs);
    });
  }

}

function createCards(imgs){
  const items = [];

  imgs.forEach((img, index)=>{
    const aBox = document.createElement("a-box");
    aBox.setAttribute("class", "item");
    aBox.setAttribute("width", "2");
    aBox.setAttribute("height", "2");
    aBox.setAttribute("color", "#79798c")
    aBox.setAttribute("position", `${(index % 4) * 2.5 - 2.5} ${-Math.floor(index / 4) * 2.5} 0`);
    aBox.setAttribute("rotation", "0 0 0");
    aBox.setAttribute("material", "opacity: 0;");

    const aImage = document.createElement("a-image");
    aImage.setAttribute("src", `${img}`);
    aImage.setAttribute("width", "1.8");
    aImage.setAttribute("height", "1.8");
    aImage.setAttribute("rotation", "0 0 0");
    aImage.setAttribute("position", "0 0 0.9");
    aImage.setAttribute("material", "opacity: 0;");

    aBox.appendChild(aImage);
    items.push(aBox);
  });

  for(let item of items){
    gameContainer.appendChild(item);
  }

  let tamanho = 0;
  let intervalPreencher = setInterval(()=>{
    items[tamanho].setAttribute("animation", {
      property: "material.opacity",
      to: 1,
      dur: 150
    })

    items[tamanho].querySelector("a-image").setAttribute("animation", {
      property: "material.opacity",
      to: 1,
      dur: 200
    });

    tamanho++;

    if(tamanho >= items.length){
      clearInterval(intervalPreencher);

      // Um atraso, para garantir que os cards só irão se ocultar após
      // todos esteverem visíveis
      setTimeout(()=>{
        for(let item of items){
          item.setAttribute("animation", {
            property: "rotation",
            to: "0 180 0",
            dur: 500
          }); 
        }

        for(let item of items){
          item.classList.add("raycastable");
        }

        cardBefore = null;
        tempo = 80;
        clearInterval(intervalTempo);
        addEventoMouse();
        iniciaTempo();
      }, 500);
    }
  }, 150);
}

function addEventoMouse(){
  let timeoutId;

  document.querySelectorAll("a-box.item").forEach((item)=>{
    item.addEventListener("mouseenter", ()=>{

      timeoutId = setTimeout(()=>{
        item.setAttribute("animation", {
          property: "rotation",
          to: "0 0 0",
          dur: 500
        });

        if(!cardBefore){
          cardBefore = item;
          cardBefore.setAttribute("color", "tomato");
          cardBefore.classList.remove("raycastable");
          return;
        } 
        else if(cardBefore.querySelector("a-image").getAttribute("src") == item.querySelector("a-image").getAttribute("src")){
          item.classList.remove("raycastable");
          item.setAttribute("color", "#73fc03");
          cardBefore.setAttribute("color", "#73fc03");
          cardBefore = null;
          hits++;
          writeBlackboard(item);
          chkWin();
        }
        else{
          errors++;
          item.setAttribute("color", "tomato");

          setTimeout(()=>{
            addStyle([item, cardBefore]);
          }, 600);
        }
      }, 600);                  
    });

    // Caso o cursor saia do card dentro de um intervalo de 1 segundo, o card não vira
    item.addEventListener("mouseleave", ()=>{
      clearTimeout(timeoutId);
    });
  });
}

function iniciaTempo(){
  // Tempo do Jogo
  intervalTempo = setInterval(()=>{
    gameTime.setAttribute("value", `${tempo}`);
    tempo--;

    if(tempo < 0){
      clearInterval(intervalTempo);
      looseGame();
    }
  }, 1000);
}

function looseGame(){
  // Esvazia a blackboard
  clearBlackboard();

  blackboard.setAttribute("animation", {
    property: "color",
    to: "#d6361a",
    dur: 300
  });

  // Cria a mensagem de fracasso
  // Atrasa a criação em 300
  setTimeout(()=>{
    const failureText = document.createElement("a-text");
    failureText.setAttribute("color", "#eee");
    failureText.setAttribute("value", "Voce\nPerdeu");
    failureText.setAttribute("shader", "msdf");
    failureText.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Medium.json");
    failureText.setAttribute("scale", "3.5 3.5 1");
    failureText.setAttribute("position", "-1.7 -0.3 0");
    blackboard.appendChild(failureText);
  }, 300);


  // Retira a interação com os cards
  let cards = document.querySelectorAll(".item");
  for(let card of cards){
    card.classList.remove("raycastable");
  }
  
  setTimeout(()=>{
    showScore();
  }, 3000);
  
  showResetButton(); 
}

function showResetButton(){
  resetBox.setAttribute("visible", "true");
  resetBox.classList.add("raycastable");
}

function writeBlackboard(card){
  clearBlackboard();

  const cardSrc = card.querySelector("a-image").getAttribute("src");

  for(let {src, title, definition} of cardsDefinitions){
    if(cardSrc == src){
      const aTitle = document.createElement("a-text");
      aTitle.setAttribute("value", `${title}`);
      aTitle.setAttribute("position", "-1 2 0");
      aTitle.setAttribute("color", "#fff");
      aTitle.setAttribute("scale", "3 3 1");
      aTitle.setAttribute("shader", "msdf");
      aTitle.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/anton/Anton-Regular.json");

      const aDefinition = document.createElement("a-text");
      aDefinition.setAttribute("color", "#fff");
      aDefinition.setAttribute("anchor", "center");
      aDefinition.setAttribute("scale", "2.5 2.5 1");
      aDefinition.setAttribute("value", `${definition}`);
      aDefinition.setAttribute("width", "2");
      aDefinition.setAttribute("height", "3");

      blackboard.appendChild(aTitle);
      blackboard.appendChild(aDefinition);
    }
  }
}

function clearBlackboard(){
  if(!blackboard.innerHTML == ""){
    const brain = blackboard.querySelector("a-image");

    if(brain.getAttribute("visible")){
      brain.setAttribute("visible", "false");
    }

    const textsBlackboard = blackboard.querySelectorAll("a-text");
    textsBlackboard.forEach(text=>{
      text.remove();
    })
  }
}

function addStyle(elems){
  for(let el of elems){
    el.setAttribute("animation", {
        property: "rotation",
        to: "0 180 0",
        dur: 500
    });

    setTimeout(()=>{
      el.setAttribute("color", "#79798c");
      el.classList.add("raycastable");
      cardBefore = null;
    }, 800 * elems.lenght);
  }
}

function chkWin(){
  let count = 0;
  const cards = document.querySelectorAll(".item");

  for(let card of cards){
    if(card.getAttribute("color") == "#73fc03") count++;
  }

  if(count == cards.length){
    clearBlackboard();
    if(!blackboard.innerHTML == ""){
      blackboard.setAttribute("animation", {
        property: "color",
        to: "#5bc202",
        dur: 300
      });

      const wonText = document.createElement("a-text");
      wonText.setAttribute("color", "#eee");
      wonText.setAttribute("value", "Parabens!");
      wonText.setAttribute("shader", "msdf");
      wonText.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Medium.json");
      wonText.setAttribute("scale", "3.5 3.5 1");
      wonText.setAttribute("position", "-1.8 -0.3 1");

      blackboard.appendChild(wonText);
    }
    clearInterval(intervalTempo);
    
    setTimeout(()=>{
      showScore();
    }, 3000);
    showResetButton();
  }
}

function showScore(){
  clearBlackboard();
  
  blackboard.setAttribute("animation", {
    property: "material.opacity",
    to: "0.3",
    dur: 300
  });
  
  const scoreContainer = document.createElement("a-entity");
  scoreContainer.setAttribute("position", "-2 0 -1");
  
  const titleScore = document.createElement("a-text");
  titleScore.setAttribute("shader", "msdf");
  titleScore.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/anton/Anton-Regular.json");
  titleScore.setAttribute("value", "Score");
  titleScore.setAttribute("scale", "7 7 1");
  titleScore.setAttribute("position", "0 1 1");
  
  const acertos = document.createElement("a-text");
  acertos.setAttribute("value", `Acertos: ${hits}`);
  acertos.setAttribute("position", "0 -1 1");
  acertos.setAttribute("scale", "4 4 1");
  acertos.setAttribute("shader", "msdf");
  acertos.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Medium.json");
  
  const erros = document.createElement("a-text");
  erros.setAttribute("value", `Erros: ${errors}`);
  erros.setAttribute("position", "0 -2 1");
  erros.setAttribute("scale", "4 4 1");
  erros.setAttribute("shader", "msdf");
  erros.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Medium.json");
  
  const tempoJogo = document.createElement("a-text");
  tempoJogo.setAttribute("value", `Tempo: ${tempo + 1}`);
  tempoJogo.setAttribute("position", "0 -3 1");
  tempoJogo.setAttribute("scale", "4 4 1");
  tempoJogo.setAttribute("shader", "msdf");
  tempoJogo.setAttribute("font", "https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Medium.json");
  
  scoreContainer.appendChild(titleScore);
  scoreContainer.appendChild(acertos);
  scoreContainer.appendChild(erros);
  scoreContainer.appendChild(tempoJogo);
  blackboard.appendChild(scoreContainer);
}