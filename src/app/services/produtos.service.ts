import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Produto } from '../interfaces/Produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  
  constructor(private fireStore:AngularFirestore) { }

  async buscarProdutos(produtos:Array<Produto>){
    try{
      await this.fireStore.firestore.
        collection('Produtos').
          where('categoria','==', 'Dispositivo móvel').get().then(data=>{
            for(let i = 0; i < data.size.valueOf(); i++){
              produtos.push(data.docs[i].data());
            }
          });
    }catch(error){
      console.log(error);
    }
  }
}
