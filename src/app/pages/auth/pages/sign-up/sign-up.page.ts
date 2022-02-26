import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTER_UTILS } from '@core/utils/router.utils';
import { environment } from '@env/environment';
import { AuthService } from '@pages/auth/services/auth.service';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { ShareService } from '@pages/auth/services/share.service';
import { TokenStorageService } from '@pages/auth/services/token-storage.service';

@Component({
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {

  registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl('')
  })
  constructor(
    private router: Router,
    private authService: AuthService,
    private shareService: ShareService,
    private tokenStorageService: TokenStorageService,
    public customSnackbarService: CustomSnackbarService,
    public http: HttpClient

  ) {
  }

  onClickRegister() {
    const body = {
      email: this.registerForm.get('email')?.value,
      phone: this.registerForm.get('phone')?.value,
      password: this.registerForm.get('password')?.value,
      full_name: this.registerForm.get('name')?.value,
      role_id: "USER"
    }
    this.http.post(environment.apiUrl + "/auth/register", body).subscribe((data: any) => {
      console.log(data);
      this.tokenStorageService.saveTokenLocal(data.data.access_token);
      this.tokenStorageService.saveUserLocal(data.data);
      this.tokenStorageService.saveTokenSession(data.data.access_token);
      this.authService.isLoggedIn$.next(true);
      this.shareService.sendClickEvent();
      this.customSnackbarService.success("Đăng ký thành công!")

      this.router.navigateByUrl("/");
    })
  }
  onCLikSignIn(): void {
    const { root, signIn } = ROUTER_UTILS.config.auth;
    this.router.navigate(['/', root, signIn]);
  }


}
