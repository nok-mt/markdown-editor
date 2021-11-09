import { useState } from "react"; //reactから関数"useState"を読み込む

export const useStateWithStorage = (
  //カスタムフック"useStateWithStorage"を宣言
  init: string, //第一引数にinit=初期値を設定
  key: string //第二引数にローカルストレージから呼び出すキーを設定
): [string, (s: string) => void] => {
  //引数の型と戻り値の型を設定
  const [value, setValue] = useState<string>(localStorage.getItem(key) || init); //useStateを使用し、値にvalue、更新する関数にsetValue、valueの初期値にローカルストレージに保存されているアイテム or initを代入

  const setValueWithStorage = (nextValue: string): void => {
    //引数にnextValuを受け取る関数を作成
    setValue(nextValue); //nextvalueをvalueに上書き
    localStorage.setItem(key, nextValue); //ローカルストレージにデータを保存する（key: key, value: nextvalue）
  };

  return [value, setValueWithStorage];
};
