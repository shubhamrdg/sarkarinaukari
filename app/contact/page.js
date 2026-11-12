import StaticPage from "../../components/StaticPage";

export const metadata = { title: "Contact | SarkariNaukri" };

export default function ContactPage() {
  return <StaticPage title="Contact" intro="Have a correction, feedback, or a link that needs attention?">
    <p>Email us at <a className="font-semibold text-blue-700" href="mailto:contact@sarkarinaukari.example">contact@sarkarinaukari.example</a>. Include the post title and the official source where possible.</p>
    <p>We do not accept application forms or process recruitment applications. Please contact the recruiting organization for application support.</p>
  </StaticPage>;
}
