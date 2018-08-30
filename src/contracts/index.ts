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

export type IZone = {
  slug: string,
  name?: string,
  versions: IVersion[]
}

export type IConfig = {
  domain: string,
  cname?: string,
  zones: IZone[],
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
  updated: IVersion[]
}

export type ISyncedZone = {
  slug: string,
  name?: string,
  versions: ISyncedVersions
}

export type ISyncedZones = {
  added: ISyncedZone[],
  updated: ISyncedZone[],
  removed: {slug: string, name?: string, versions: IVersion[]}[]
}
