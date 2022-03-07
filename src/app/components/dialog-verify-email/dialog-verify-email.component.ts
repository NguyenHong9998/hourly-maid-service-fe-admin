import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';

@Component({
  selector: 'app-dialog-verify-email',
  templateUrl: './dialog-verify-email.component.html',
  styleUrls: ['./dialog-verify-email.component.scss']
})
export class DialogVerifyEmailComponent implements OnInit {
  verifyCode !: string;
  constructor(public dialogRef: MatDialogRef<DialogVerifyEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public http: HttpClient, public customSnackbarService: CustomSnackbarService) { }

  ngOnInit(): void {
  }

  onSave() {
    const data = {
      verify_token: this.verifyCode
    }
    this.http.post(environment.apiUrl + '/user/verify-email', data).subscribe((data: any) => {
      this.customSnackbarService.success("Xác thực thành công")
      this.dialogRef.close({verify_email : true});
    })

  }

}
