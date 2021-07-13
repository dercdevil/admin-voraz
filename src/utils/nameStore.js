export const nameStore = (stores, id) => {
    const resultado = stores.find( item => item.profile.id.toString() === id.toString() );
    return resultado;
    
};
  