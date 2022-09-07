import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisicaoComponent } from './requisicao.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    RequisicaoComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    RequisicaoRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class RequisicaoModule { }
