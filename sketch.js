let pontos = [];
let AABB, mouseAABB, sphere, mouseSphere, OBB;
// variáveis que recebem o tipo de volume que será criado a partir de pontos e do mouse.
let pointsMode = 'AABB';
let mouseMode = 'OBB';
function setup(){
  createCanvas(720,720);
  // variáveis que guardam os valores dos volumes envoltórios de pontos
  AABB = {
    x: 0,
    y: 0,
    w: 0,
    w: 0
  },
  sphere = {
    x: 0,
    y: 0,
    r: 0
  }
  OBB = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  }
  // variáveis que guardam os valores dos volumes que seguem o mouse
  mouseAABB = {
    w: 100,
    h: 100
  },
  mouseSphere = {
    r: 100
  },
  mouseOBB = {
    w: 70,
    h: 140
  }
};

function draw(){
  background(200);
  // desenha o volume que segue o mouse
  switch(mouseMode){
    case 'AABB':
      drawMouseAABB();
      break;
    case 'Sphere':
      drawMouseSphere();
      break;
    case 'OBB':
      drawMouseOBB();
      break;
  }
  // desenha o volume envoltório de pontos, e colore seu inteiror caso esteja colidindo com o volume que segue o mouse
  switch(pointsMode){
    case 'AABB':
      drawAABB();
      break;
    case 'Sphere':
      drawSphere();
      break;
    case 'OBB':
      drawOBB();
      break;
  }
  // desenha os pontos dentro do volume
  drawPoints();  
  // desenha a hud
  drawHud();
};

function mouseClicked(){
  // Adiciona um ponto à coleção ao clicar
  let point = {
    x: mouseX,
    y: mouseY
  }
  pontos.push(point);  
};

function drawPoints(){  
  strokeWeight(5);   
  // desenha os pontos da coleção
  pontos.forEach(element => {
    stroke('purple');
    point(element.x , element.y);    
  });
};

