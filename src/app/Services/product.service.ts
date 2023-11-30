import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Interface/product';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint:string = environment.endPoint;
  private apiUrl:string = this.endpoint + 'api/';
  constructor(private http:HttpClient){}

  getList():Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}Products`)
  }

  add(modelo:Product):Observable<Product>{
    return this.http.post<Product>(`${this.apiUrl}Products`,modelo)
  }

  update(idProduct:number,modelo:Product):Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}Products/${idProduct}`,modelo)
  }

  delete(idProduct:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}Products/${idProduct}`)
  }

}
