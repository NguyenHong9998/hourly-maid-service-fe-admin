import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCreateTaskComponent } from '@components/dialog-create-task/dialog-create-task.component';
import { DialogTaskDetailComponent } from '@components/dialog-task-detail/dialog-task-detail.component';
import { environment } from '@env/environment';
import { CustomSnackbarService } from '@pages/auth/services/custom-snackbar.service';
import { TaskListDomain } from './task.domain';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {

    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    displayedColumns: string[] = ['select', 'name', 'work_date', 'start_time', 'end_time', 'status', 'detail'];
    dataSource!: MatTableDataSource<TaskListDomain>;
    taskList: Array<TaskListDomain> = [];

    selection = new SelectionModel<any>(true, []);
    totalRow: number = 10;
    isLoading !: boolean;
    keySearch = new FormControl('');
    arrayPageSize = [4, 10, 15];
    sortObj!: Sort;
    mapPageToken = new Map();
    status!: string;
    offset !: number;

    statusList: any = [
        {
            name: "Đã tạo",
            icon: "note_add"
        },
        {
            name: "Chưa giao NV",
            icon: "assignment_ind"
        },
        {
            name: "Đã giao NV",
            icon: "assignment_ind"
        },

        {
            name: "Hoàn thành",
            icon: "done_all"
        },
        {
            name: "Đã huỷ",
            icon: "cancel_presentation"
        }
    ]
    selectedStatus !: string;
    pageSize = this.arrayPageSize[0];
    constructor(
        private dialog: MatDialog, public http: HttpClient, public snakbar: CustomSnackbarService
    ) {
    }

    ngOnInit(): void {
        this.offset = 0;
        this.getListTasks();
    }


    sortData(sort: Sort) {

        this.sortObj = sort;
        this.paginator.pageIndex = 0;
        this.selection.clear();
        this.getListTasks();

    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataSource.data);
    }

    openDialogCreateTask() {
        const dialogRef = this.dialog.open(DialogCreateTaskComponent);
        dialogRef.afterClosed().subscribe(() => {
            this.getListTasks();
        });
    }

    openDialogEditTask(taskId: number, status: string) {
        const data = { taskId, status };
        const dialogRef = this.dialog.open(DialogTaskDetailComponent, { data });

        dialogRef.afterClosed().subscribe(() => {
            this.getListTasks();
        });
    }


    getListTasks() {
        this.isLoading = true;
        let status = '';
        if (!this.selectedStatus || this.selectedStatus[0] == 'Đã tạo') {
            status = '';
        } else {
            status = this.selectedStatus[0];
        }
        let params = new HttpParams()
            .set('offset', this.offset)
            .set('limit', this.pageSize)
            .set('status', status)
        this.http.get(environment.apiUrl + "/task/user", { params: params })
            .subscribe((res: any) => {
                this.totalRow = res.total_rows;
                this._prepareTaskList(res.data);
                this.isLoading = false;
            }
            );
    }
    _prepareTaskList(data: any) {
        console.log(data);
        if (data) {
            const result = Array<TaskListDomain>();
            for (let i = 0; i < data.length; i++) {
                const id = data[i].id;
                const startTime = data[i].start_time;
                const endTime = data[i].end_time;
                const workDate = data[i].work_date;
                const status = data[i].status;
                const employeeAVatar = data[i].employee_avatar;
                const address = data[i].address;
                const domain = new TaskListDomain(id as number, workDate, startTime, endTime, status, employeeAVatar, address);
                result.push(domain);
            }
            this.taskList = result;
            this.dataSource = new MatTableDataSource<TaskListDomain>(this.taskList);
        }
    }

    onPaging(event: PageEvent) {
        this.selection.clear();
        if (event.pageSize !== this.pageSize) {
            this.mapPageToken = new Map();
            this.mapPageToken.set(1, 0);
            this.paginator.pageIndex = 0;
            event.pageIndex = 0;
        }
        this.pageSize = event.pageSize;
        this.offset = event.pageIndex + 1;
        this.getListTasks();

    }

    onSelectStatusChange(event: any) {
        this.getListTasks();
    }

}
