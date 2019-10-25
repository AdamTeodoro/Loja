import { Produto } from './Produto';

export interface Carrinho{
    qtdProduto?:number,
    precoTotal?:number,
    produtos?:Array<Produto>;
}