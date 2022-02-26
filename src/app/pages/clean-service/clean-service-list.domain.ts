
export class CleanServiceListDomain {
    id: number;
    position: number;
    name: string;
    banner: string;
    price: string;
    note: string;
    createDate: string;
    introduce: string;
    advantage: string;
    numTask : string;
    discounts : Array<DiscountOfService>;


    constructor(id: number, position: number, name: string, banner: string, price: string, note: string, createDate: string, introduce: string, advantage: string, numTask : string,
        discounts : Array<DiscountOfService>) {
        this.id = id;
        this.position = position;
        this.name = name;
        this.banner = banner;
        this.price = price;
        this.note = note;
        this.createDate = createDate;
        this.advantage = advantage;
        this.introduce = introduce;
        this.numTask = numTask;
        this.discounts = discounts;
    }

}

export class DiscountOfService {
    id: number;
    banner: string;
    title: string;
    endDate: string;
    percentage: string;

    constructor(id: number, banner: string, title: string, endDate: string, percentage: string) {
        this.id = id;
        this.banner = banner;
        this.title = title;
        this.endDate = endDate;
        this.percentage = percentage;
    }
}