function drawAABB(){
  rectMode(CENTER);
  if(pontos.length > 1){
    // variáveis de controle
    let minX, minY, maxX, maxY, firstElement = true;
    pontos.forEach(element => {
      if(firstElement){
        // quando só temos um ponto, este é colocado como valor de todos os limites 
        minX = element.x;
        minY = element.y;
        maxX = element.x;
        maxY = element.y;
        firstElement = false;
      } else {
        // testa se os pontos novos possuem valores que excedem os limites estabelecidos, e os define como novos limites 
        if (element.x < minX){
          minX = element.x;
        }
        if (element.y < minY){
          minY = element.y;
        }
        if (element.x > maxX){
          maxX = element.x;
        }
        if (element.y > maxY){
          maxY = element.y;
        }
      }
    });
    // define os valores do bloco AABB, com o ponto central (x,y), largura (w) e altura (h)
    AABB.x = (minX + maxX)/2;
    AABB.y = (minY + maxY)/2;
    AABB.w = maxX - minX;
    AABB.h = maxY - minY;
    stroke('red');
    //colisões
    switch(mouseMode){
      case 'AABB': // checa a colisão com outra AABB
        if(((AABB.x - AABB.w/2) < (mouseX + mouseAABB.w/2)) &&
           ((AABB.x + AABB.w/2) > (mouseX - mouseAABB.w/2)) &&
           ((AABB.y - AABB.h/2) < (mouseY + mouseAABB.h/2)) &&
           ((AABB.y + AABB.h/2) > (mouseY - mouseAABB.h/2))){
            fill(200,100,100);
           } else {
             fill(255);
           }
        break;
      case 'Sphere':
        // divide o canvas em 9 partes, com a AABB como centro (posição 5):
        //  1 || 2 || 3
        // ===||===||===
        //  4 || 5 || 6
        // ===||===||===
        //  7 || 8 || 9
        let isCollide = false;
        if ((mouseX < AABB.x - AABB.w/2) && (mouseY < AABB.y - AABB.h/2)){ // (posição 1)
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseX, mouseY, AABB.x - AABB.w/2, AABB.y - AABB.h/2))
            // checa a distãncia do raio do círculo com o corner superior esquerdo
            isCollide = true;
        } else if ((mouseX > AABB.x + AABB.w/2) && (mouseY < AABB.y - AABB.h/2)){ // (posição 3)
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseX, mouseY, AABB.x + AABB.w/2, AABB.y - AABB.h/2))
            // checa a distãncia do raio do círculo com o corner superior direito
            isCollide = true;
        } else if ((mouseX < AABB.x - AABB.w/2) && (mouseY > AABB.y + AABB.h/2)){ // (posição 7)
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseX, mouseY, AABB.x - AABB.w/2, AABB.y + AABB.h/2))
            // checa a distãncia do raio do círculo com o corner inferior esquerdo
            isCollide = true;
        } else if ((mouseX > AABB.x + AABB.w/2) && (mouseY > AABB.y + AABB.h/2)){ // (posição 9)
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseX, mouseY, AABB.x + AABB.w/2, AABB.y + AABB.h/2))
            // checa a distãncia do raio do círculo com o corner inferior direito
            isCollide = true;
        } else if (((AABB.x - AABB.w/2) < (mouseX + mouseSphere.r/2)) &&
          ((AABB.x + AABB.w/2) > (mouseX - mouseSphere.r/2)) &&
          ((AABB.y - AABB.h/2) < (mouseY + mouseSphere.r/2)) &&
          ((AABB.y + AABB.h/2) > (mouseY - mouseSphere.r/2))){
            // caso esteja nas posições 2, 4, 5, 6 ou 8, o teste AABB com AABB funciona perfeitamente
            isCollide = true;
        }
        if(isCollide){ // pinta o interior do AABB caso esteja detectando contato
          fill(200,100,100);
        } else {
          fill(255);
        } 
        break;
      case 'OBB':
        // variável de controle
        let isCollide2 = false;
        // testa se pelo menos um dos 4 vértices da OBB está dentro da AABB
        let axis = {
          x: mouseX + (mouseOBB.h/2)*Math.cos(PI/4) - (mouseOBB.w/2)*Math.cos(PI/4),
          y: mouseY - (mouseOBB.h/2)*Math.cos(PI/4) - (mouseOBB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > AABB.x - AABB.w/2) && (axis.x < AABB.x + AABB.w/2) && (axis.y > AABB.y - AABB.h/2) && (axis.y < AABB.y + AABB.h/2))
          isCollide2 = true;
        axis = {
          x: mouseX - (mouseOBB.h/2)*Math.cos(PI/4) - (mouseOBB.w/2)*Math.cos(PI/4),
          y: mouseY + (mouseOBB.h/2)*Math.cos(PI/4) - (mouseOBB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > AABB.x - AABB.w/2) && (axis.x < AABB.x + AABB.w/2) && (axis.y > AABB.y - AABB.h/2) && (axis.y < AABB.y + AABB.h/2))
          isCollide2 = true;
        axis = {
          x: mouseX - (mouseOBB.h/2)*Math.cos(PI/4) + (mouseOBB.w/2)*Math.cos(PI/4),
          y: mouseY + (mouseOBB.h/2)*Math.cos(PI/4) + (mouseOBB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > AABB.x - AABB.w/2) && (axis.x < AABB.x + AABB.w/2) && (axis.y > AABB.y - AABB.h/2) && (axis.y < AABB.y + AABB.h/2))
          isCollide2 = true;
        axis = {
          x: mouseX + (mouseOBB.h/2)*Math.cos(PI/4) + (mouseOBB.w/2)*Math.cos(PI/4),
          y: mouseY - (mouseOBB.h/2)*Math.cos(PI/4) + (mouseOBB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > AABB.x - AABB.w/2) && (axis.x < AABB.x + AABB.w/2) && (axis.y > AABB.y - AABB.h/2) && (axis.y < AABB.y + AABB.h/2))
          isCollide2 = true;
        // criamos dois vetores para receber os valores dos centros
        let mouseOBBVector = createVector(mouseX, mouseY);
        let AABBVector = createVector(AABB.x, AABB.y);
        // giramos os vetores para deixarmos o AABB como uma OBB e o OBB como uma AABB
        AABBVector.rotate(-PI/4);
        mouseOBBVector.rotate(-PI/4);
        // testa se pelo menos um dos 4 vértices da AABB está dentro da OBB
        axis = {
          x: AABBVector.x - (AABB.w/2)*Math.cos(PI/4) - (AABB.h/2)*Math.cos(PI/4),
          y: AABBVector.y + (AABB.w/2)*Math.cos(PI/4) - (AABB.h/2)*Math.cos(PI/4)
        }
        if((axis.x > mouseOBBVector.x - mouseOBB.w/2) && (axis.x < mouseOBBVector.x + mouseOBB.w/2) && (axis.y > mouseOBBVector.y - mouseOBB.h/2) && (axis.y < mouseOBBVector.y + mouseOBB.h/2))
        isCollide2 = true;
        axis = {
          x: AABBVector.x + (AABB.w/2)*Math.cos(PI/4) - (AABB.h/2)*Math.cos(PI/4),
          y: AABBVector.y - (AABB.w/2)*Math.cos(PI/4) - (AABB.h/2)*Math.cos(PI/4)
        }
        if((axis.x > mouseOBBVector.x - mouseOBB.w/2) && (axis.x < mouseOBBVector.x + mouseOBB.w/2) && (axis.y > mouseOBBVector.y - mouseOBB.h/2) && (axis.y < mouseOBBVector.y + mouseOBB.h/2))
          isCollide2 = true;
        axis = {
          x: AABBVector.x - (AABB.w/2)*Math.cos(PI/4) + (AABB.h/2)*Math.cos(PI/4),
          y: AABBVector.y + (AABB.w/2)*Math.cos(PI/4) + (AABB.h/2)*Math.cos(PI/4)
        }
        if((axis.x > mouseOBBVector.x - mouseOBB.w/2) && (axis.x < mouseOBBVector.x + mouseOBB.w/2) && (axis.y > mouseOBBVector.y - mouseOBB.h/2) && (axis.y < mouseOBBVector.y + mouseOBB.h/2))
          isCollide2 = true;
        axis = {
          x: AABBVector.x + (AABB.w/2)*Math.cos(PI/4) + (AABB.h/2)*Math.cos(PI/4),
          y: AABBVector.y - (AABB.w/2)*Math.cos(PI/4) + (AABB.h/2)*Math.cos(PI/4)
        }
        if((axis.x > mouseOBBVector.x - mouseOBB.w/2) && (axis.x < mouseOBBVector.x + mouseOBB.w/2) && (axis.y > mouseOBBVector.y - mouseOBB.h/2) && (axis.y < mouseOBBVector.y + mouseOBB.h/2))
          isCollide2 = true;
        if(isCollide2){ // pinta o interior do AABB caso esteja detectando contato
          fill(200,100,100);
        } else {
          fill(255);
        } 
        break;
    }
    strokeWeight(1);  
    // desenha o AABB propriamente dito
    rect(AABB.x ,AABB.y ,AABB.w ,AABB.h );
  }
};

