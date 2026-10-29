import assert from 'node:assert/strict';
import {GameModel} from '../dist/js/refine-core.js';
import {cafePlateStatus,DENTAL_TASKS} from '../dist/js/care-art.js';
import {cafePanelHTML,cafePlateHTML} from '../dist/js/cafe-controls.js';
import {DENTAL_TOOLS} from '../dist/js/dentist-core.js';
import {solvePatient} from './touch-solutions.mjs';
for(let difficulty=1;difficulty<=5;difficulty++)for(const learn of [false,true]){const m=new GameModel({game:'cafe',difficulty,learn,seed:47});for(const recipe of [...m.recipeDeck,m.orders[0].recipe]){m.orders=[{id:1,recipe,at:0,patience:42000,sequence:true}];m.orderIndex=0;m.plate=[];assert.match(cafePlateStatus(m),/Start/);m.plate=[...recipe.items,'hot'];assert.match(cafePlateStatus(m),/Extra/);m.plate=[...recipe.items].reverse();if(m.plate.join('|')!==recipe.items.join('|'))assert.match(cafePlateStatus(m),/numbered/);m.plate=[...recipe.items];assert.match(cafePlateStatus(m),/Ready/);assert.ok(cafePlateHTML(m,'Test').includes('role="status"'));assert.ok(cafePanelHTML(m,learn).includes('role="progressbar"'));assert.equal(m.serve(),true);}}
for(const task of Object.values(DENTAL_TASKS))assert.ok(DENTAL_TOOLS.some(tool=>tool.id===task.tool));
for(let difficulty=1;difficulty<=5;difficulty++)for(let patient=1;patient<=7;patient++){const m=solvePatient(patient,difficulty);assert.ok(m.complete);assert.equal(m.mistakes,0);}
console.log('PASS: every unlocked recipe across 10 difficulty/learning configurations keeps legal serving, exact quantity/extra/sequence guidance, accessible patience/status; all seven patients across five difficulties complete with legal treatment gestures and unchanged rules.');
