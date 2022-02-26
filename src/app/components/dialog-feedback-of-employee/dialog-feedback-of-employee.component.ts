import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { TokenStorageService } from '@pages/auth/services/token-storage.service';

export class OverviewFeedback {
  numberOfClient: number;
  detail: Array<any>;

  constructor(numberOfClient: number,
    detail: Array<any>) {
    this.numberOfClient = numberOfClient;
    this.detail = detail;
  }
}

export class Detail {
  numStar: number;
  numUser: number;
  percent: string;

  constructor(numStar: number,
    numUser: number,
    percent: string) {
    this.numStar = numStar;
    this.numUser = numUser;
    this.percent = percent;

  }
}

export class Feedback {
  content: string;
  username: string;
  avatarUser: string;
  voteNum: number;
  createDate: string;

  constructor(content: string,
    username: string,
    avatarUser: string,
    voteNum: number, createDate: string) {
    this.content = content;
    this.username = username;
    this.avatarUser = avatarUser;
    this.voteNum = voteNum;
    this.createDate = createDate;

  }
}
@Component({
  selector: 'app-dialog-feedback-of-employee',
  templateUrl: './dialog-feedback-of-employee.component.html',
  styleUrls: ['./dialog-feedback-of-employee.component.scss']
})

export class DialogFeedbackOfEmployeeComponent implements OnInit {
  title: any;
  stars: number[] = [1, 2, 3, 4, 5];
  overview = new OverviewFeedback(0, []);
  feedback !: Array<Feedback>;
  rating: number = 1;
  starCount: number = 5;
  feedbackContent = '';

  curentAvatar !:string;

  constructor(public tokenStorageService :TokenStorageService ,public dialogRef: MatDialogRef<DialogFeedbackOfEmployeeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, public snackbar: CustomSnackbarService) {
    this.title = data.elementName;
  }

  ngOnInit(): void {
    this.curentAvatar = this.tokenStorageService.getUser().avatar_user;
    console.log(this.curentAvatar);
    this.getOverviewFeedback();
    this.getListFeedback();
  }

  onNoClick() {
    this.dialogRef.close();
  }

  getOverviewFeedback() {
    let params = new HttpParams()
      .set('user_id', this.data.employeeId);
    this.http.get(environment.apiUrl + "/feedback/overview", { params: params }).subscribe(data => {
      const numberOfClient = (data as any).data.num_user;
      const result = Array<Detail>();
      const detailList = (data as any).data.detail;
      for (let i = 0; i < detailList.length; i++) {
        const item = new Detail(detailList[i].num_star, detailList[i].num_user, detailList[i].percent);
        result.push(item);
      }
      this.overview = new OverviewFeedback(numberOfClient, result.reverse());
    })
  }

  getListFeedback() {
    let params = new HttpParams()
      .set('user_id', this.data.employeeId);
    this.http.get(environment.apiUrl + "/feedback", { params: params }).subscribe(data => {
      const result = Array<Feedback>();
      const detailList = (data as any).data;
      for (let i = 0; i < detailList.length; i++) {
        const item = new Feedback(detailList[i].content, detailList[i].username, detailList[i].avatar_user, detailList[i].vote_num, detailList[i].create_date);
        result.push(item);
      }
      this.feedback = result;
    })
  }
  onRatingChanged(rating: any) {
    console.log(rating);
    this.rating = rating;
  }

  addFeedback() {
    const content = this.feedbackContent;
    console.log(content);
    if (content.length == 0) {
      this.snackbar.warning("Nội dung nhận xét đang trống, hãy thử lại")
    } else {
      const body = {
        content: content,
        vote_num: this.rating,
        employee_id: this.data.employeeId
      }
      this.http.post(environment.apiUrl + "/feedback", body).subscribe((data: any) => {
        this.snackbar.success("Tạo mới thành công, cảm ơn bạn vì đã giành chút thời gian để góp ý nhân viên");
        this.feedbackContent = '';
        this.rating = 1;
        this.getListFeedback();
      })
    }
  }
}
