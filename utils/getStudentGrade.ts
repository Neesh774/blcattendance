import dayjs from "dayjs"

export default function getStudentGrade(classOf: number) {
  const currentYear = dayjs().year();
  const yearDifference = classOf - currentYear;
  // if same year and before summer, 12th grade, if after summer, graduated
  if (yearDifference === 0) {
    const currentMonth = dayjs().month();
    if (currentMonth < 6) {
      return "12"
    }
    return "Graduated"
  }
  return (12 - yearDifference).toString()
}