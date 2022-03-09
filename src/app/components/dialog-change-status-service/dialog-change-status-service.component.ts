import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';

@Component({
  selector: 'app-dialog-change-status-service',
  templateUrl: './dialog-change-status-service.component.html',
  styleUrls: ['./dialog-change-status-service.component.scss']
})
export class DialogChangeStatusServiceComponent implements OnInit {
  statusForm = new FormControl();
  status !: string;
  banner !: string;
  name !: string;

  constructor(public dialogRef: MatDialogRef<DialogChangeStatusServiceComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public http: HttpClient, public customSnackbarService: CustomSnackbarService) {
    this.status = data.status;
    this.banner = data.banner;
    this.name = data.name;
  }

  ngOnInit(): void {
  }


  onNoClick() {
    this.dialogRef.close();
  }
  checkCheckBoxvalue(event: any) {
    this.status = event.target.value;
  }

  onChangeStatus() {
    const data = {
      id: this.data.serviceId,
      status: this.status
    }
    this.http.put(environment.apiUrl + "/service/change-status", data).subscribe(data => {
      this.customSnackbarService.success("Cập nhật trạng thái thành công")
      this.dialogRef.close();
    })
  }

}
