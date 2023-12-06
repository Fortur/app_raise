"use client";
import styles from './page.module.css'
import EmployeeChart from "@/app/elements/emploeeChart";

export default function Home() {
  return (
    <main className={styles.main}>
      <EmployeeChart/>
    </main>
  )
}
