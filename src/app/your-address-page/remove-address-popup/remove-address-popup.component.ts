import { Component, Inject, OnInit,Output,ViewChild,ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-address-popup',
  templateUrl: './remove-address-popup.component.html',
  styleUrls: ['./remove-address-popup.component.scss']
})
export class RemoveAddressPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RemoveAddressPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit(): void {
  }

  closeDialog(value?:string){
    this.dialogRef.close()
  }

  selectYes(){
    this.dialogRef.close({ data: {
      "response":'yes',
      "address":this.data.currentAddress
    }})
  }

}
