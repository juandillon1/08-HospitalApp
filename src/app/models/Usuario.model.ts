export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public pass: string,
        public img?: string,
        public role?: string,
        public google?: boolean,
        // tslint:disable-next-line: variable-name
        public _id?: string
    ) {}
}
