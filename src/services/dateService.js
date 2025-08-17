async function getHolidays(year) {
  try {
    const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
    if (!response.ok) {
      console.error("Falha ao buscar feriados.");
      return [];
    }
    const holidays = await response.json();
    return holidays;
  } catch (error) {
    console.error("Erro ao conectar à API de feriados:", error);
    return [];
  }
}

export async function isWorkingDay() {
  const today = new Date();
  const dayOfWeek = today.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  const year = today.getFullYear();
  const holidays = await getHolidays(year);
  
  const todayString = today.toISOString().split('T')[0];

  const isHoliday = holidays.some(holiday => holiday.date === todayString);

  if (isHoliday) {
    return false;
  }

  return true;
}
