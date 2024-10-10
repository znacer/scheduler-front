export type TaskData = {
  id: string,
  startDate: Date,
  endDate: Date,
  occupancy: number,
  title: string,
  subtitle: string,
  description: string,
  bgColor: string,
}

export type Schedule = {
  id: string,
  label: {
    icon: string,
    title: string,
    subtitle: string,
  },
  data: TaskData[]
}

export type ScheduleList = {
    id: string,
    title: string,
    subtitle: string,
    icon: string,
}

type Topbar = {
  filters: string;
  next: string;
  prev: string;
  today: string;
  view: string;
};
type Translation = {
  feelingEmpty: string;
  free: string;
  loadNext: string;
  loadPrevious: string;
  over: string;
  taken: string;
  topbar: Topbar;
  search: string;
  week: string;
};
export type LocaleType = {
  id: string;
  lang: Translation;
  translateCode: string;
  dayjsTranslations: string | ILocale | undefined;
};

