import * as path from 'path';

export const BASE_PATH = 'https://fgo.wiki/';

export enum Path {
  IndexPage = 'w/%E8%8B%B1%E7%81%B5%E5%9B%BE%E9%89%B4'
}

export enum DataKey {
  indexData = 'csv_data'
}
const ProjectPath = path.join(__dirname, './../../');
export const LocalPath = {
  DataPath: path.join(ProjectPath, 'output/'),
  ImagePath: path.join(ProjectPath, 'images/')
};
