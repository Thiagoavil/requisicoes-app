import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.module';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/model/funcionario.model';
import { FuncionarioService } from '../funcionarios/service/funcionario.service';
import { Requisicao } from './model/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html'
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;

  private funcionarioLogado: Funcionario;

  public form: FormGroup;

  constructor(
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(25)]),
      dataCriacao: new FormControl(""),
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),
      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),
      solicitanteId: new FormControl(""),
      solicitante: new FormControl("")
    });

    this.obterFuncionarioLogado();
  }

  get tituloModal(): string {
    return this.id?.value ? "Edição" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get descricao(): AbstractControl | null {
    return this.form.get("descricao");
  }

  get dataCriacao(): AbstractControl | null {
    return this.form.get("dataCriacao");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("departamentoId");
  }

  get equipamentoId(): AbstractControl | null {
    return this.form.get("equipamentoId");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();

    if(requisicao)
      this.form.setValue(requisicao);

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid) {
        if(!requisicao) {

          this.form.get("dataCriacao")?.setValue(new Date(Date.now()).toLocaleString());
          this.form.get("solicitante")?.setValue(this.funcionarioLogado);
          this.form.get("solicitanteId")?.setValue(this.funcionarioLogado.id);
          this.requisicaoService.inserir(this.form.value);
        }
        else
          this.requisicaoService.editar(this.form.value);

        this.toastr.success("Informações registradas com sucesso!", `${this.tituloModal} de requisição`);
      }
    } catch (error) {
      if(error != "fechar" && error != "1" && error != "0")
        this.toastr.error("Houve um erro na solicitação");
    }
  }

  public excluir(requisicao: Requisicao) {
    this.requisicaoService.excluir(requisicao);
    this.toastr.warning(`'${requisicao.id}' excluída`, "Exclusão de requisições");
  }

  obterFuncionarioLogado() {
    this.authService.usuarioLogado
      .subscribe(dados => {
        this.funcionarioService.selecionarFuncionarioLogado(dados?.email!)
          .subscribe(funcionario => {
            this.funcionarioLogado = funcionario;
          this.obterMinhasRequisicoes();
          })
      })
  }

  obterMinhasRequisicoes() {
    this.requisicoes$ = this.requisicaoService.selecionarTodos()
      .pipe(
        map(requisicoes => {
          return requisicoes.filter(r => r.solicitante?.email === this.funcionarioLogado.email);
      } )
    )
  }

  obterRequisicoesDoMeuDepartamento() {
    this.requisicoes$ = this.requisicaoService.selecionarTodos()
      .pipe(
        map(requisicoes => {
          return requisicoes.filter(r => r.departamentoId === this.funcionarioLogado.departamentoId);
      } )
    )
  }

  // Será apagado
  selecionarTodos() {
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
  }
}
