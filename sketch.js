let pontos = [];
let AABB, mouseAABB, sphere, mouseSphere, OBB;
let pointsMode = 'OBB';
let mouseMode = 'AABB';
function setup(){
  createCanvas(720,720);
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
  mouseAABB = {
    w: 100,
    h: 100
  },
  mouseSphere = {
    r: 100
  }
};

function draw(){
  background(200);
  switch(mouseMode){
    case 'AABB':
      drawMouseAABB();
      break;
    case 'Sphere':
      drawMouseSphere();
      break;
  }
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
  drawPoints();  
  drawHud();
};

function mouseClicked(){
  let point = {
    x: mouseX,
    y: mouseY
  }
  pontos.push(point);  
};

function drawPoints(){  
  strokeWeight(5);   
  pontos.forEach(element => {
    stroke('purple');
    point(element.x , element.y);    
  });
};

function drawAABB(){
  rectMode(CENTER);
  if(pontos.length > 1){
    let minX, minY, maxX, maxY, firstElement = true;
    pontos.forEach(element => {
      if(firstElement){
        minX = element.x;
        minY = element.y;
        maxX = element.x;
        maxY = element.y;
        firstElement = false;
      } else {
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
    AABB.x = (minX + maxX)/2;
    AABB.y = (minY + maxY)/2;
    AABB.w = maxX - minX;
    AABB.h = maxY - minY;
    stroke('red');
    //colisões
    switch(mouseMode){
      case 'AABB':
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
        let isCollide = false;
        if ((mouseX < AABB.x - AABB.w/2) && (mouseY < AABB.y - AABB.h/2)){
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseX, mouseY, AABB.x - AABB.w/2, AABB.y - AABB.h/2))
            isCollide = true;
        } else if ((mouseX > AABB.x + AABB.w/2) && (mouseY < AABB.y - AABB.h/2)){
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseX, mouseY, AABB.x + AABB.w/2, AABB.y - AABB.h/2))
            isCollide = true;
        } else if ((mouseX < AABB.x - AABB.w/2) && (mouseY > AABB.y + AABB.h/2)){
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseX, mouseY, AABB.x - AABB.w/2, AABB.y + AABB.h/2))
            isCollide = true;
        } else if ((mouseX > AABB.x + AABB.w/2) && (mouseY > AABB.y + AABB.h/2)){
          if((mouseSphere.r*mouseSphere.r)/4 > dist_2(mouseX, mouseY, AABB.x + AABB.w/2, AABB.y + AABB.h/2))
            isCollide = true;
        } else if (((AABB.x - AABB.w/2) < (mouseX + mouseSphere.r/2)) &&
          ((AABB.x + AABB.w/2) > (mouseX - mouseSphere.r/2)) &&
          ((AABB.y - AABB.h/2) < (mouseY + mouseSphere.r/2)) &&
          ((AABB.y + AABB.h/2) > (mouseY - mouseSphere.r/2))){
            isCollide = true;
        }
        if(isCollide){
          fill(200,100,100);
        } else {
          fill(255);
        }        
    }
    strokeWeight(1);  
    rect(AABB.x ,AABB.y ,AABB.w ,AABB.h );
  }
};

function dist_2(x1, y1, x2, y2){
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
    let minX, minY, maxX, maxY, firstElement = true, r = 0;
    pontos.forEach(element => {      
      if(firstElement){
        minX = element.x;
        minY = element.y;
        maxX = element.x;
        maxY = element.y;
        firstElement = false;
      } else {
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
          let isCollide = false;
          if ((sphere.x < mouseX - mouseAABB.w/2) && (sphere.y < mouseY - mouseAABB.h/2)){
            if((sphere.r*sphere.r)/4 > dist_2(sphere.x, sphere.y, mouseX - mouseAABB.w/2, mouseY - mouseAABB.h/2))
              isCollide = true;
          } else if ((sphere.x > mouseX + mouseAABB.w/2) && (sphere.y < mouseY - mouseAABB.h/2)){
            if((sphere.r*sphere.r)/4 > dist_2(sphere.x, sphere.y, mouseX + mouseAABB.w/2, mouseY - mouseAABB.h/2))
              isCollide = true;
          } else if ((sphere.x < mouseX - mouseAABB.w/2) && (sphere.y > mouseY + mouseAABB.h/2)){
            if((sphere.r*sphere.r)/4 > dist_2(sphere.x, sphere.y, mouseX - mouseAABB.w/2, mouseY + mouseAABB.h/2))
              isCollide = true;
          } else if ((sphere.x > mouseX + mouseAABB.w/2) && (sphere.y > mouseY + mouseAABB.h/2)){
            if((sphere.r*sphere.r)/4 > dist_2(sphere.x, sphere.y, mouseX + mouseAABB.w/2, mouseY + mouseAABB.h/2))
              isCollide = true;
          } else if (((mouseX - mouseAABB.w/2) < (sphere.x + sphere.r/2)) &&
            ((mouseX + mouseAABB.w/2) > (sphere.x - sphere.r/2)) &&
            ((mouseY - mouseAABB.h/2) < (sphere.y + sphere.r/2)) &&
            ((mouseY + mouseAABB.h/2) > (sphere.y - sphere.r/2))){
              isCollide = true;
          }
          if(isCollide){
            fill(100,100,200);
          } else {
            fill(255);
          }        
        break;
      case 'Sphere':
        if(dist_2(sphere.x, sphere.y, mouseX, mouseY) < ((sphere.r/2) + (mouseSphere.r/2))*((sphere.r/2) + (mouseSphere.r/2))){
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
    let minX = 1000, minY = 1000, maxX = -1000, maxY = -1000;
    pontos.forEach(element => {
      let prodEscalarX = prodEscalar(element.x, element.y,0.7071, 0.7071);
      let prodEscalarY = prodEscalar(element.x, element.y,-0.7071, 0.7071);              
      //console.log(prodEscalarY);
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
    let OBBVector = createVector(OBB.x, OBB.y);
    OBBVector.rotate(PI/4);
    OBB.x = OBBVector.x;
    OBB.y = OBBVector.y;
    strokeWeight(10);
    point(OBB.x, OBB.y);
    strokeWeight(1);
    stroke('green');
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
  rect(mouseX,mouseY,mouseAABB.w, mouseAABB.h);
};

function drawMouseSphere(){
  ellipseMode(CENTER);
  stroke('black');
  fill(255);
  strokeWeight(1);
  ellipse(mouseX,mouseY,mouseSphere.r);
}

function drawHud(){
  stroke(0);
  fill(0);
  strokeWeight(1);
  text("Modo de mouse: " + mouseMode, 20, 20);
  text("Modo do grupo de pontos: " + pointsMode, 20, 40);
  text("Aperte 'M' para mudar o modo do mouse e 'G' para mudar o modo do conjunto", 20, 700);
}

function keyReleased(){
  if(keyCode == 71){
    switch(pointsMode){
      case "AABB":
        pointsMode = "Sphere";
        break;
      case "Sphere":
        pointsMode = "AABB";
        break;
    }
  } else if (keyCode == 77){
    switch(mouseMode){
      case "AABB":
        mouseMode = "Sphere";
        break;
      case "Sphere":
        mouseMode = "AABB";
        break;
    }
  }
};

function prodEscalar(vecAX, vecAY, vecBX, vecBY){
  return (vecAX * vecBX) + (vecAY * vecBY);
}