function dist_2(x1, y1, x2, y2){
  // determina a distância entre dois pontos. O valor é a distância ao quadrado, para evitar o uso da raiz quadrada
  let xt = x2 - x1;
  let yt = y2 - y1;
  if ((xt*xt + yt*yt) < 0) {
    return -(xt*xt + yt*yt);
  }
  return xt*xt + yt*yt;
}

function drawSphere(){
  rectMode(CENTER);
  if(pontos.length > 1){
    // variáveis de controle
    let minX, minY, maxX, maxY, firstElement = true, r = 0;
    pontos.forEach(element => {      
      if(firstElement){
        // quando só temos um ponto, este é colocado como valor de todos os limites 
        minX = element.x;
        minY = element.y;
        maxX = element.x;
        maxY = element.y;
        firstElement = false;
      } else {
        // testa se os pontos novos possuem valores que excedem os limites estabelecidos, e os define como novos limites 
        if (element.x < minX){
          minX = element.x;
        }
        if (element.y < minY){
          minY = element.y;
        }
        if (element.x > maxX){
          maxX = element.x;
        }
        if (element.y > maxY){
          maxY = element.y;
        }
      }

    });
    sphere.x = (minX + maxX)/2;
    sphere.y = (minY + maxY)/2;
    // cria um centro para o conjunto de pontos, checa a distância desse centro e todos os pontos, e utiliza a maior distância como raio
    pontos.forEach(element => {
      let elementDist = dist_2(element.x, element.y, sphere.x, sphere.y);
      if( elementDist > r){
        r = elementDist;
      }
    });
    r = Math.sqrt(r);
    sphere.r = 2*r;
    stroke('blue');
    // colisões
    switch(mouseMode){
      case 'AABB':
        // divide o canvas em 9 partes, com a AABB como centro (posição 5):
        //  1 || 2 || 3
        // ===||===||===
        //  4 || 5 || 6
        // ===||===||===
        //  7 || 8 || 9
          let isCollide = false;
          if ((sphere.x < mouseX - mouseAABB.w/2) && (sphere.y < mouseY - mouseAABB.h/2)){ // (posição 1)
            if((sphere.r*sphere.r)/4 > dist_2(sphere.x, sphere.y, mouseX - mouseAABB.w/2, mouseY - mouseAABB.h/2))
              // checa a distãncia do raio do círculo com o corner superior esquerdo
              isCollide = true;
          } else if ((sphere.x > mouseX + mouseAABB.w/2) && (sphere.y < mouseY - mouseAABB.h/2)){ // (posição 3)
            if((sphere.r*sphere.r)/4 > dist_2(sphere.x, sphere.y, mouseX + mouseAABB.w/2, mouseY - mouseAABB.h/2))
            // checa a distãncia do raio do círculo com o corner superior direito
              isCollide = true;
          } else if ((sphere.x < mouseX - mouseAABB.w/2) && (sphere.y > mouseY + mouseAABB.h/2)){ // (posição 7)
            if((sphere.r*sphere.r)/4 > dist_2(sphere.x, sphere.y, mouseX - mouseAABB.w/2, mouseY + mouseAABB.h/2))
              // checa a distãncia do raio do círculo com o corner inferior esquerdo
              isCollide = true;
          } else if ((sphere.x > mouseX + mouseAABB.w/2) && (sphere.y > mouseY + mouseAABB.h/2)){ // (posição 9)
            if((sphere.r*sphere.r)/4 > dist_2(sphere.x, sphere.y, mouseX + mouseAABB.w/2, mouseY + mouseAABB.h/2))
              // checa a distãncia do raio do círculo com o corner inferior direito
              isCollide = true;
          } else if (((mouseX - mouseAABB.w/2) < (sphere.x + sphere.r/2)) &&
            ((mouseX + mouseAABB.w/2) > (sphere.x - sphere.r/2)) &&
            ((mouseY - mouseAABB.h/2) < (sphere.y + sphere.r/2)) &&
            ((mouseY + mouseAABB.h/2) > (sphere.y - sphere.r/2))){
              // caso esteja nas posições 2, 4, 5, 6 ou 8, o teste AABB com AABB funciona perfeitamente
              isCollide = true;
          }
          if(isCollide){
            fill(100,100,200);
          } else {
            fill(255);
          }        
        break;
      case 'Sphere':
        // testa se a distância entre a soma raio das esferas é maior que a distância entre os centros
        if(dist_2(sphere.x, sphere.y, mouseX, mouseY) < ((sphere.r/2) + (mouseSphere.r/2))*((sphere.r/2) + (mouseSphere.r/2))){
          fill(100,100,200);
        } else {
          fill(255);
        }
        break;
      case 'OBB':
          let OBBMouseVector = createVector(mouseX, mouseY);
          let SphereVector = createVector(sphere.x, sphere.y);
          // rotaciona o centro do OBB e do vetor do mouse para alinhar a OBB nos eixos X e Y
          OBBMouseVector.rotate(-PI/4);
          SphereVector.rotate(-PI/4);  
          // cria uma variável de controle      
          let isCollide2 = false;
          // com esses vetores rotacionados, podemos tratar essa colisão como uma (Sphere - AABB)
          if ((SphereVector.x < OBBMouseVector.x - mouseOBB.w/2) && (SphereVector.y < OBBMouseVector.y - mouseOBB.h/2)){ // (posição 1)
            if((sphere.r*sphere.r)/4 > dist_2(SphereVector.x, SphereVector.y, OBBMouseVector.x - mouseOBB.w/2, OBBMouseVector.y - mouseOBB.h/2))
              // checa a distãncia do raio do círculo com o corner superior esquerdo
              isCollide2 = true;
          } else if ((SphereVector.x > OBBMouseVector.x + mouseOBB.w/2) && (SphereVector.y < OBBMouseVector.y - mouseOBB.h/2)){ // (posição 3)
            if((sphere.r*sphere.r)/4 > dist_2(SphereVector.x, SphereVector.y, OBBMouseVector.x + mouseOBB.w/2, OBBMouseVector.y - mouseOBB.h/2))
            // checa a distãncia do raio do círculo com o corner superior direito
              isCollide2 = true;
          } else if ((SphereVector.x < OBBMouseVector.x - mouseOBB.w/2) && (SphereVector.y > OBBMouseVector.y + mouseOBB.h/2)){ // (posição 7)
            if((sphere.r*sphere.r)/4 > dist_2(SphereVector.x, SphereVector.y, OBBMouseVector.x - mouseOBB.w/2, OBBMouseVector.y + mouseOBB.h/2))
              // checa a distãncia do raio do círculo com o corner inferior esquerdo
              isCollide2 = true;
          } else if ((SphereVector.x > OBBMouseVector.x + mouseOBB.w/2) && (SphereVector.y > OBBMouseVector.y + mouseOBB.h/2)){ // (posição 9)
            if((sphere.r*sphere.r)/4 > dist_2(SphereVector.x, SphereVector.y, OBBMouseVector.x + mouseOBB.w/2, OBBMouseVector.y + mouseOBB.h/2))
              // checa a distãncia do raio do círculo com o corner inferior direito
              isCollide2 = true;
          } else if (((OBBMouseVector.x - mouseOBB.w/2) < (SphereVector.x + sphere.r/2)) &&
            ((OBBMouseVector.x + mouseOBB.w/2) > (SphereVector.x - sphere.r/2)) &&
            ((OBBMouseVector.y - mouseOBB.h/2) < (SphereVector.y + sphere.r/2)) &&
            ((OBBMouseVector.y + mouseOBB.h/2) > (SphereVector.y - sphere.r/2))){
              // caso esteja nas posições 2, 4, 5, 6 ou 8, o teste AABB com AABB funciona perfeitamente
              isCollide2 = true;
          }
          if(isCollide2){
            fill(100,100,200);
          } else {
            fill(255);
          }      
        break;
    }
    strokeWeight(1);  
    ellipse(sphere.x, sphere.y, sphere.r );
  }
}

