import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
const base = 'https://w-cn.github.io/Treino/';
const queue = ['index.html', 'src/app.js', 'src/styles/main.css'];
const files = new Map();
while(queue.length){
  const path=queue.shift();if(files.has(path))continue;
  const response=await fetch(new URL(path,base));
  if(!response.ok)throw new Error(path+': '+response.status);
  const content=await response.text();files.set(path,content);
  if(path.endsWith('.js'))for(const match of content.matchAll(/(?:from\s*|import\s*\(?\s*)['"](\.[^'"]+\.js)['"]/g)){
    const dependency=new URL(match[1],new URL(path,base)).pathname.slice('/Treino/'.length);
    if(!dependency.startsWith('src/'))throw new Error('Unexpected dependency');queue.push(dependency);
  }
}
for(const [path,content] of files){
  const snapshot='research/published-baseline/'+path;
  await mkdir(dirname(snapshot),{recursive:true});await writeFile(snapshot,content);
  const before=await readFile(path,'utf8').catch(()=>null);
  if(before?.replaceAll('\r\n','\n')!==content.replaceAll('\r\n','\n')){
    await mkdir(dirname(path),{recursive:true});await writeFile(path,content);console.log('Base publicada: '+path);
  }
}
