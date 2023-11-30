import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { Product } from '../../Interface/product';
import { ProductService } from '../../Services/product.service';

export const MY_DATE_FORMATS ={
  parse: {
    dateInput: 'DD/MM/YYY',
  },
  display: {
    dateInput: 'DD/MM/YYY',  
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrl: './dialog-add-edit.component.css',
  providers:[
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})

export class DialogAddEditComponent implements OnInit{
  formProduct: FormGroup;
  tittleAction: string = "Nuevo Producto";
  buttonAction: string = "Crear";
  mensajeError: string = '';

  
  constructor(
    private dialogoReferencia: MatDialogRef<DialogAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _productService:ProductService,
    @Inject (MAT_DIALOG_DATA) public dataProduct: Product
  ){
    this.formProduct = this.fb.group({
      id: 0,
      name:['',Validators.required],
      description:['',Validators.required],
      precio:['',Validators.required],
      active:['',Validators.required]
    })
  }

  soloNumeros(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    
    if ((charCode < 48 || charCode > 57) && charCode > 31) {
      this.mensajeError = 'Ingrese solo números';
      return false;
    }

    this.mensajeError = '';
    return true;
  }

  showAlert(message: string, action: string){
    this._snackBar.open(message,action,{
      horizontalPosition:"end",
      verticalPosition: "top",
      duration:3000
    })
  }


  addEditProduct(){
    console.log(this.formProduct)
    console.log(this.formProduct.value)
    const id = this.formProduct.value.id;
    const model: Product={
      id: id as number,
      dischargeDate:new Date(),
      name: this.formProduct.value.name,
      description: this.formProduct.value.description,
      precio: this.formProduct.value.precio,
      active: this.formProduct.value.active,
    }

    if(this.dataProduct == null){
      this._productService.add(model).subscribe({
        next:(data)=>{
          this.showAlert("Producto creado","Listo")
          this.dialogoReferencia.close("Creado")
        },error:(e)=>{
          this.showAlert("No se puede crear este producto","Error")
        }
      })
    }
    else{
      this._productService.update(this.dataProduct.id, model).subscribe({
        next: (data) => {
          this.showAlert("Producto Editado", "Listo");
          this.dialogoReferencia.close("Editado");
        },
        error: (e) => {
          this.showAlert("No se puede editar este producto", "Error");
        },
      });      
    }
  }


  ngOnInit(): void{
    if(this.dataProduct){
      this.formProduct.patchValue({
        ...this.dataProduct,
      })
      this.tittleAction = 'Editar Producto'
      this.buttonAction = 'Actualizar'
    }
  }
}
