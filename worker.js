'use strict';
importScripts('game-data.js', 'engine.js');

onmessage = async ({data}) => {
  const {id, config} = data;
  try {
    const result = await M.optimize(config, text => postMessage({id, type:'progress', text}));
    postMessage({id, type:'result', result});
  } catch (error) {
    postMessage({id, type:'error', message:error.message});
  }
};
