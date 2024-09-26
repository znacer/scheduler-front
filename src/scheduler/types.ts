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

export type MockedSchedule = {
  id: string,
  label: {
    icon: string,
    title: string,
    subtitle: string,
  },
  data: TaskData[]

}
