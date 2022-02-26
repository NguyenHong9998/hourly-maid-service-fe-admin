import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { EditDiscountServiceListDomain } from './edit-discount.domain';

export class ServiceDiscount {
  name: string;
  banner: string;
  percentage: string;

  constructor(name: string, banner: string, percentage: string) {
    this.banner = banner;
    this.name = name;
    this.percentage = percentage;
  }
}

@Component({
  selector: 'app-dialog-edit-discount-service',
  templateUrl: './dialog-edit-discount-service.component.html',
  styleUrls: ['./dialog-edit-discount-service.component.scss']
})
export class DialogEditDiscountServiceComponent implements OnInit {
  exampleForm: FormGroup | any;
  totalSum: number = 0;
  myFormValueChanges$: any;
  services !: Array<ServiceDiscount>;
  discountInform !: EditDiscountServiceListDomain;
  formArray: FormArray | any;
  name!: "";
  note!: "";
  start !: string;
  end !: string;
  status !: string;

  constructor(public dialogRef: MatDialogRef<DialogEditDiscountServiceComponent>,
    private formBuilder: FormBuilder, public http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, public customSnackbarService: CustomSnackbarService) {
  }

  ngOnInit(): void {

    this.getDiscountInform();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  banner!: string;

  ngOnDestroy(): void {
  }

  getDiscountInform() {

    this.http.get(environment.apiUrl + '/discount/' + this.data.discountId).subscribe((data: any) => {
      const name = data.data.title;
      const note = data.data.note;
      this.banner = data.data.banner;
      const startDate = data.data.start_time;
      const endDate = data.data.end_time;
      const service = data.data.service_list;
      const servicesList = new Array<ServiceDiscount>();
      for (let i = 0; i < service.length; i++) {
        servicesList.push(new ServiceDiscount(service[i].name, service[i].banner, service[i].percentage));
      }
      this.services = servicesList;
      this.name = name;
      this.note = note;
      this.start = startDate;
      this.end = endDate;


    })
  }


}
