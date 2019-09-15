
/// <reference path="../../../node_modules/@types/gapi.client.drive/index.d.ts" />
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class DriveService {

    constructor() {
    }

    list(size: number, nextPageToken?: string) {

        if (!nextPageToken) {
            nextPageToken = "";
        }
        return from(gapi.client.drive.files.list({
            'pageSize': size,
            'fields': "nextPageToken, files(id, name, mimeType )",
            // 'fields': "*",
            'pageToken': nextPageToken
        })).pipe(tap(
            (res) => console.info(`LIST   size ${res.result.files.length}`),
            (err) => console.error("LIST    fail", err)
        ));
    }

    text(id: string) {
        return from(gapi.client.drive.files.get({
            fileId: id,
            alt: 'media',
            fields: "body"
        })).pipe(
            tap(
                (res) => console.info(`TEXT   id: ${id}`),
                (err) => console.error(`TEXT    fail    id: ${id}`, err)
            ));
    }

    create(name: string, data?: string): Observable<gapi.client.Response<gapi.client.drive.File>> {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const contentType = 'application/json';

        if (name === undefined || name === "") {
            name = "default name.txt";

        }
        console.log(data);
        
        if (data === undefined) {
            data = "";
        }

        var metadata = {
            'name': name,
            'mimeType': contentType
        };

        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json \r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json \r\n\r\n' +
            data +
            // JSON.stringify(data, null, 2) +
            close_delim;

        return from(gapi.client.request<gapi.client.drive.File>({
            path: '/upload/drive/v3/files',
            method: 'POST',
            params: { 'uploadType': 'multipart' },
            headers: {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            body: multipartRequestBody
        })).pipe(
            tap(
                (res) => console.info(`CREATE   ${res.result.name}`),
                (err) => console.error("CREATE    fail    ${id}", err)
            )
        );
    }


    delete(id: string) {
        return from(gapi.client.drive.files.delete({ fileId: id }))
            .pipe(tap(
                (res) => console.info(`DELETE   id: ${id}`),
                (err) => console.error(`DELETE    fail    id: ${id}`, err)
            ));
    }
    update(id: string, upd: { name?: string, data?: string }) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const contentType = 'application/json';

        if (upd.name === undefined) {
            upd.name = "";
        }
        if (upd.data === undefined) {
            upd.data = "";
        }
        var metadata = {
            'name': upd.name,
            'mimeType': contentType,
        };

        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json \r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json \r\n\r\n' +
            upd.data +
            // JSON.stringify(data, null, 2) +
            close_delim;



        return from(gapi.client.request({
            path: '/upload/drive/v3/files/' + id,
            method: 'PATCH',
            params: { 'uploadType': 'multipart', 'alt': 'json' },
            headers: {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            body: multipartRequestBody
        })).pipe(
            tap(
                (res) => console.info(`UPDATE   id: ${id}`),
                (err) => console.error(`UPDATE    fail    ${id}`, err)
            ));
    }



}