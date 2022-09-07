import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './model/funcionario.model';
import { FuncionarioService } from './service/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
})
export class FuncionarioComponent implements OnInit {
  public funcionarios$:Observable<Funcionario[]>;
  public departamentos$:Observable<Departamento[]>;
  public form:FormGroup;


  constructor(
    private authService:AuthenticationService,
    private funcionarioService:FuncionarioService,
    private departamentoService:DepartamentoService,
    private toastrService:ToastrService,
    private modalService:NgbModal,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      funcionario:new FormGroup({
        id:new FormControl(""),
        nome:new FormControl("",[Validators.required,Validators.minLength(3)]),
        email:new FormControl("",[Validators.required,Validators.email]),
        funcao:new FormControl("",[Validators.required]),
        departamentoId:new FormControl(""),
        departamento:new FormControl("")
      }),
      senha:new FormControl("")
    })

    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() :AbstractControl|null {
    return this.form.get("funcionario.id");
  }

  get nome() :AbstractControl|null {
    return this.form.get("funcionario.nome");
  }

  get email() :AbstractControl|null {
    return this.form.get("funcionario.email");
  }

  get funcao() :AbstractControl|null {
    return this.form.get("funcionario.funcao");
  }

  get departamentoId() :AbstractControl|null {
    return this.form.get("funcionario.departamentoId");
  }

  get departamento() :AbstractControl|null {
    return this.form.get("funcionario.departamento");
  }

  get senha() :AbstractControl|null {
    return this.form.get("senha");
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
    this.form.reset();

    /* Aqui os valores são preenchidos nos campos do form */
    if(funcionario)
    {
      const departamento = funcionario.departamento ? funcionario.departamento : null;

      const funcionarioCompleto ={
        ...funcionario,
        departamento
      }

      this.form.get("funcionario")?.setValue(funcionarioCompleto);
    }

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid){
        if(!funcionario) {
          let usuarioatual = await this.authService.getUsuario();

          await this.authService.cadastrar(this.email?.value,this.senha?.value);

          await this.funcionarioService.inserir(this.form.get("funcionario")?.value);

          await this.authService.atualizarUsuario(usuarioatual);
        }
        else {
          await this.funcionarioService.editar(this.form.get("funcionario")?.value);
        }

        this.toastrService.success(`O funcionário foi salvo com sucesso!`, "Cadastro de Funcionários");
      }
      else
        this.toastrService.error("O Formulário precisa ser preenchido","Cadastro de funcionario");

    } catch (error) {
      if(error != "fechar")
        this.toastrService.error("Não foi possivel registrar o funcionario");
    }
  }

  public excluir(funcionario: Funcionario) {
    this.funcionarioService.excluir(funcionario);
    this.toastrService.warning(`'${funcionario.nome}' excluído`, "Exclusão de funcionario");
  }
}
