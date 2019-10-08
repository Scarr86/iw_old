import { Injectable, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DriveService } from '../google-service/drive.service';
import { BehaviorSubject, Observable, from, of, Subject } from 'rxjs';
import { tap, expand, takeWhile, pluck, scan, finalize, switchMap, take, map, filter, flatMap, delay, combineAll, publishReplay, refCount } from 'rxjs/operators';
import { File } from './google-drive.component';
import { identifierModuleUrl } from '@angular/compiler';


@Injectable({
    providedIn: 'root'
})
export class FileService implements OnDestroy, OnInit {

    _list$: BehaviorSubject<File[]> = new BehaviorSubject([]);
    // _list$:Subject<File[]> = new Subject();
    list$: Observable<File[]>;
    constructor(private drive: DriveService) {
        console.log("Init service");

        this.list$ = this._list$.pipe(
            tap((v) => {
                // this.cdr.detectChanges();
                console.log("_list$", v)
            }),
            finalize(() => {
                console.log("unsabscribe file_service")
            }))
        // publishReplay(),
        // refCount()
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
            expand((res) => {
                // this.cdr.detectChanges();
                // if(!res.result.nextPageToken) return empty();
                return this.drive.list(1, res.result.nextPageToken)
            }),
            takeWhile(res => !!res.result.nextPageToken, true),
            pluck('result', 'files'),
            scan((acc, f) => acc.concat(f), []),
        ).subscribe(
            (fl) => this._list$.next(fl)
        )
    }

    deletFile(id: string) {
        console.log("delete");
        this.drive.delete(id)
            .pipe(
                switchMap(() => this.list$),
                take(1),
            )
            .subscribe(
                (v) => this._list$.next(v.filter((f) => f.id != id)),
                (err: Error) => console.error(err.message),
                () => {
                    console.log("complite");
                }
            )
    }
    createFile(name: string, text: string) {
        let cnt = 0;
        this.drive.create(name, text).pipe(
            pluck("result"),
            switchMap((r) => {
                return this.list$.pipe(map(fl => [{ id: r.id, name: r.name, mimeType: r.mimeType }, ...fl]))
            }),
            take(1)
        ).subscribe(
            fl => this._list$.next(fl)
        );


    }

    updateFile(id, name, text) {

        this.drive.update(id, { name: name, data: text })
            .pipe(
                switchMap(() => this.list$),
                take(1),
            ).subscribe(
                (fl) => {
                    let file = fl.find(f => f.id === id);
                    if (file) {
                        file.name = name;
                        file.mimeType
                    }
                    this._list$.next(fl);
                }
            )
    }

    getText(id: string) {

        this.drive.text(id).pipe(
            pluck("body"),
            switchMap((text) => {
                return this.list$.pipe(
                    switchMap(fl => from(fl)),
                    filter(f => f.id === id),

                )
            })
        ).subscribe(
            (res => console.log(res))
        )
        // this.list$
        // .pipe(
        //     switchMap(fl =>  from(fl)),
        //     take(1),
        //     filter(f=> f.id === id),
        //     switchMap
        // )  
        // .subscribe(
        //     (v)=>console.log(v)

        // )

    }
}
