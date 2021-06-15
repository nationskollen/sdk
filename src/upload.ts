export type UploadFieldType = string

export type UploaderFunctionSingle<T, F extends UploadFieldType> = (
    resourceId: number,
    field: F,
    file: Blob
) => Promise<T>

export type UploaderFunctionDouble<T, F extends UploadFieldType> = (
    resourceId: number,
    subResourceId: number,
    field: F,
    file: Blob
) => Promise<T>

export type UploaderFunction<T, F extends UploadFieldType> =
    | UploaderFunctionSingle<T, F>
    | UploaderFunctionDouble<T, F>
