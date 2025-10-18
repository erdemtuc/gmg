export type AddCreateFieldApiModel =
  | {
      fid: string;
      value: string | string[];
    }
  | {
      fname: string;
      value: string | string[];
    };

export type CrudResponseApiModel = {
  error?: string;
  message?: string;
  id?: number;
};

export type LineApiModel = {
  fname?: string;
  value: string;
  options?: OptionApiModel[];
  Tab_name?: string;
  color?: string;
  heading_color?: string;
  fid?: string | number;
  label?: string;
  unit?: string;
  multi?: number;
};

export type OptionApiModel = {
  id: string | number;
  option: string;
};

export interface AddFormApiModel {
  top_tab_color: string;
  top_tab_heading_color: string;
  Lines: LineApiModel[];
  renderfnc: string;
}

export interface EditFormApiModel extends AddFormApiModel {
  id: string;
}
