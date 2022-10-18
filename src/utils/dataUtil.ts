/**
 *
 * @param dataSource Thêm 1 bản ghi vào danh sách
 * @param record
 * @returns
 */
export function addToDataSource<T>(dataSource: T[], record: T) {
  return [...dataSource, record];
}

/**
 *
 * @param dataSource
 * @param record
 * @returns
 */
export function addOrUpdateToDataSource<T>(dataSource: T[], record: T, key: string = 'id'): T[] {
  const index = dataSource.findIndex((r) => r[key] === record[key]);
  const rel = [...dataSource];
  if (index >= 0) {
    rel.splice(index, 1, record);
  } else {
    rel.push(record);
  }
  return rel;
}

/**
 * Cập nhật lại một bản ghi trong một danh sách dựa vào id
 * @param dataSource
 * @param record
 * @param key
 * @returns
 */
export function updateToDataSource<T>(dataSource: T[], record: T, key: string = 'id') {
  const index = dataSource.findIndex((r) => r[key] === record[key]);
  const rel = [...dataSource];
  if (index >= 0) {
    rel.splice(index, 1, record);
  }
  return rel;
}

/**
 * Xoá 1 bản ghi trong danh sách dựa vào id
 * @param dataSource
 * @param id
 * @param key
 * @returns
 */
export function deleteFromDataSource<T>(dataSource: T[], id: any, key: string = 'id') {
  const index = dataSource.findIndex((r) => r[key] === id);
  const rel = [...dataSource];
  if (index >= 0) {
    rel.splice(index, 1);
  }
  return rel;
}

export function addOfUpdateListToDataSource<T>(
  dataSource: T[],
  recordList: T[],
  key: string = 'id',
): T[] {
  let rel = [...dataSource];
  recordList.forEach((record: T) => {
    rel = addOrUpdateToDataSource(rel, record, key);
  });
  return rel;
}

export function deleteListFromDataSource<T>(dataSource: T[], recordList: T[], key: string = 'id') {
  return dataSource.filter((d) => !recordList.some((r) => r[key] === d[key]));
}

export function deleteListIdsFromDataSource<T>(
  dataSource: T[],
  recordList: string[],
  key: string = 'id',
) {
  return dataSource.filter((d) => !recordList.some((value) => value === d[key]));
}

export const copyObject = (target: object, source: object) => {
  const keys = Object.keys(target);
  const retVal = { ...target };
  keys.forEach((k) => {
    retVal[k] = source[k];
  });
  return retVal;
};
