export type IVersion = {
  no: string,
  name: string,
  draft: boolean,
  depreciated: boolean,
  default: boolean,
}

export type IVersionTree = {
  no: string,
  name: string,
  draft: boolean,
  depreciated: boolean,
  default: boolean,
  tree: any[],
}

export type IConfig = {
  domain: string,
  cname?: string,
  versions: IVersion[],
  websiteOptions: any,
  compilerOptions: {
    apiUrl: string,
    assetsUrl: string,
    createSearchIndex: boolean,
    detectAssets: true,
  },
}

export type ISyncedVersions = {
  added: IVersion[],
  removed: IVersion[],
}