function drawOBB() {
  if(pontos.length > 1){
    // variáveis de controle
    let minX = 1000, minY = 1000, maxX = -1000, maxY = -1000;
    pontos.forEach(element => {
      // calcula a projeção desse ponto no vetor que representa o eixo X da OBB
      let prodEscalarX = prodEscalar(element.x, element.y,1, 1);
      // calcula a projeção desse ponto no vetor que representa o eixo Y da OBB
      let prodEscalarY = prodEscalar(element.x, element.y,-1, 1);  
      // testa se os pontos novos possuem valores que excedem os limites estabelecidos, e os define como novos limites             
      if (prodEscalarX < minX){
        minX = prodEscalarX;
      }
      if (prodEscalarX > maxX){
        maxX = prodEscalarX;
      }
      if (prodEscalarY < minY){
        minY = prodEscalarY;
      }
      if (prodEscalarY > maxY){
        maxY = prodEscalarY;
      }   
    });
    OBB.x = (minX + maxX)/2;
    OBB.y = (minY + maxY)/2;
    OBB.w = maxX - minX;
    OBB.h = maxY - minY;     
    // cria um vetor para receber os valores de posição do centro da OBB
    let OBBVector = createVector(OBB.x, OBB.y);
    // rotaciona o vetor para o ângulo da OBB
    OBBVector.rotate(PI/4);
    OBB.x = OBBVector.x;
    OBB.y = OBBVector.y;
    //colisões
    switch(mouseMode){
      case 'AABB':
        // variável de controle
        let isCollide = false;
        // testa se pelo menos um dos 4 vértices da OBB está dentro da AABB
        let axis = {
          x: OBB.x + (OBB.h/2)*Math.cos(PI/4) - (OBB.w/2)*Math.cos(PI/4),
          y: OBB.y - (OBB.h/2)*Math.cos(PI/4) - (OBB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > mouseX - mouseAABB.w/2) && (axis.x < mouseX + mouseAABB.w/2) && (axis.y > mouseY - mouseAABB.h/2) && (axis.y < mouseY + mouseAABB.h/2))
          isCollide = true;
        axis = {
          x: OBB.x - (OBB.h/2)*Math.cos(PI/4) - (OBB.w/2)*Math.cos(PI/4),
          y: OBB.y + (OBB.h/2)*Math.cos(PI/4) - (OBB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > mouseX - mouseAABB.w/2) && (axis.x < mouseX + mouseAABB.w/2) && (axis.y > mouseY - mouseAABB.h/2) && (axis.y < mouseY + mouseAABB.h/2))
          isCollide = true;
        axis = {
          x: OBB.x - (OBB.h/2)*Math.cos(PI/4) + (OBB.w/2)*Math.cos(PI/4),
          y: OBB.y + (OBB.h/2)*Math.cos(PI/4) + (OBB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > mouseX - mouseAABB.w/2) && (axis.x < mouseX + mouseAABB.w/2) && (axis.y > mouseY - mouseAABB.h/2) && (axis.y < mouseY + mouseAABB.h/2))
          isCollide = true;
        axis = {
          x: OBB.x + (OBB.h/2)*Math.cos(PI/4) + (OBB.w/2)*Math.cos(PI/4),
          y: OBB.y - (OBB.h/2)*Math.cos(PI/4) + (OBB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > mouseX - mouseAABB.w/2) && (axis.x < mouseX + mouseAABB.w/2) && (axis.y > mouseY - mouseAABB.h/2) && (axis.y < mouseY + mouseAABB.h/2))
          isCollide = true;
        // criamos dois vetores para receber os valores dos centros
        let mouseAABBVector = createVector(mouseX, mouseY);
        let OBBVector1 = createVector(OBB.x, OBB.y);
        // giramos os vetores para deixarmos o AABB como uma OBB e o OBB como uma AABB
        OBBVector1.rotate(-PI/4);
        mouseAABBVector.rotate(-PI/4);
        // testa se pelo menos um dos 4 vértices da AABB está dentro da OBB
        axis = {
          x: mouseAABBVector.x + (mouseAABB.h/2)*Math.cos(PI/4) - (mouseAABB.w/2)*Math.cos(PI/4),
          y: mouseAABBVector.y - (mouseAABB.h/2)*Math.cos(PI/4) - (mouseAABB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > OBBVector1.x - OBB.w/2) && (axis.x < OBBVector1.x + OBB.w/2) && (axis.y > OBBVector1.y - OBB.h/2) && (axis.y < OBBVector1.y + OBB.h/2))
          isCollide = true;
        axis = {
          x: mouseAABBVector.x - (mouseAABB.h/2)*Math.cos(PI/4) - (mouseAABB.w/2)*Math.cos(PI/4),
          y: mouseAABBVector.y + (mouseAABB.h/2)*Math.cos(PI/4) - (mouseAABB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > OBBVector1.x - OBB.w/2) && (axis.x < OBBVector1.x + OBB.w/2) && (axis.y > OBBVector1.y - OBB.h/2) && (axis.y < OBBVector1.y + OBB.h/2))
          isCollide = true;   
        axis = {
          x: mouseAABBVector.x - (mouseAABB.h/2)*Math.cos(PI/4) + (mouseAABB.w/2)*Math.cos(PI/4),
          y: mouseAABBVector.y + (mouseAABB.h/2)*Math.cos(PI/4) + (mouseAABB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > OBBVector1.x - OBB.w/2) && (axis.x < OBBVector1.x + OBB.w/2) && (axis.y > OBBVector1.y - OBB.h/2) && (axis.y < OBBVector1.y + OBB.h/2))
          isCollide = true;   
        axis = {
          x: mouseAABBVector.x + (mouseAABB.h/2)*Math.cos(PI/4) + (mouseAABB.w/2)*Math.cos(PI/4),
          y: mouseAABBVector.y - (mouseAABB.h/2)*Math.cos(PI/4) + (mouseAABB.w/2)*Math.cos(PI/4)
        }
        if((axis.x > OBBVector1.x - OBB.w/2) && (axis.x < OBBVector1.x + OBB.w/2) && (axis.y > OBBVector1.y - OBB.h/2) && (axis.y < OBBVector1.y + OBB.h/2))
          isCollide = true;    
        if(isCollide){
          fill(100,200,100);
        } else {
          fill(255);
        } 
        break;
      case 'Sphere':
        // passa o valor das coordenadas do mouse para um vetor
        let mouseSphereVector = createVector(mouseX, mouseY);
        // rotaciona o centro do OBB e do vetor do mouse para alinhar a OBB nos eixos X e Y
        let OBBVector2 = createVector(OBB.x, OBB.y);
        OBBVector2.rotate(-PI/4);
        mouseSphereVector.rotate(-PI/4);
        let isCollide2 = false;
        // com esses vetores rotacionados, podemos tratar essa colisão como uma (AABB - Sphere)
        if ((mouseSphereVector.x < OBBVector2.x - OBB.w/2) && (mouseSphereVector.y < OBBVector2.y - OBB.h/2)){ // (posição 1)
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseSphereVector.x, mouseSphereVector.y, OBBVector2.x - OBB.w/2, OBBVector2.y - OBB.h/2))
            // checa a distãncia do raio do círculo com o corner superior esquerdo
            isCollide2 = true;
        } else if ((mouseSphereVector.x > OBBVector2.x + OBB.w/2) && (mouseSphereVector.y < OBBVector2.y - OBB.h/2)){ // (posição 3)
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseSphereVector.x, mouseSphereVector.y, OBBVector2.x + OBB.w/2, OBBVector2.y - OBB.h/2))
            // checa a distãncia do raio do círculo com o corner superior direito
            isCollide2 = true;
        } else if ((mouseSphereVector.x < OBBVector2.x - OBB.w/2) && (mouseSphereVector.y > OBBVector2.y + OBB.h/2)){ // (posição 7)
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseSphereVector.x, mouseSphereVector.y, OBBVector2.x - OBB.w/2, OBBVector2.y + OBB.h/2))
            // checa a distãncia do raio do círculo com o corner inferior esquerdo
            isCollide2 = true;
        } else if ((mouseSphereVector.x > OBBVector2.x + OBB.w/2) && (mouseSphereVector.y > OBBVector2.y + OBB.h/2)){ // (posição 9)
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseSphereVector.x, mouseSphereVector.y, OBBVector2.x + OBB.w/2, OBBVector2.y + OBB.h/2))
            // checa a distãncia do raio do círculo com o corner inferior direito
            isCollide2 = true;
        } else if (((OBBVector2.x - OBB.w/2) < (mouseSphereVector.x + mouseSphere.r/2)) &&
          ((OBBVector2.x + OBB.w/2) > (mouseSphereVector.x - mouseSphere.r/2)) &&
          ((OBBVector2.y - OBB.h/2) < (mouseSphereVector.y + mouseSphere.r/2)) &&
          ((OBBVector2.y + OBB.h/2) > (mouseSphereVector.y - mouseSphere.r/2))){
            // caso esteja nas posições 2, 4, 5, 6 ou 8, o teste AABB com AABB funciona perfeitamente
            isCollide2 = true;
        }
        if(isCollide2){
          fill(100,200,100);
        } else {
          fill(255);
        } 
        break;
      case 'OBB':
        // passa o valor das coordenadas do mouse para um vetor, e o centro da OBB para outro vetor
        let OBBVector3 = createVector(OBB.x, OBB.y);
        let mouseOBBVector = createVector(mouseX, mouseY);
        OBBVector3.rotate(-PI/4);
        mouseOBBVector.rotate(-PI/4);
        if(((OBBVector3.x - OBB.w/2) < (mouseOBBVector.x + mouseOBB.w/2)) &&
           ((OBBVector3.x + OBB.w/2) > (mouseOBBVector.x - mouseOBB.w/2)) &&
           ((OBBVector3.y - OBB.h/2) < (mouseOBBVector.y + mouseOBB.h/2)) &&
           ((OBBVector3.y + OBB.h/2) > (mouseOBBVector.y - mouseOBB.h/2))){
          fill(100,200,100);
          } else {
            fill(255);
          }
        break;
    }
    strokeWeight(1);
    stroke('green');
    // desenha a OBB, definindo cada vértice
    quad(OBB.x + (OBB.h/2)*Math.cos(PI/4) - (OBB.w/2)*Math.cos(PI/4),
         OBB.y - (OBB.h/2)*Math.cos(PI/4) - (OBB.w/2)*Math.cos(PI/4),
         OBB.x - (OBB.h/2)*Math.cos(PI/4) - (OBB.w/2)*Math.cos(PI/4),
         OBB.y + (OBB.h/2)*Math.cos(PI/4) - (OBB.w/2)*Math.cos(PI/4),
         OBB.x - (OBB.h/2)*Math.cos(PI/4) + (OBB.w/2)*Math.cos(PI/4),
         OBB.y + (OBB.h/2)*Math.cos(PI/4) + (OBB.w/2)*Math.cos(PI/4),
         OBB.x + (OBB.h/2)*Math.cos(PI/4) + (OBB.w/2)*Math.cos(PI/4),
         OBB.y - (OBB.h/2)*Math.cos(PI/4) + (OBB.w/2)*Math.cos(PI/4))
  }
}

