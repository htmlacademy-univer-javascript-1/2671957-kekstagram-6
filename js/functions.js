// Проверка, помещается ли встреча в рабочие часы
function isMeetingWithinWorkday(workStart, workEnd, meetingStart, durationMinutes) {
  // Перевод "часы:минуты" -> минуты с начала суток
  const toMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const workStartMins = toMinutes(workStart);
  const workEndMins = toMinutes(workEnd);
  const meetingStartMins = toMinutes(meetingStart);
  const meetingEndMins = meetingStartMins + durationMinutes;

  return meetingStartMins >= workStartMins && meetingEndMins <= workEndMins;
}

// eslint-disable-next-line no-console
console.log(isMeetingWithinWorkday('08:00', '17:30', '14:00', 90)); // должно вывести true
