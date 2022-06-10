export interface IEncryption{
    publicEncrypt(key:string, data: string): string;
    privateDecrypt(key:string, data: string): string;
    privateEncrypt(key:string, data: string): string;
    publicDecrypt(key:string, data: string): string;
}