function drawMouseAABB(){
  rectMode(CENTER);
  stroke('black');
  fill(255);
  strokeWeight(1);
  // desenha o retângulo em volta do mouse
  rect(mouseX,mouseY,mouseAABB.w, mouseAABB.h);
};

function drawMouseSphere(){
  ellipseMode(CENTER);
  stroke('black');
  fill(255);
  strokeWeight(1);
  // desenha a esfera em volta do mouse
  ellipse(mouseX,mouseY,mouseSphere.r);
}

function drawMouseOBB(){
  stroke('black');
  fill(255);
  strokeWeight(1);
  // desenha a OBB em volta do mouse, definindo cada vértice
  quad(mouseX + (mouseOBB.h/2)*Math.cos(PI/4) - (mouseOBB.w/2)*Math.cos(PI/4),
       mouseY - (mouseOBB.h/2)*Math.cos(PI/4) - (mouseOBB.w/2)*Math.cos(PI/4),
       mouseX - (mouseOBB.h/2)*Math.cos(PI/4) - (mouseOBB.w/2)*Math.cos(PI/4),
       mouseY + (mouseOBB.h/2)*Math.cos(PI/4) - (mouseOBB.w/2)*Math.cos(PI/4),
       mouseX - (mouseOBB.h/2)*Math.cos(PI/4) + (mouseOBB.w/2)*Math.cos(PI/4),
       mouseY + (mouseOBB.h/2)*Math.cos(PI/4) + (mouseOBB.w/2)*Math.cos(PI/4),
       mouseX + (mouseOBB.h/2)*Math.cos(PI/4) + (mouseOBB.w/2)*Math.cos(PI/4),
       mouseY - (mouseOBB.h/2)*Math.cos(PI/4) + (mouseOBB.w/2)*Math.cos(PI/4))
}

