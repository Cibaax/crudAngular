import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../Interface/product';
@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrl: './dialog-delete.component.css'
})
export class DialogDeleteComponent implements OnInit {
  constructor(
    private dialogoReferencia: MatDialogRef<DialogDeleteComponent>,
    @Inject (MAT_DIALOG_DATA) public dataProduct: Product
  ){
  }
  ngOnInit(): void {
    
  }
  
  confirmDelete(){
    if(this.dataProduct){
      this.dialogoReferencia.close("Eliminado")
    }
  }
}
