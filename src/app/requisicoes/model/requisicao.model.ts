import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.module";
import { Funcionario } from "src/app/funcionarios/model/funcionario.model";

export class Requisicao {
  id: string;
  descricao: string;
  dataCriacao: string;
  equipamentoId?: string | null;
  equipamento?: Equipamento;
  departamentoId: string;
  departamento?: Departamento;
  solicitanteId: string;
  solicitante?: Funcionario;
}
