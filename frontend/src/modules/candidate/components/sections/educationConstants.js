const educationOptions = [
  "Doctorate/PhD",
  "Masters/Post-Graduation",
  "Graduation/Diploma",
  "12th",
  "10th",
  "Below 10th",
];

const courseTypeOptions = [
  "Full time",
  "Part time",
  "Correspondence/Distance learning",
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from(
  { length: currentYear - 1970 + 1 },
  (_, idx) => currentYear - idx
);

export { educationOptions, courseTypeOptions, yearOptions };
