import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { DialogAddEditComponent } from './Dialog/dialog-add-edit/dialog-add-edit.component';
import { Product } from './Interface/product';
import { Subscriber } from 'rxjs';
import { ProductService } from './Services/product.service';
import { MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogDeleteComponent } from './Dialog/dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements AfterViewInit, OnInit{
  displayedColumns: string[] = ['id', 'name', 'description', 'precio', 'dischargeDate', 'active', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  constructor(
    private _productService:ProductService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
    
  ){

  }
  ngOnInit(): void {
    this.getProducts();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  activeFilter: boolean | null = null;

  applyFilterActive(value: any) {
    this.activeFilter = value;
    if (this.dataSource) {
      this.dataSource.filter = this.activeFilter === null ? '' : this.activeFilter.toString();
    }
  }  

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  getProducts() {
    this._productService.getList().subscribe({
      next: (dataResponse) => {
        this.dataSource.data = Array.isArray(dataResponse) ? dataResponse : [dataResponse];
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  showAlert(message: string, action: string){
    this._snackBar.open(message,action,{
      horizontalPosition:"end",
      verticalPosition: "top",
      duration:3000
    })
  }


  newProduct() {
    this.dialog.open(DialogAddEditComponent,{
      disableClose:true,
      width:"550px"
    }).afterClosed().subscribe(result => {
      if(result === "Creado"){
        this.getProducts();
      }
    });
  }  

  editProduct(dataProduct:Product) {
    this.dialog.open(DialogAddEditComponent,{
      disableClose:true,
      width:"550px",
      data:dataProduct
    }).afterClosed().subscribe(result => {
      if(result === "Editado"){
        this.getProducts();
      }
    });
  }  

  deleteProduct(dataProduct:Product) {
    this.dialog.open(DialogDeleteComponent,{
      disableClose:true,
      data:dataProduct
    }).afterClosed().subscribe(result => {
      if(result === "Eliminado"){
        this._productService.delete(dataProduct.id).subscribe({
          next:(data)=>{
            this.showAlert("Producto Eliminado", "listo")
            this.getProducts()
          }, error:(e)=>{console.log(e)}
        })
      }
    });
  }



  formatearPrecio(precio: number): string {
    return `$${Math.round(precio).toLocaleString()}`;
  }
  
  
}
