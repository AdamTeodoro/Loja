import { Component, OnInit} from '@angular/core';

import { Produto } from 'src/app/interfaces/Produto';

import { ProdutosService } from 'src/app/services/produtos.service';
import { Carrinho } from 'src/app/interfaces/Carrinho';
import { Comprador } from 'src/app/interfaces/Comprador';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Endereco } from 'src/app/interfaces/Endereco';
import { Cartao } from 'src/app/interfaces/Cartao';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  //
  public telefone = ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,/[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  public cep = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,/[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/];
  public cpf = [/[0-9]/, /[0-9]/, /[0-9]/,'.',/[0-9]/, /[0-9]/, /[0-9]/,'.',/[0-9]/, /[0-9]/, /[0-9]/,'-',/[0-9]/, /[0-9]/];
  public numCartao = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  public diaMes = [/[0-3]/, /[0-9]/, '/',/[0-9]/, /[0-9]/];
  public CVC = [/[0-3]/, /[0-9]/, /[0-9]/];

  private carrinho:Carrinho={};

  public produto:Produto={};
  public produtoA:Produto={};
  public produtoB:Produto={};
  

  public produtos = new Array<Produto>();
  public resultados = new Array<Produto>();

  public tipoPagamento:string;
  public pesquisa:string;

  public menu:number = 1;
  public posicao:number = 1;

  public pagamentoIniciado:boolean = false;
  public adicionado:boolean = false;
  public pagamentoFinalizado:boolean = false;
  public buscou:boolean = false;
  public avancarSlide:boolean = false;
  public voltarSlide:boolean = false;


  public formGroupComprador:FormGroup;
  public formGroupPagamento:FormGroup;

  public comprador:Comprador={};

  public endereco:Endereco={};

  public cartao:Cartao={};
  
  constructor(
    private produtoService:ProdutosService,
      private formBuilder:FormBuilder) {
    this.buscarProdutos();
    this.iniciaCarrinho();
    console.log(this.produtos);

    this.formGroupComprador = this.formBuilder.group({
      'nome':[this.comprador.nome, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])],

      'telefone':[this.comprador.telefone,Validators.compose([
        Validators.required,
        Validators.pattern(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/)
      ])],

      'cpf':[this.comprador.cpf,Validators.compose([
        Validators.required,
        Validators.pattern(/^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2})|([0-9]{11}))$/)
      ])],

      'email':[this.comprador.email, Validators.compose([
        Validators.pattern(/^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/),
        Validators.required,
      ])],

      'cep':[this.endereco.cep,Validators.compose([
        Validators.pattern(/^[0-9]{5}-[\d]{3}$/),
        Validators.required
      ])],

      'bairro':[this.endereco.bairro,Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.required
      ])],

      'rua':[this.endereco.rua, Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.required
      ])],

      'numero':[this.endereco.numero,Validators.compose([
        Validators.required,
        Validators.pattern(/^.{1,70000}$/)
      ])],
    });

    this.formGroupPagamento = this.formBuilder.group({
      'tipoPagamento':[this.tipoPagamento, Validators.compose([
        Validators.required
      ])],

      'numeroCartao':[this.cartao.numeroCartao, Validators.compose([
        Validators.minLength(19),
        Validators.maxLength(19),
        Validators.required,
      ])],

      'codigoSeguranca':[this.cartao.codigoSeguranca, Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.required,
      ])],

      'nomeCartao':[this.cartao.nomeCartao, Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(25),
        Validators.required,
      ])],

      'dataValidade':[this.cartao.dataValidade, Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.required,
      ])],
    });
  }

  abreMenu(inicio){
    this.menu = inicio;
  }

  async avancar(){
    if(this.posicao < 3){
      this.posicao = this.posicao + 1;
    }
  }

  voltar(){
    if(this.posicao > 1){
      this.posicao = this.posicao -1;
    }
  }



  msg(){
    this.adicionado = true;
    let msgTime = setTimeout(()=>{
      this.adicionado = false;
    },3000);
  }

  async addCarrinho(idP:string){
    for(let i = 0; i < this.produtos.length; i++){
      if(this.produtos[i].idP == idP){
        this.carrinho.qtdProduto++;
        this.carrinho.precoTotal = this.carrinho.precoTotal + this.produtos[i].valor;
        this.carrinho.produtos = this.carrinho.produtos || [];
        this.carrinho.produtos.push(this.produtos.slice(i,i+1).shift());
        this.msg()
      }
    }
  }
  
  async buscarProdutos(){
    await this.produtoService.buscarProdutos(this.produtos);
    this.iniciaProdutos();
  }

  iniciaProdutos(){
    this.produto = this.produtos[0];
    this.produtoA = this.produtos[1];
    this.produtoB = this.produtos[2];
  }

  iniciaCarrinho(){
    this.carrinho.precoTotal = 0;
    this.carrinho.qtdProduto = 0;

    this.carrinho.produtos = null;
  }

  apagar(idP){
    for(let i = 0; i < this.carrinho.produtos.length; i++){
      if(idP == this.carrinho.produtos[i].idP){        
        this.carrinho.precoTotal = this.carrinho.precoTotal - this.carrinho.produtos[i].valor;
        this.carrinho.qtdProduto--;
        this.carrinho.produtos.splice(i,1);
      }
    }
  }
  
  iniciaPagamento(){
    this.pagamentoIniciado = true;
  }

  mostra(){
    console.log('Usuario:',this.formGroupPagamento.value,'Validade:',this.formGroupPagamento.valid);
    console.log('Comprador:',this.formGroupComprador.value,'Validade:',this.formGroupComprador.valid);
  }
  
  msgFinalizaCompra(){ 
    this.pagamentoFinalizado = true;
    console.log(this.pagamentoFinalizado);
    let msg = setTimeout(()=>{
      this.pagamentoFinalizado = false;
      this.menu=1;
      console.log(this.pagamentoFinalizado);
    },3000);
  }

  esvaziaCarrinho(){
    this.carrinho.precoTotal = 0;
    this.carrinho.qtdProduto = 0;
    this.carrinho.produtos = null;
  }

  finalizarCompra(){
    this.pagamentoIniciado = false;
    this.msgFinalizaCompra();
    this.esvaziaCarrinho();
  }



  filtraProdutos(){
    
    for(let i = 0 ; i < this.resultados.length; i=i){
      
      let nomeProduto:string = this.resultados[i].nome.toLocaleUpperCase();
      let descricaoProduto:string =this.resultados[i].descricao.toLocaleUpperCase();
      let validacaoNomeProduto = nomeProduto.search(this.pesquisa.toLocaleUpperCase());
      let validacaoDescricaoProduto = descricaoProduto.search(this.pesquisa.toLocaleUpperCase());

      if(validacaoNomeProduto == -1 && validacaoDescricaoProduto == -1 ){
        this.resultados.splice(i,1);

      }else{
        i++;
      }

    }
  }

  copia(){
    this.resultados = this.produtos.slice() ;
  }

  async pesquisar(){
    this.buscou = true;
    this.menu=3;

    this.copia();
    await this.filtraProdutos();
  }
  

  ngOnInit() {
  }


}
