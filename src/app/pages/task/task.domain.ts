export class TaskListDomain {
    id: number;
    workDate: string;
    startTime: string;
    endTime: string;
    status: string;
    address : string;
    employeeAvatar: Array<any>;

    constructor(id: number,
        workDate: string,
        startTime: string,
        endTime: string,
        status: string, employeeAvatar: Array<any>, address : string) {
        this.id = id;
        this.workDate = workDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.employeeAvatar = employeeAvatar;
        this.address = address;
    }

}