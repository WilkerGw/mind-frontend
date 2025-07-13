import Image from "next/image";
import styles from "./page.module.css";

const BirthdayItem = ({ client }) => {
  const birthDate = new Date(client.birthDate);
  const today = new Date();
  
  const birthDayMonth = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const todayDayMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let statusClass = styles.birthdayUpcoming;
  let statusText = birthDayMonth.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

  if (birthDayMonth < todayDayMonth) {
    statusClass = styles.birthdayPassed;
  } else if (birthDayMonth.getTime() === todayDayMonth.getTime()) {
    statusClass = styles.birthdayToday;
    statusText += " (Hoje!)";
  }

  return (
    <li className={styles.birthdayItem}>
      <span>{client.fullName}</span>
      <span className={statusClass}>{statusText}</span>
    </li>
  );
};

const BirthdayCard = ({ clients }) => {
  const sortedClients = [...clients].sort((a, b) => new Date(a.birthDate).getDate() - new Date(b.birthDate).getDate());

  return (
    <div className={styles.birthdayPanel}>
      <div className={styles.panelInfo}>
        <Image src="/images/bolo-icon.png" alt="ícone de bolo" width={30} height={30} className={styles.dashIcon} />
        <h2 className={styles.totalTitle}>Aniversariantes do Mês</h2>
      </div>
      <ul className={styles.birthdayList}>
        {sortedClients.length > 0 ? (
          sortedClients.map((client) => (
            <BirthdayItem key={client._id} client={client} />
          ))
        ) : (
          <li className={styles.birthdayItem}>Nenhum aniversariante este mês</li>
        )}
      </ul>
    </div>
  );
};

export default BirthdayCard;