function drawHud(){
  // desenha a hud da aplicação
  stroke(0);
  fill(0);
  strokeWeight(1);
  textSize(14);
  text("Modo de mouse: " + mouseMode, 10, 20);
  text("Modo do grupo de pontos: " + pointsMode, 10, 40);
  text("Aperte 'M' para mudar o modo do mouse, 'G' para mudar o modo do conjunto e 'R' para apagar todos os pontos.", 10, 700);
}

function keyReleased(){
  if(keyCode == 71){
    // troca o tipo de volume envoltório de pontos
    switch(pointsMode){
      case "AABB":
        pointsMode = "Sphere";
        break;
      case "Sphere":
        pointsMode = "OBB";
        break;
      case "OBB":
        pointsMode = "AABB";
        break;
    }
  } else if (keyCode == 77){
    // troca o tipo de volume em volta do mouse
    switch(mouseMode){
      case "AABB":
        mouseMode = "Sphere";
        break;
      case "Sphere":
        mouseMode = "OBB";
        break;
      case "OBB":
        mouseMode = "AABB";
        break;
    }
  } else if (keyCode == 82){
    pontos = [];
  }
};

// função que calcula o produto escalar de dois vetores, o primeiro representando um ponto, e o segundo, um vetor que se deseja projetar o ponto
function prodEscalar(vecAX, vecAY, vecBX, vecBY){
  // tiramos a norma do vetor
  let norm = Math.sqrt(vecBX*vecBX + vecBY);
  // normalizamos o vetor
  vecBX = vecBX/norm;
  vecBY = vecBY/norm;
  return (vecAX * vecBX) + (vecAY * vecBY);
}