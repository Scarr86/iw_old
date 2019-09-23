import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { DriveService } from '../google-service/drive.service';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { tap, expand, takeWhile, pluck, scan, finalize, switchMap } from 'rxjs/operators';
import { File } from './google-drive.component';


@Injectable({
    providedIn: 'root'
})
export class FileService implements OnDestroy, OnInit {

    _list$: BehaviorSubject<File[]> = new BehaviorSubject([]);
    list$: Observable<File[]>;
    constructor(private drive: DriveService) {
        console.log("Init service");

        this.list$ = this._list$.pipe(
            tap((v)=>console.log(v)),
            finalize(() => {
                console.log("unsabscribe file_service")
            }))
        // console.log(this._list$.getValue());
    }

    ngOnInit() {
        console.log("Init service");

    }
    ngOnDestroy() {
        console.log("destroy file service");


    }

    getList() {
        from(this.drive.list(1)).pipe(
            tap(() => console.log("list")),
            expand((res) => {
                // this.cdr.detectChanges();
                // if(!res.result.nextPageToken) return empty();
                return this.drive.list(1, res.result.nextPageToken)
            }),
            takeWhile((res) => !!res.result.nextPageToken, true),
            pluck('result', 'files'),
            scan((acc, f) => acc.concat(f), []),
        ).subscribe(
            (fl) => this._list$.next(fl)
        )
    }

    deletFile(id: string) {
        // this.drive.delete(id)
        of(1).pipe(
            switchMap(() => {
                return this._list$;
            })
        )
            .subscribe(
                (v) => {

                },
                (err: Error) => console.error(err.message),
                () => {
                    console.log("complite");

                }
            )
    }
}
