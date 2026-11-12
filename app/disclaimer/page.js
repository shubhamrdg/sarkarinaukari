import StaticPage from "../../components/StaticPage";

export const metadata = { title: "Disclaimer | SarkariNaukri" };

export default function DisclaimerPage() {
  return <StaticPage title="Disclaimer" intro="Please read this information before relying on any update published here.">
    <p>SarkariNaukri is an independent information portal. We are not affiliated with any government department, commission, board, or recruiting organization unless explicitly stated.</p>
    <p>Information is provided for general reference and may change. Official notifications and websites are the final authority for dates, eligibility, fees, vacancies, and application status.</p>
  </StaticPage>;
}
