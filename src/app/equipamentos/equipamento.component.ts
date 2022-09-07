import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.module';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  public equipamento$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private equipamentoService: EquipamentoService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.equipamento$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      numeroSerie: new FormControl(""),
      nome: new FormControl(""),
      precoAquisicao: new FormControl(""),
      dataFabricacao: new FormControl("")
    })
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() :AbstractControl|null {
    return this.form.get("id");
  }

  get numeroSerie() :AbstractControl|null {
    return this.form.get("numeroSerie");
  }

  get nome() :AbstractControl|null {
    return this.form.get("nome");
  }

  get precoAquisicao() :AbstractControl|null {
    return this.form.get("precoAquisicao");
  }

  get dataFabricacao() :AbstractControl|null {
    return this.form.get("dataFabricacao");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();

    /* Aqui os valores são preenchidos nos campos do form */
    if(equipamento)
      this.form.setValue(equipamento);

    try {
      await this.modalService.open(modal).result;

      if(!equipamento) {
        await this.equipamentoService.inserir(this.form.value);
        this.toastrService.success("Equipamento cadastrado com sucesso!", "Cadastro de equipamento");
      }
      else {
        await this.equipamentoService.editar(this.form.value);
        this.toastrService.success("Equipamento editado com sucesso!", "Edição de equipamentos");
      }

    } catch (error) {
      if(error != "fechar")
        this.toastrService.error("Não foi possivel registrar o Equipamento");
    }
  }

  public excluir(equipamento: Equipamento) {
    this.equipamentoService.excluir(equipamento);
    this.toastrService.warning(`'${equipamento.nome}' excluído`, "Exclusão de equipamento");
  }

}
