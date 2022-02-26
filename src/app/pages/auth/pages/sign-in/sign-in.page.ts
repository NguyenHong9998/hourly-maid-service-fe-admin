import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTER_UTILS } from '@core/utils/router.utils';
import { AuthService } from '@pages/auth/services/auth.service';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { ShareService } from '@pages/auth/services/share.service';
import { TokenStorageService } from '@pages/auth/services/token-storage.service';

@Component({
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  returnUrl: string;
  error_message = '';
  username: string = '';
  errorMessage = '';
  roles: string[] = [];
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    remember_me: new FormControl(''),
  })
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private shareService: ShareService,
    private tokenStorageService: TokenStorageService,
    public customSnackbarService: CustomSnackbarService

  ) {
    this.returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || `${ROUTER_UTILS.config.base.home}`;
  }

  oncLickSignIn() {
    this.authService.login(this.loginForm.value).subscribe(
      data => {
        console.log(data);
        if (this.loginForm.value.remember_me) {
          this.tokenStorageService.saveTokenLocal(data.data.access_token);
          this.tokenStorageService.saveUserLocal(data.data);
        } else {
          this.tokenStorageService.saveTokenSession(data.data.access_token);
          this.tokenStorageService.saveUserLocal(data.data);
        }

        this.authService.isLoggedIn$.next(true);
        this.username = this.tokenStorageService.getUser().username;
        this.roles = this.tokenStorageService.getUser().roles;
        this.loginForm.reset();
        this.customSnackbarService.success("Đăng nhập thành công")
        this.router.navigateByUrl(this.returnUrl);
        this.shareService.sendClickEvent();
      },
    );

  }

}
