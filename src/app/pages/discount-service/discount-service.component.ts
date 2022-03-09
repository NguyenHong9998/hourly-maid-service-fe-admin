import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogChangeStatusDiscountComponent } from '@components/dialog-change-status-discount/dialog-change-status-discount.component';
import { DialogCreateDiscountServiceComponent } from '@components/dialog-create-discount-service/dialog-create-discount-service.component';
import { DialogEditDiscountServiceComponent } from '@components/dialog-edit-discount-service/dialog-edit-discount-service.component';
import { environment } from '@env/environment';
import { DiscountServiceListDomain } from './discount-service.domain';

@Component({
    selector: 'app-discount-service',
    templateUrl: './discount-service.component.html',
    styleUrls: ['./discount-service.component.scss'],
})
export class DiscountServiceComponent implements OnInit {
    displayedColumns: string[] = ['name', 'start', 'end', 'status', 'num_service', 'detail'];
    selection = new SelectionModel<any>(true, []);

    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    dataSource!: MatTableDataSource<DiscountServiceListDomain>;
    discountList: Array<DiscountServiceListDomain> = [];

    totalRow: number = 10;
    isLoading !: boolean;
    keySearch = new FormControl('');
    arrayPageSize = [10, 20, 30];
    sortObj!: Sort;
    mapPageToken = new Map();
    status!: string;
    offset !: number;

    pageSize = this.arrayPageSize[0];
    constructor(private dialog: MatDialog, public http: HttpClient) {
    }

    ngOnInit(): void {
        this.offset = 0;
        this.getDiscountServices();
    }


    getDiscountServices() {

        this.isLoading = true;

        let params = new HttpParams()
            .set('offset', this.offset)
            .set('limit', this.pageSize)
            .set('status', this.status ? this.status : '')
            .set('value_search', this.keySearch.value)
            .set('column_sort', this.sortObj && this.sortObj.direction ? this.sortObj.active.toUpperCase() : '')
            .set('type_sort', this.sortObj ? this.sortObj.direction.toUpperCase() : '');

        this.http.get(environment.apiUrl + "/discount", { params: params })
            .subscribe((res: any) => {
                this.totalRow = res.total_rows;
                this._prepareNotifyList(res.data);
                this.isLoading = false;
            }
            );
    }
    _prepareNotifyList(data: any) {
        if (data) {
            const result = Array<DiscountServiceListDomain>();
            for (let i = 0; i < data.length; i++) {
                const id = data[i].id;
                const position = i;
                const title = data[i].title;
                const startDate = data[i].start_time;
                const endDate = data[i].end_time;
                const status = data[i].public;
                const numService = data[i].number_service;
                const banner = data[i].banner;
                const domain = new DiscountServiceListDomain(id, position, title, "", banner, startDate, endDate, status, numService);

                result.push(domain);
            }
            this.discountList = result;
            console.log(this.discountList);
            this.dataSource = new MatTableDataSource<DiscountServiceListDomain>(this.discountList);
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
        this.getDiscountServices();
    }

    onSearch() {
        this.clearSort();
        this.selection.clear();
        this.getDiscountServices();
    }

    clearSort() {
        this.sort.sort({ id: '', start: 'asc', disableClear: false });
        this.sortObj = {
            active: '',
            direction: '',
        };
        this.paginator.pageIndex = 0;
    }

    sortData(sort: Sort) {
        this.sortObj = sort;
        this.paginator.pageIndex = 0;
        this.selection.clear();
        this.getDiscountServices();
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

    openDialogCreateDiscountService() {
        const dialogRef = this.dialog.open(DialogCreateDiscountServiceComponent);

        dialogRef.afterClosed().subscribe(() => {
            this.getDiscountServices();
        });
    }

    openDialogEditDiscounrService(discountId: string, discountName: string, discountStatus : string) {
        const data = { discountId, discountName };
        const dialogRef = this.dialog.open(DialogEditDiscountServiceComponent, { data });

        dialogRef.afterClosed().subscribe(() => {
            this.getDiscountServices();
        });
    }


    openDialogGetListService(discountId: string, discountName: string) {

    }

    openChangeStatusDiscount(discountId: any, discountStatus: any, startDate: string, endDate: string) {
        const startTime = new Date(startDate);
        const endTime = new Date(endDate);
        const isChange = endTime.getTime() > new Date().getTime() && startTime.getTime() <= new Date().getTime();
        const isCome = startTime.getTime() > new Date().getTime();
        const data = { discountId, discountStatus, isChange, isCome };

        if (discountStatus != 'Đang diễn ra') {
            const dialogRef = this.dialog.open(DialogChangeStatusDiscountComponent, { data });
            dialogRef.afterClosed().subscribe((data: any) => {
                if (data.isChange) {
                    this.getDiscountServices();
                }
            })
        }
    }
}
