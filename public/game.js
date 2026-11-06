import * as THREE from 'three';

const $ = id => document.getElementById(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x91b7d2);
scene.fog = new THREE.Fog(0x91b7d2, 90, 260);
const camera = new THREE.PerspectiveCamera(65, innerWidth/innerHeight, .1, 500);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xddeeff,0x5b4937,2));
const sun=new THREE.DirectionalLight(0xfff0d5,2.3); sun.position.set(-40,80,30); sun.castShadow=true; scene.add(sun);
const mat=(c,rough=.8)=>new THREE.MeshStandardMaterial({color:c,roughness:rough});
const mats={ground:mat(0x66865b),road:mat(0x343b45),stone:mat(0x858b8e),red:mat(0xc62828),black:mat(0x151923),gold:mat(0xe6b84b),skin:mat(0xffc58d),blue:mat(0x2366b2),teal:mat(0x159c91),white:mat(0xe8e8e8),wood:mat(0x76502f),roof:mat(0x9e2929),purple:mat(0x55317d)};
function box(parent,x,y,z,sx,sy,sz,material){let m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cylinder(parent,x,y,z,r1,r2,h,material,seg=12){let m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg),material);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
const ground=box(scene,0,-1.2,0,420,1,420,mats.ground);
const world=[];
function road(x,z,w,d){box(scene,x,-.65,z,w,.12,d,mats.road);world.push({x,z,w,d})}
road(0,0,15,300);road(0,0,300,15);road(-65,0,12,180);road(65,0,12,180);road(0,-65,180,12);road(0,65,180,12);
function building(x,z,w,h,d,color,roof=true){let g=new THREE.Group();g.position.set(x,0,z);scene.add(g);box(g,0,h/2,0,w,h,d,mat(color));if(roof){let r=cylinder(g,0,h+.4,0,w*.68,w*.68,1.2,mats.roof,4);r.rotation.y=Math.PI/4;}for(let yy=1.5;yy<h-1;yy+=2.5)for(let xx=-w/2+1.3;xx<w/2-1;xx+=2.5){box(g,xx,yy,d/2+.02,.8,1.1,.08,mat(0xf6d68b));}return g}
function pagoda(x,z,scale=1){let g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);box(g,0,2,0,12,4,10,mats.wood);for(let i=0;i<3;i++){let roof=cylinder(g,0,4.5+i*2,0,9-i*2,9-i*2,1,mats.red,4);roof.rotation.y=Math.PI/4;}cylinder(g,0,9,0,.35,.35,4,mats.gold);return g}
function tree(x,z){cylinder(scene,x,.4,z,.45,.6,1.5,mats.wood);let crown=new THREE.Mesh(new THREE.ConeGeometry(2.3,6,7),mat(0x285b3c));crown.position.set(x,4,z);crown.castShadow=true;scene.add(crown)}
// districts and recognizable fan-world destinations
pagoda(-42,-42,1.25); // monastery
for(let x=-95;x<=95;x+=24)for(let z=-95;z<=95;z+=26){if(Math.abs(x)<15||Math.abs(z)<15)continue;building(x,z,12,8+Math.random()*17,12,[0x9b7b64,0x687d8a,0x9b9b87,0x795f7d][Math.floor(Math.random()*4)]);}
for(let i=0;i<70;i++){let x=(Math.random()-.5)*360,z=(Math.random()-.5)*360;if(Math.abs(x)<17||Math.abs(z)<17)continue;tree(x,z)}
// landmark labels
const places=[
{name:'SPINJITZU MONASTERY',x:-42,z:-42,desc:'Sensei Wu’s training ground'},
{name:'JAMANAKAI VILLAGE',x:-115,z:35,desc:'A quiet village at the edge of the city'},
{name:'NINJAGO CITY',x:0,z:0,desc:'The busy heart of Ninjago'},
{name:'IGNACIA',x:115,z:-55,desc:'The home of the Elemental Masters of Fire'},
{name:'BOUNTY DOCKS',x:90,z:95,desc:'Harbor district and airship landing'},
{name:'OLD TOWN',x:-105,z:-100,desc:'Historic streets and market'},
{name:'SERPENTINE RUINS',x:125,z:115,desc:'Ancient ruins beyond the city'}
];
function marker(p){let g=new THREE.Group();g.position.set(p.x,0,p.z);scene.add(g);cylinder(g,0,1.3,0,1.3,1.3,2.6,mats.gold);let orb=new THREE.Mesh(new THREE.SphereGeometry(1.1,12,12),mat(0xffe28a));orb.position.y=3;g.add(orb);p.marker=g}
places.forEach(marker);
// Kai minifigure-style rig
function makeNinja(name,color,x,z,isPlayer=false){let root=new THREE.Group();root.position.set(x,0,z);scene.add(root);let torso=box(root,0,2.15,0,1.25,1.45,.72,mat(color));let belt=box(root,0,1.65,.02,1.28,.22,.76,mats.black);let head=cylinder(root,0,3.25,0,.48,.48,.72,mats.skin,16);head.rotation.x=Math.PI/2;let hood=cylinder(root,0,3.65,0,.56,.56,.38,mat(color),12);hood.rotation.x=Math.PI/2;let mask=box(root,0,3.18,.43,.75,.28,.12,mat(color));let eye1=box(root,-.16,3.28,.51,.12,.07,.04,mats.white),eye2=box(root,.16,3.28,.51,.12,.07,.04,mats.white);let legs=[];for(let s of [-1,1]){let leg=box(root,s*.32,.75,0,.48,1.25,.55,mats.black);legs.push(leg);let arm=box(root,s*.83,2.25,0,.35,1.1,.4,mat(color));arm.rotation.z=s*.12;}let scarf=box(root,0,2.75,-.43,1.05,.18,.2,mat(color));let sword=box(root,.95,1.8,.4,.13,1.5,.16,mats.gold);sword.rotation.z=-.3;root.userData={name,torso,head,mask,hood,legs,sword,isPlayer,baseY:0};return root}
const player=makeNinja('Kai',0xb51f25,-42,-25,true);
const npcs=[
 makeNinja('Sensei Wu',0xd7c7a0,-35,-42),
 makeNinja('Nya',0x167e89,-25,-40),
 makeNinja('Jay',0x286bb2,-32,-34),
 makeNinja('Cole',0x262a32,-50,-34),
 makeNinja('Zane',0xb9c6ce,-54,-42),
 makeNinja('Lloyd',0x32934f,-45,-48)
];
const names=['Sensei Wu','Nya','Jay','Cole','Zane','Lloyd'];
let keys={},joy={x:0,y:0},yaw=0,camPitch=.28,velY=0,onGround=true,spinning=0,attackTime=0,mode='story',missionIndex=0,cutActive=false,unmasked=false;
const missions=[
['PILOT • CHAPTER 1','The First Spinjitzu Lesson','Find Sensei Wu at the monastery.','Sensei Wu','A new path begins. Train your focus, Kai.'],
['PILOT • CHAPTER 2','The Golden Weapons','Speak with Wu about the four Golden Weapons.','Sensei Wu','The weapons are scattered. Your team must find them before the wrong hands do.'],
['PILOT • CHAPTER 3','A Dangerous Rescue','Meet Nya near the village road.','Nya','Nya has a lead. Follow it and keep the village safe.'],
['SEASON 1 • RISE OF THE SNAKES','Trouble Beneath the Streets','Reach the Serpentine ruins.','Serpentine Ruins','Something ancient is stirring below Ninjago. Stay alert.'],
['SEASON 2 • LEGACY OF THE GREEN NINJA','The Final Test','Return to the monastery and speak to Wu.','Sensei Wu','Courage is more than strength. The next test is yours.'],
['SEASON 3 • REBOOTED','City Under Threat','Go to Ninjago City’s central avenue.','Ninjago City','The city is changing fast. Protect its people.'],
['SEASON 4 • TOURNAMENT OF ELEMENTS','The Island Invitation','Travel to the docks and meet the team.','Bounty Docks','A tournament invitation has arrived. The team must decide what it means.'],
['SEASON 5 • POSSESSION','A Strange Presence','Find the old town shrine.','Old Town','An unfamiliar force is moving through the city.'],
['SEASON 6 • SKYBOUND','The Sky Pirates','Investigate the Bounty Docks.','Bounty Docks','The skies are no longer safe. Keep your eyes above the rooftops.'],
['SEASON 7 • HANDS OF TIME','Echoes of the Past','Return to the monastery.','Sensei Wu','The past has a way of catching up with everyone.'],
['SEASON 8 • SONS OF GARMADON','Shadows in the City','Patrol Ninjago City.','Ninjago City','A new gang is making its presence known.'],
['SEASON 9 • HUNTED','Beyond the Walls','Reach Jamanakai Village.','Jamanakai Village','The team is scattered. Find a safe route through the outskirts.'],
['SEASON 10 • MARCH OF THE ONI','The Dark Front','Meet the ninja at the monastery.','Sensei Wu','A dark threat approaches. Stand together.'],
['SEASON 11 • SECRETS OF THE FORBIDDEN SPINJITZU','The Forbidden Scroll','Search the old town.','Old Town','Power without wisdom can become a danger.'],
['SEASON 12 • PRIME EMPIRE','A Digital Mystery','Reach the city center.','Ninjago City','A strange game-world signal is spreading.'],
['SEASON 13 • MASTER OF THE MOUNTAIN','The Mountain Signal','Travel to the Serpentine ruins.','Serpentine Ruins','An old signal points toward a hidden realm.'],
['SEASON 14 • THE ISLAND','The Island Expedition','Meet the team at the docks.','Bounty Docks','An expedition is ready. Check your gear.'],
['SEASON 15 • SEABOUND','The Call of the Sea','Go to the docks and speak with Nya.','Nya','The ocean is calling. This chapter closes one journey and opens another.']
];
function toast(t){$('toast').textContent=t;$('toast').style.opacity=1;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').style.opacity=0,2100)}
function showMission(){let m=missions[missionIndex];$('chapter').textContent=m[0];$('missionTitle').textContent=m[1];$('missionText').textContent=m[2]}
function startCut(text,after){cutActive=true;$('cutText').textContent=text;$('cutscene').classList.remove('hidden');$('skipCut').onclick=()=>{ $('cutscene').classList.add('hidden');cutActive=false;after?.()}}
function completeMission(){let m=missions[missionIndex];startCut(m[4],()=>{missionIndex=(missionIndex+1)%missions.length;showMission();toast('MISSION COMPLETE • '+m[1])})}
showMission();
function targetPlace(){let m=missions[missionIndex],p=places.find(x=>x.name.toLowerCase()===m[3].toLowerCase());if(m[3]==='Nya')return npcs[1].position;return p?new THREE.Vector3(p.x,0,p.z):npcs[0].position}
function interact(){if(mode==='sandbox'){let near=npcs.find(n=>n.position.distanceTo(player.position)<7);if(near){toast(near.userData.name+': '+(near.userData.name==='Sensei Wu'?'Stay sharp, young ninja.': 'Ready when you are.'));return}if(!unmasked){unmasked=true;player.userData.hood.visible=false;player.userData.mask.visible=false;toast('Kai unmasked');}else{unmasked=false;player.userData.hood.visible=true;player.userData.mask.visible=true;toast('Kai masked');}return}
let dest=targetPlace();if(player.position.distanceTo(dest)<13){completeMission()}else{let near=npcs.find(n=>n.position.distanceTo(player.position)<7);if(near){toast(near.userData.name+': '+(near.userData.name==='Sensei Wu'?'Your mission awaits.':'Let’s keep moving!'))}else toast('Get closer to the mission marker.');}}
function setMode(){mode=mode==='story'?'sandbox':'story';$('mode').textContent=mode.toUpperCase()+' MODE';$('modeBtn').textContent=mode==='story'?'SANDBOX':'STORY';$('missionText').textContent=mode==='story'?missions[missionIndex][2]:'Explore freely. Talk to the ninja, train, and discover the city.';toast(mode==='sandbox'?'SANDBOX ENABLED • Explore freely':'STORY MODE ENABLED')}
$('modeBtn').onclick=setMode;$('mapBtn').onclick=()=>{$('mapPanel').classList.remove('hidden');$('mapList').innerHTML=places.map(p=>`<div><b>${p.name}</b><br>${p.desc}</div>`).join('')};$('closeMap').onclick=()=>$('mapPanel').classList.add('hidden');
function spin(){spinning=1.5;toast('SPINJITZU!')}
function attack(){attackTime=.35;player.userData.sword.visible=true;toast('KAI • FLAME STRIKE')}
function jump(){if(onGround){velY=9;onGround=false}}
$('spin').onclick=spin;$('attack').onclick=attack;$('jump').onclick=jump;$('interact').onclick=interact;
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key===' ')jump();if(e.key.toLowerCase()==='k')spin();if(e.key.toLowerCase()==='j')attack();if(e.key.toLowerCase()==='e')interact();if(e.key.toLowerCase()==='m')$('mapBtn').click();if(e.key.toLowerCase()==='b')setMode()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let dragging=false,lastX=0;renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dragging=true;lastX=e.clientX}});addEventListener('pointerup',()=>dragging=false);addEventListener('pointermove',e=>{if(dragging){yaw-=(e.clientX-lastX)*.006;lastX=e.clientX}});
const stick=$('stick'),nub=$('nub');let stickId=null;stick.addEventListener('pointerdown',e=>{stickId=e.pointerId;stick.setPointerCapture(stickId);moveStick(e)});stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId)moveStick(e)});function moveStick(e){let r=stick.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy),max=38;if(len>max){dx=dx/len*max;dy=dy/len*max}nub.style.transform=`translate(${dx}px,${dy}px)`;joy.x=dx/max;joy.y=dy/max}function resetStick(){stickId=null;joy={x:0,y:0};nub.style.transform=''}stick.addEventListener('pointerup',resetStick);stick.addEventListener('pointercancel',resetStick);
function update(dt){if(cutActive)return;let forward=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-joy.y;let side=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x;let v=new THREE.Vector3(side,0,forward);if(v.length()>1)v.normalize();let speed=spinning?15:7;let ang=yaw;let dx=v.x*Math.cos(ang)+v.z*Math.sin(ang),dz=v.z*Math.cos(ang)-v.x*Math.sin(ang);player.position.x+=dx*speed*dt;player.position.z+=dz*speed*dt;player.position.x=THREE.MathUtils.clamp(player.position.x,-185,185);player.position.z=THREE.MathUtils.clamp(player.position.z,-185,185);if(v.length()>.05)player.rotation.y=Math.atan2(dx,dz);velY-=22*dt;player.position.y+=velY*dt;if(player.position.y<=0){player.position.y=0;velY=0;onGround=true}player.rotation.y+=spinning?dt*18:0;player.scale.setScalar(spinning?1+Math.sin(performance.now()*.025)*.08:1);if(spinning>0)spinning-=dt;if(attackTime>0){attackTime-=dt;player.userData.sword.rotation.x=Math.sin((.35-attackTime)*20)*1.1}else player.userData.sword.rotation.x=0;
npcs.forEach((n,i)=>{n.position.y=0;n.rotation.y+=Math.sin(performance.now()*.001+i)*.0007});
let camTarget=player.position.clone().add(new THREE.Vector3(0,2.2,0));let behind=new THREE.Vector3(Math.sin(yaw)*10,5.2,Math.cos(yaw)*10);camera.position.lerp(camTarget.clone().add(behind),1-Math.pow(.001,dt));camera.lookAt(camTarget);
let dest=targetPlace();places.forEach(p=>{p.marker.position.y=1+Math.sin(performance.now()*.003)*.25});if(mode==='story'){$('location').textContent=nearestPlace().name;let dist=player.position.distanceTo(dest);if(dist<10)$('missionText').textContent='Press ACTION / E to continue.';}
}
function nearestPlace(){return places.reduce((a,b)=>Math.hypot(player.position.x-a.x,player.position.z-a.z)<Math.hypot(player.position.x-b.x,player.position.z-b.z)?a:b)}
let prev=performance.now();function loop(now){let dt=Math.min((now-prev)/1000,.04);prev=now;update(dt);renderer.render(scene,camera);requestAnimationFrame(loop)}requestAnimationFrame(loop);
startCut('The city of Ninjago is full of mysteries. Kai is beginning his journey as a ninja. Find Sensei Wu and discover what it means to protect the people.',()=>{});
$('loading').style.display='none';
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
