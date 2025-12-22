import storeConfig from '../store/index'

export default function kek({ app}){
   let st = storeConfig;
   app.use(st);
}
