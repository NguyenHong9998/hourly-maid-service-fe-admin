import { Component, OnInit } from '@angular/core';
import { ThemeList, ThemeService } from '@core/services/theme';
import { ROUTER_UTILS } from '@core/utils/router.utils';

export class Service {
  id: string;
  name: string;
  introduce: string;
  banner: string;

  constructor(id: string,
    name: string,
    introduce: string, banner: string) {
    this.id = id;
    this.name = name;
    this.introduce = introduce;
    this.banner = banner;
  }
}
@Component({
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  path = ROUTER_UTILS.config;
  theme = ThemeList;
  interval = 5000;
  cover = "../../assets/img/cover3.jpeg";

  slideConfig = {
    slidesToShow: 3, slidesToScroll: 3,
  };

  services : Array<Service> = []

  constructor(private themeService: ThemeService) { }
  onClickChangeTheme(theme: ThemeList): void {
    this.themeService.setTheme(theme);
  }
  slickInit(e: any) {
    console.log('slick initialized');
  }
  breakpoint(e: any) {
    console.log('breakpoint');
  }
  afterChange(e: any) {
    console.log('afterChange');
  }
  beforeChange(e: any) {
    console.log('beforeChange');
  }
  ngOnInit(): void {
    this.getListService();
  }

  getListService() {
    const servicesArr = new Array<Service>();
    for (let i = 0; i < 6; i++) {
      servicesArr.push(new Service("1", "Boost your conversion rate", "Architecto accusantium praesentium eius,ut atque fuga culpa, similique sequi cum eos quis dolorum.", "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"))
    }

    servicesArr.push(new Service("1", "Boost your conversion rate", "Architecto accusantium praesentium eius,ut atque fuga culpa, similique sequi cum eos quis dolorum.", "https://jupviec-pub-assets.s3.ap-southeast-1.amazonaws.com/nhamdan_06_47303ee099.jpg"))


    this.services = servicesArr;
  }

}
