import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTER_UTILS } from '@core/utils/router.utils';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { TokenStorageService } from '@pages/auth/services/token-storage.service';
import { format } from 'date-fns';


@Component({
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage {

  role: string = "";
  status: string = "";

  experience: any = [
    {
      name: "",
      note: "",
      hasExperience: true
    },
    {
      name: "",
      note: "",
      hasExperience: true
    },
  ]

  file!: File;
  avatar!: string | ArrayBuffer;

  changePassForm = new FormGroup({
    oldPass: new FormControl(''),
    newPass: new FormControl(''),
    confirmNewPass: new FormControl(''),
  })
  name = '';
  gender = '';
  dateOfBirth = new Date();
  isVerifyEmail !: boolean;
  isVerifyPhone !: boolean;

  personalInform = new FormGroup({
    email: new FormControl(''),
    phone: new FormControl(''),
    verifyPhone: new FormControl(''),
    verifyEmail: new FormControl('')
  })

  onFileChange(event: any) {
    console.log("Change avatar");
    this.file = event.target.files[0] || null;
    if (this.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.avatar = reader.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.avatar = this.avatar;
    }
  }

  onRemoveAvatar() {
    this.avatar = "https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png";
    this.file = null as any;
  }

  ngOnInit(): void {
    this.getUserCommonInform();
  }

  constructor(public http: HttpClient, public customSnackbarService: CustomSnackbarService,
    public tokenStorageService: TokenStorageService, private router: Router

  ) {
  }

  getUserCommonInform() {

    this.http.get(environment.apiUrl + "/user/client/inform").subscribe((data: any) => {
      let avatar = (data as any).data.avatar;
      if (avatar == null) {
        avatar = "https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png";
      }
      this.avatar = avatar;
      this.name = data.data.name;
      this.avatar = data.data.avatar;
      this.gender = data.data.gender;
      let birthday = (data as any).data.date_of_birth == "" ? new Date() : new Date((data as any).data.date_of_birth);
      this.dateOfBirth = birthday;
      this.personalInform.get('email')?.setValue(data.data.email);
      this.personalInform.get('phone')?.setValue(data.data.phone);
      this.isVerifyEmail = data.data.verify_email;
      this.isVerifyPhone = data.data.verify_phone;

    })
  }

  getUserPersonalInform() {
    this.http.get(environment.apiUrl + "/user/personal-inform").subscribe(data => {
      this.personalInform.get('email')?.setValue((data as any).data.email);
      this.name = (data as any).data.name;
      this.gender = (data as any).data.gender;
      this.personalInform.get('phone')?.setValue((data as any).data.phone);
      let birthday = (data as any).data.date_of_birth == "" ? new Date() : new Date((data as any).data.date_of_birth);
      this.dateOfBirth = birthday;

    })

  }

  onItemChange(event: any) {
    this.personalInform.get('gender')?.setValue(event.target.value);
  }
  saveCommonInform() {
    let avatar = this.avatar as string;
    const formData = new FormData();
    formData.append('file', this.file);
    if (!avatar.startsWith('http')) {
      this.http.post(environment.apiUrl + "/cloud/upload-avatar", formData).subscribe(data => {
        this.avatar = (data as any).data;
        let body = {
          avatar: this.avatar,
          gender: this.gender,
          name: this.name,
          date_of_birth: format(this.dateOfBirth, "yyyy-MM-dd")
        }
        this.http.put(environment.apiUrl + "/user/client/common-inform/", body).subscribe(data => {
          this.customSnackbarService.success("Cập nhật thành công!")
        })
      })
    } else {
      let body = {
        avatar: this.avatar,
        gender: this.gender,
        name: this.name,
        date_of_birth: format(this.dateOfBirth, "yyyy-MM-dd")
      }
      this.http.put(environment.apiUrl + "/user/client/common-inform", body).subscribe(data => {
        this.customSnackbarService.success("Cập nhật thành công!")
      })
    }

  }

  saveUserPersonalInform() {
    const data = {
      email: this.personalInform.get('email')?.value,
      gender: this.personalInform.get('gender')?.value,
      phone: this.personalInform.get('phone')?.value,
      id_card: this.personalInform.get('idCard')?.value,
      address: this.personalInform.get('address')?.value,
      date_of_birth: this.personalInform.get('dateOfBirth')?.value.value,
      name: this.personalInform.get('name')?.value
    }

    this.http.put(environment.apiUrl + "/user/personal-inform", data).subscribe(data => {
      this.customSnackbarService.success("Cập nhật thành công!")
    })
  }

  changePassword() {
    console.log("kkkkkkkkk" + this.changePassForm.get('confirmNewPass')?.value);

    const data = {
      old_pass: this.changePassForm.get('oldPass')?.value,
      new_pass: this.changePassForm.get('newPass')?.value,
      confirm_new_pass: this.changePassForm.get('confirmNewPass')?.value
    }
    this.http.post(environment.apiUrl + "/user/change-pass", data).subscribe(data => {
      this.customSnackbarService.success("Cập nhật thành công! Hãy đăng nhập lại");
      this.tokenStorageService.signOut();
      const { root, signIn } = ROUTER_UTILS.config.auth;
      this.router.navigate(['/', root, signIn]);
      window.location.reload();
    })
  }
  onRoleChange(event: any) {
    this.role = event.target.value;
  }

  sendCodeVerifyEmail() {
    const data = { email: this.personalInform.get('email')?.value }
    this.http.post(environment.apiUrl + '/user/send-verify-email', data).subscribe((data: any) => {
      this.customSnackbarService.success("Gửi mã thành công, hãy kiểm tra email của bạn")
    })
  }

  sendCodeVerifyPhone() {
    const data = { phone_number: this.personalInform.get('phone')?.value }

    this.http.post(environment.apiUrl + '/user/verify-phone-sms', data).subscribe((data: any) => {
      this.customSnackbarService.success("Gửi mã thành công, hãy kiểm tra điện thoại của bạn")
    })
  }
  verifyEmail() {
    const data = {
      verify_token: this.personalInform.get('verifyEmail')?.value
    }
    this.http.post(environment.apiUrl + '/user/verify-email', data).subscribe((data: any) => {
      this.customSnackbarService.success("Xác thực thành công")
      this.isVerifyEmail = true;
    })

  }

  verifyPhone() {
    const data = {
      verify_token: this.personalInform.get('verifyPhone')?.value
    }
    this.http.post(environment.apiUrl + '/user/verify-phone', data).subscribe((data: any) => {
      this.customSnackbarService.success("Xác thực thành công")
      this.isVerifyPhone = true;
    })
  }
}
